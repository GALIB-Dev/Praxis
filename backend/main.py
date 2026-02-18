"""
Praxis Backend - FastAPI + Google Gemini
Real AI-powered skill extraction from video and image uploads.

Run: uvicorn main:app --reload
Requires: GEMINI_API_KEY in .env
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
import os
import json
import tempfile
import mimetypes
from datetime import datetime
from dotenv import load_dotenv

# ── Gemini SDK ──────────────────────────────────────────────────────────────
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=AIzaSyA1D0BeToT7TW0AIOvXxf4eOqIdmICWdro)

# Model used for video/image analysis
GEMINI_MODEL = "gemini-1.5-flash"

# ── FastAPI setup ────────────────────────────────────────────────────────────
app = FastAPI(
    title="Praxis API",
    description="Video/Image skill verification powered by Google Gemini",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.0.100:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Models ──────────────────────────────────────────────────────────

class Skill(BaseModel):
    name: str
    level: int        # 1–3
    verified: bool
    confidence: Optional[float] = None   # 0.0–1.0 from Gemini


class Job(BaseModel):
    title: str
    match: int        # 0–100
    salary: Optional[str] = None
    reason: Optional[str] = None


class GeminiAnalysis(BaseModel):
    summary: str
    detected_skills: List[str]
    confidence_score: float           # 0.0–1.0
    language_detected: Optional[str] = None
    raw_transcript: Optional[str] = None
    media_type: str                   # "video" | "image"


class ProcessingResponse(BaseModel):
    processing_id: str
    gemini_available: bool


class ProcessingStatusResponse(BaseModel):
    status: str   # "processing" | "done" | "failed"
    analysis: Optional[GeminiAnalysis] = None


class SkillsResponse(BaseModel):
    user: str
    skills: List[Skill]
    analysis: Optional[GeminiAnalysis] = None


class JobsResponse(BaseModel):
    jobs: List[Job]


# ── In-memory store ──────────────────────────────────────────────────────────
processing_store: dict = {}
skills_store: dict = {}
jobs_store: dict = {}
analysis_store: dict = {}


# ── Gemini helpers ────────────────────────────────────────────────────────────

SKILL_EXTRACTION_PROMPT = """
You are an expert workforce analyst. Analyse the provided media (video or image) and:

1. Identify every professional, technical, or vocational skill demonstrated or mentioned.
2. Rate each skill on a scale of 1–3 (1=basic, 2=intermediate, 3=expert) based on evidence.
3. Assign a confidence score (0.0–1.0) to each skill.
4. Detect the primary language used (e.g. Bangla, English, mixed).
5. Provide a concise summary (2–3 sentences) of what the person demonstrated.
6. If it is a video, transcribe the spoken content briefly.

Respond ONLY with valid JSON in this exact structure (no markdown, no extra text):
{
  "summary": "...",
  "detected_skills": ["skill1", "skill2", ...],
  "skill_details": [
    {"name": "skill1", "level": 2, "confidence": 0.9},
    ...
  ],
  "confidence_score": 0.85,
  "language_detected": "Bangla/English/Mixed",
  "raw_transcript": "..."
}
"""

JOB_MATCHING_PROMPT = """
You are a recruiter matching a candidate to Bangladesh job market opportunities.

Given these verified skills: {skills}
And this analysis summary: {summary}

Suggest exactly 3 realistic job matches. For each job provide:
- title (in English and/or Bangla)
- match_score (0–100)
- salary_range (realistic BDT range)
- reason (one sentence citing specific evidence)

Respond ONLY with valid JSON, no markdown:
{{
  "jobs": [
    {{"title": "...", "match_score": 85, "salary_range": "৳25,000–30,000", "reason": "..."}},
    ...
  ]
}}
"""


def _safe_json(text: str) -> dict:
    """Strip markdown fences and parse JSON from Gemini response."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        text = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
    return json.loads(text)


