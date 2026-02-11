# Praxis MVP - Completion Steps

This document provides step-by-step instructions to complete the MVP implementation.

## ✅ Completed

- [x] API service layer (`src/services/api.ts`)
- [x] Video utilities (`src/utils/video.ts`)  
- [x] Bangla text constants (`src/constants/bangla.ts`)
- [x] TypeScript interfaces (`src/types/api.ts`)
- [x] Login page (`src/app/login/page.tsx`)
- [x] Start page (`src/app/start/page.tsx`)
- [x] Record page (partially - MediaRecorder logic ready)
- [x] FastAPI backend (`backend/main.py`)
- [x] UI components updated (Button, Card, Input, Alert)
- [x] Theme redesigned (indigo/teal palette)

---

## 🔧 Steps to Complete

### Step 1: Replace Record Page Content

Replace `src/app/record/page.tsx` with this simplified version that doesn't import old components:

```typescript
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { BANGLA_TEXT } from "@/constants/bangla";
import { formatDuration, validateVideoBlob, compressVideoBlob } from "@/utils/video";
import { apiService } from "@/services/api";

const MAX_DURATION = 30000; // 30 seconds in ms

export default function RecordPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/login");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        setError("ক্যামেরা অ্যাক্সেস প্রয়োজন");
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [router]);

  // Start recording
  const handleStartRecording = () => {
    if (!videoRef.current?.srcObject) {
      setError("ক্যামেরা প্রস্তুত নয়");
      return;
    }

    chunksRef.current = [];
    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      setIsRecording(false);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setDuration(0);
    setError(null);

    // Auto-stop at MAX_DURATION
    durationInterval.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= MAX_DURATION) {
          handleStopRecording();
          return prev;
        }
        return prev + 100;
      });
    }, 100);
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (durationInterval.current) clearInterval(durationInterval.current);
    }
  };

  // Retake
  const handleRetake = () => {
    setRecordedBlob(null);
    setDuration(0);
    setError(null);
  };

  // Submit video
  const handleSubmitVideo = async () => {
    if (!recordedBlob) {
      setError("ভিডিও পাওয়া যায়নি");
      return;
    }

    const validation = validateVideoBlob(recordedBlob);
    if (!validation.valid) {
      setError(validation.error || "ভিডিও অবৈধ");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }

      const compressedBlob = await compressVideoBlob(recordedBlob);
      const response = await apiService.uploadVideo(compressedBlob, userId);

      localStorage.setItem("processingId", response.processing_id);
      router.push("/processing");
    } catch (err: any) {
      setError(err.message || "পাঠানো ব্যর্থ");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-white text-2xl font-bold text-center mb-4">{BANGLA_TEXT.RECORD_TITLE}</h1>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="w-full max-w-md">
        {recordedBlob ? (
          <div className="space-y-4">
            <video src={URL.createObjectURL(recordedBlob)} controls className="w-full rounded-2xl bg-slate-900 aspect-video object-cover" />
            <p className="text-white text-center text-sm">সময়: {formatDuration(duration)}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRetake} className="flex-1 text-white border-white">
                {BANGLA_TEXT.RECORD_RETAKE}
              </Button>
              <Button onClick={handleSubmitVideo} disabled={loading} isLoading={loading} className="flex-1">
                {BANGLA_TEXT.RECORD_SUBMIT}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-red-500 mb-2 animate-pulse">⏺</div>
                    <p className="text-white text-2xl font-bold">{formatDuration(duration)}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-white text-center text-sm">{BANGLA_TEXT.RECORD_INSTRUCTION}</p>
            {!isRecording ? (
              <Button onClick={handleStartRecording} disabled={!cameraActive || loading} className="w-full py-4 text-lg">
                {BANGLA_TEXT.RECORD_START}
              </Button>
            ) : (
              <Button onClick={handleStopRecording} variant="danger" className="w-full py-4 text-lg">
                {BANGLA_TEXT.RECORD_STOP}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-white text-center text-xs space-y-2">
        <p>📹 ক্যামেরা এবং মাইক অনুমতি দরকার</p>
        <p>⏱ সর্বোচ্চ ৩০ সেকেন্ড</p>
      </div>
    </div>
  );
}
```

### Step 2: Create Processing Page

Replace `src/app/processing/page.tsx`:

```typescript
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BANGLA_TEXT } from "@/constants/bangla";
import { apiService } from "@/services/api";

export default function ProcessingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"processing" | "done" | "failed">("processing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const processingId = localStorage.getItem("processingId");
      if (!processingId) {
        router.push("/login");
        return;
      }

      try {
        const response = await apiService.getProcessingStatus(processingId);
        setStatus(response.status);

        if (response.status === "processing") {
          setStep((prev) => (prev < 3 ? prev + 1 : 3));
          setTimeout(checkStatus, 2000);
        } else if (response.status === "done") {
          setStep(3);
          setTimeout(() => router.push("/skills"), 1000);
        } else {
          setError("দক্ষতা যাচাই ব্যর্থ");
        }
      } catch (err: any) {
        setError(err.message || "স্থিতি চেক ব্যর্থ");
      }
    };

    checkStatus();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{BANGLA_TEXT.PROCESSING_TITLE}</h1>
        <div className="mb-8"><LoadingSpinner /></div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-4 rounded-2xl ${step >= i ? "bg-indigo-50 border-2 border-primary" : "bg-slate-100"}`}>
              <p className={step >= i ? "text-slate-900 font-bold" : "text-slate-600"}>
                {i === 1 && BANGLA_TEXT.PROCESSING_STEP_1}
                {i === 2 && BANGLA_TEXT.PROCESSING_STEP_2}
                {i === 3 && BANGLA_TEXT.PROCESSING_STEP_3}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-8 p-4 bg-rose-50 text-rose-900 rounded-2xl border border-rose-200">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Create Skills Page

