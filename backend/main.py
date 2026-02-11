"""
Praxis Backend - FastAPI
Production-ready MVP for skill verification and job matching

Run: uvicorn main:app --reload
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
import os
from datetime import datetime

# Initialize app
app = FastAPI(
    title="Praxis API",
    description="Video-based skill verification and job matching",
    version="1.0.0"
)

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