async def analyse_with_gemini(file_bytes: bytes, mime_type: str, is_video: bool) -> GeminiAnalysis:
    """Upload file to Gemini Files API and run skill extraction."""
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY not configured. Add it to backend/.env"
        )

    model = genai.GenerativeModel(GEMINI_MODEL)

    # Write to a temp file so the Gemini Files API can upload it
    suffix = ".mp4" if is_video else (".jpg" if "jpeg" in mime_type else ".png")
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        uploaded = genai.upload_file(path=tmp_path, mime_type=mime_type)

        # For video, wait until Gemini finishes processing the file
        if is_video:
            import time
            while uploaded.state.name == "PROCESSING":
                time.sleep(2)
                uploaded = genai.get_file(uploaded.name)
            if uploaded.state.name == "FAILED":
                raise HTTPException(status_code=422, detail="Gemini failed to process the video file.")

        response = model.generate_content(
            [uploaded, SKILL_EXTRACTION_PROMPT],
            generation_config={"temperature": 0.2},
        )

        data = _safe_json(response.text)

        return GeminiAnalysis(
            summary=data.get("summary", ""),
            detected_skills=data.get("detected_skills", []),
            confidence_score=float(data.get("confidence_score", 0.7)),
            language_detected=data.get("language_detected"),
            raw_transcript=data.get("raw_transcript"),
            media_type="video" if is_video else "image",
        ), data.get("skill_details", [])

    finally:
        os.unlink(tmp_path)


def _build_skills(skill_details: list, detected_skills: list) -> List[Skill]:
    """Turn Gemini skill_details into Skill objects."""
    if skill_details:
        return [
            Skill(
                name=s.get("name", "Unknown"),
                level=max(1, min(3, int(s.get("level", 2)))),
                verified=True,
                confidence=float(s.get("confidence", 0.8)),
            )
            for s in skill_details
        ]
    # Fallback: plain list without levels
    return [Skill(name=s, level=2, verified=True, confidence=0.75) for s in detected_skills]


async def match_jobs_with_gemini(skills: List[Skill], summary: str) -> List[Job]:
    """Ask Gemini to match skills to jobs."""
    if not GEMINI_API_KEY:
        return []

    model = genai.GenerativeModel(GEMINI_MODEL)
    skill_names = ", ".join(s.name for s in skills)
    prompt = JOB_MATCHING_PROMPT.format(skills=skill_names, summary=summary)

    response = model.generate_content(
        prompt,
        generation_config={"temperature": 0.3},
    )
    data = _safe_json(response.text)

    return [
        Job(
            title=j.get("title", ""),
            match=int(j.get("match_score", 70)),
            salary=j.get("salary_range"),
            reason=j.get("reason"),
        )
        for j in data.get("jobs", [])
    ]


# ── Fallback mock data (used when Gemini key is absent) ──────────────────────

def _mock_skills() -> List[Skill]:
    return [
        Skill(name="ইট বসানো", level=3, verified=True, confidence=0.9),
        Skill(name="সিমেন্ট মিশ্রণ", level=2, verified=True, confidence=0.8),
        Skill(name="নির্মাণ তত্ত্বাবধান", level=2, verified=True, confidence=0.75),
    ]

def _mock_analysis(media_type: str) -> GeminiAnalysis:
    return GeminiAnalysis(
        summary="Mock analysis – add GEMINI_API_KEY for real results.",
        detected_skills=["ইট বসানো", "সিমেন্ট মিশ্রণ", "নির্মাণ তত্ত্বাবধান"],
        confidence_score=0.8,
        language_detected="Bangla",
        raw_transcript=None,
        media_type=media_type,
    )

def _mock_jobs() -> List[Job]:
    return [
        Job(title="সাইট ফোরম্যান", match=85, salary="৳25,000–30,000", reason="ভিডিওতে সঠিক ইট বসানোর প্রমাণ"),
        Job(title="নির্মাণ কর্মচারী", match=72, salary="৳18,000–22,000", reason="সিমেন্ট মিশ্রণ দক্ষতা প্রদর্শিত"),
        Job(title="প্রকল্প ব্যবস্থাপক", match=65, salary="৳35,000–45,000", reason="তত্ত্বাবধান অভিজ্ঞতা"),
    ]


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "message": "Praxis API v2 is running",
        "gemini_configured": bool(GEMINI_API_KEY),
        "gemini_model": GEMINI_MODEL,
    }