Create `src/app/skills/page.tsx`:

```typescript
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BANGLA_TEXT } from "@/constants/bangla";
import { Skill } from "@/types/api";
import { apiService } from "@/services/api";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      const processingId = localStorage.getItem("processingId");
      if (!processingId) {
        router.push("/login");
        return;
      }

      try {
        const response = await apiService.getSkills(processingId);
        setSkills(response.skills);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [router]);

  const getLevelText = (level: number) => {
    const levels = {
      1: BANGLA_TEXT.SKILLS_LEVEL_1,
      2: BANGLA_TEXT.SKILLS_LEVEL_2,
      3: BANGLA_TEXT.SKILLS_LEVEL_3,
    };
    return levels[level as keyof typeof levels] || "জানা নেই";
  };

  const handleViewJobs = () => {
    router.push("/jobs");
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{BANGLA_TEXT.SKILLS_TITLE}</h1>
        <p className="text-slate-600 mb-8">✓ আমাদের এআই এই দক্ষতা সনাক্ত করেছে</p>

        {error && (
          <Card className="mb-6 bg-rose-50 border-rose-200">
            <p className="text-rose-900">{error}</p>
          </Card>
        )}

        {skills.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-600">{BANGLA_TEXT.SKILLS_EMPTY}</p>
            <Button onClick={() => router.push("/record")} className="mt-4">
              {BANGLA_TEXT.RECORD_TITLE}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4 mb-8">
            {skills.map((skill) => (
              <Card key={skill.name} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{skill.name}</h3>
                  {skill.verified && <span className="text-sm font-bold text-emerald-600">✓ {BANGLA_TEXT.SKILLS_VERIFIED}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(skill.level / 3) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-600 w-24">{getLevelText(skill.level)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button onClick={handleViewJobs} className="w-full py-4 text-lg">
          💼 {BANGLA_TEXT.JOBS_TITLE}
        </Button>
      </div>
    </div>
  );
}
```

### Step 4: Create Jobs Page

Create `src/app/jobs/page.tsx`:

```typescript
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BANGLA_TEXT } from "@/constants/bangla";
import { Job } from "@/types/api";
import { apiService } from "@/services/api";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const processingId = localStorage.getItem("processingId");
      if (!processingId) {
        router.push("/login");
        return;
      }

      try {
        const response = await apiService.getJobs(processingId);
        setJobs(response.jobs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{BANGLA_TEXT.JOBS_TITLE}</h1>

        {error && (
          <Card className="mb-6 bg-rose-50 border-rose-200">
            <p className="text-rose-900">{error}</p>
          </Card>
        )}

        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-600 mb-4">{BANGLA_TEXT.JOBS_EMPTY}</p>
            <Button onClick={() => router.push("/start")}>আবার চেষ্টা করুন</Button>
          </Card>
        ) : (
          <div className="space-y-4 mb-8">
            {jobs.map((job, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">{job.title}</h3>
                    {job.salary && <p className="text-sm text-slate-600 mt-1">মাসিক: {job.salary}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{job.match}%</div>
                    <p className="text-xs text-slate-600">{BANGLA_TEXT.JOBS_MATCH}</p>
                  </div>
                </div>

                {job.reason && (
                  <>
                    <button
                      onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                      className="text-sm text-primary font-semibold mb-3 hover:underline"
                    >
                      {expandedId === idx ? "কম দেখান" : BANGLA_TEXT.JOBS_WHY} ▼
                    </button>
                    {expandedId === idx && (
                      <p className="text-sm text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg">{job.reason}</p>
                    )}
                  </>
                )}

                <Button className="w-full">{BANGLA_TEXT.JOBS_APPLY}</Button>
              </Card>
            ))}
          </div>
        )}

        <Button variant="outline" onClick={() => router.push("/start")} className="w-full">
          শুরু থেকে আবার করুন
        </Button>
      </div>
    </div>
  );
}
```

---

## 🚀 Run the Complete Application

### Terminal 1: Frontend
```bash
npm run dev
# http://localhost:3000
```

### Terminal 2: Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Test Flow
1. Go to http://localhost:3000/login
2. Enter: +880 1234567890
3. Click "এগিয়ে যান"
4. Click "ভিডিও রেকর্ড করুন"
5. Allow camera access
6. Record video (or test with pre-recorded)
7. Click "শুরু করুন" → record 3-5 seconds → "থামুন"
8. Preview → "পাঠান"
9. Watch processing steps
10. View skills
11. View matched jobs

---

## 📋 Checklist Before Deployment

- [ ] All pages complete and tested
- [ ] Backend API returning correct responses
- [ ] Video recording works on mobile
- [ ] Bangla text renders correctly
- [ ] localStorage handling works
- [ ] No console errors
- [ ] Mobile responsive (test on 375px width)
- [ ] One-hand usability verified
- [ ] Error messages are user-friendly
- [ ] Camera/microphone permissions flow
- [ ] 30-second hard stop working
- [ ] Processing loop completes
- [ ] Skills and jobs display correctly

---

## 🎯 Production Deployment

See `IMPLEMENTATION_GUIDE.md` for full deployment steps.