@app.post("/upload-video", response_model=ProcessingResponse)
async def upload_video(
    video: UploadFile = File(...),
    user_id: str = None,
):
    """
    Upload a video file. Gemini extracts skills, transcript, and job matches.
    Supports: mp4, webm, mov, avi, mkv
    """
    if not video:
        raise HTTPException(status_code=400, detail="Video file required")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID required")

    processing_id = str(uuid.uuid4())
    content = await video.read()
    mime_type = video.content_type or "video/mp4"

    processing_store[processing_id] = {
        "user_id": user_id,
        "status": "processing",
        "media_type": "video",
        "created_at": datetime.now().isoformat(),
    }

    try:
        if GEMINI_API_KEY:
            analysis, skill_details = await analyse_with_gemini(content, mime_type, is_video=True)
            skills = _build_skills(skill_details, analysis.detected_skills)
            jobs = await match_jobs_with_gemini(skills, analysis.summary)
        else:
            analysis = _mock_analysis("video")
            skills = _mock_skills()
            jobs = _mock_jobs()

        analysis_store[processing_id] = analysis
        skills_store[processing_id] = skills
        jobs_store[processing_id] = jobs
        processing_store[processing_id]["status"] = "done"

    except HTTPException:
        raise
    except Exception as e:
        processing_store[processing_id]["status"] = "failed"
        raise HTTPException(status_code=500, detail=f"Gemini processing error: {str(e)}")

    return ProcessingResponse(
        processing_id=processing_id,
        gemini_available=bool(GEMINI_API_KEY),
    )


@app.post("/upload-image", response_model=ProcessingResponse)
async def upload_image(
    image: UploadFile = File(...),
    user_id: str = None,
):
    """
    Upload an image (certificate, work photo, ID). Gemini analyses skills visible in the image.
    Supports: jpg, jpeg, png, webp, gif
    """
    if not image:
        raise HTTPException(status_code=400, detail="Image file required")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID required")

    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"}
    mime_type = image.content_type or "image/jpeg"
    if mime_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image type: {mime_type}. Allowed: {', '.join(allowed_types)}"
        )

    processing_id = str(uuid.uuid4())
    content = await image.read()

    processing_store[processing_id] = {
        "user_id": user_id,
        "status": "processing",
        "media_type": "image",
        "created_at": datetime.now().isoformat(),
    }

    try:
        if GEMINI_API_KEY:
            analysis, skill_details = await analyse_with_gemini(content, mime_type, is_video=False)
            skills = _build_skills(skill_details, analysis.detected_skills)
            jobs = await match_jobs_with_gemini(skills, analysis.summary)
        else:
            analysis = _mock_analysis("image")
            skills = _mock_skills()
            jobs = _mock_jobs()

        analysis_store[processing_id] = analysis
        skills_store[processing_id] = skills
        jobs_store[processing_id] = jobs
        processing_store[processing_id]["status"] = "done"

    except HTTPException:
        raise
    except Exception as e:
        processing_store[processing_id]["status"] = "failed"
        raise HTTPException(status_code=500, detail=f"Gemini processing error: {str(e)}")

    return ProcessingResponse(
        processing_id=processing_id,
        gemini_available=bool(GEMINI_API_KEY),
    )


@app.get("/processing-status", response_model=ProcessingStatusResponse)
async def get_processing_status(id: str = Query(...)):
    if id not in processing_store:
        raise HTTPException(status_code=404, detail="Processing ID not found")

    return ProcessingStatusResponse(
        status=processing_store[id]["status"],
        analysis=analysis_store.get(id),
    )


@app.get("/skills", response_model=SkillsResponse)
async def get_skills(id: str = Query(...)):
    if id not in skills_store:
        raise HTTPException(status_code=404, detail="Skills not found for this ID")

    return SkillsResponse(
        user="Guest User",
        skills=skills_store[id],
        analysis=analysis_store.get(id),
    )


@app.get("/jobs", response_model=JobsResponse)
async def get_jobs(id: str = Query(...)):
    if id not in jobs_store:
        raise HTTPException(status_code=404, detail="Jobs not found for this ID")

    return JobsResponse(jobs=jobs_store[id])


# ── Error Handlers ───────────────────────────────────────────────────────────

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {"error": True, "status_code": exc.status_code, "detail": exc.detail}


# ── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


# Enable CORS for local development and Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.0.100:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== Models =====

class Skill(BaseModel):
    name: str
    level: int  # 1-3
    verified: bool


class SkillsResponse(BaseModel):
    user: str
    skills: List[Skill]


class Job(BaseModel):
    title: str
    match: int  # 0-100
    salary: Optional[str] = None
    reason: Optional[str] = None


class JobsResponse(BaseModel):
    jobs: List[Job]


class ProcessingResponse(BaseModel):
    processing_id: str


class ProcessingStatusResponse(BaseModel):
    status: str  # "processing", "done", "failed"


# ===== In-Memory Storage (for MVP) =====
# In production, use PostgreSQL or similar

processing_store = {}
skills_store = {}
jobs_store = {}


# ===== Endpoints =====

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Praxis API is running"}


@app.post("/upload-video", response_model=ProcessingResponse)
async def upload_video(
    video: UploadFile = File(...),
    user_id: str = None,
):
    """
    Upload video for skill extraction
    
    - **video**: Video file (webm, mp4)
    - **user_id**: User identifier
    
    Returns: processing_id for status tracking
    """
    if not video:
        raise HTTPException(status_code=400, detail="Video file required")

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID required")

    # Generate processing ID
    processing_id = str(uuid.uuid4())

    # In production, save video to S3/GCS and queue for processing
    # For MVP, we'll simulate processing and store mock data
    
    # Read and discard video (or store for demo)
    content = await video.read()
    file_size = len(content)

    # Store processing state
    processing_store[processing_id] = {
        "user_id": user_id,
        "status": "processing",
        "file_size": file_size,
        "created_at": datetime.now().isoformat(),
    }

    # Simulate skill extraction (in production, call ML API)
    # For now, we'll return mock skills after 2-3 status checks
    skills_store[processing_id] = [
        Skill(name="ইট বসানো", level=3, verified=True),
        Skill(name="সিমেন্ট মিশ্রণ", level=2, verified=True),
        Skill(name="নির্মাণ তত্ত্বাবধান", level=2, verified=True),
    ]

    # Simulate job matching
    jobs_store[processing_id] = [
        Job(
            title="সাইট ফোরম্যান",
            match=85,
            salary="৳25,000–30,000",
            reason="ভিডিওতে সঠিক ইট বসানোর প্রমাণ পাওয়া গেছে"
        ),
        Job(
            title="নির্মাণ কর্মচারী",
            match=72,
            salary="৳18,000–22,000",
            reason="সিমেন্ট মিশ্রণ এবং নিরাপত্তা সচেতনতা দেখা গেছে"
        ),
        Job(
            title="প্রকল্প ব্যবস্থাপক",
            match=65,
            salary="৳35,000–45,000",
            reason="নির্মাণ অভিজ্ঞতা এবং তত্ত্বাবধান দক্ষতা প্রদর্শিত হয়েছে"
        ),
    ]

    return ProcessingResponse(processing_id=processing_id)


@app.get("/processing-status", response_model=ProcessingStatusResponse)
async def get_processing_status(id: str = Query(...)):
    """
    Check processing status
    
    - **id**: processing_id from upload-video
    
    Returns: status (processing, done, failed)
    """
    if id not in processing_store:
        raise HTTPException(status_code=404, detail="Processing ID not found")

    # Simulate processing (mark as done after multiple checks)
    processing_store[id]["status"] = "done"

    return ProcessingStatusResponse(status=processing_store[id]["status"])


@app.get("/skills", response_model=SkillsResponse)
async def get_skills(id: str = Query(...)):
    """
    Get verified skills for a processing ID
    
    - **id**: processing_id from upload-video
    
    Returns: list of skills with verification status
    """
    if id not in skills_store:
        raise HTTPException(status_code=404, detail="Skills not found for this ID")

    return SkillsResponse(user="Guest User", skills=skills_store[id])


@app.get("/jobs", response_model=JobsResponse)
async def get_jobs(id: str = Query(...)):
    """
    Get matched jobs for a processing ID
    
    - **id**: processing_id from upload-video
    
    Returns: list of job matches with scores
    """
    if id not in jobs_store:
        raise HTTPException(status_code=404, detail="Jobs not found for this ID")

    return JobsResponse(jobs=jobs_store[id])


# ===== Error Handlers =====

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": True,
        "status_code": exc.status_code,
        "detail": exc.detail,
    }


# ===== Main =====

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
