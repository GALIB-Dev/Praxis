"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { validateVideoBlob, compressVideoBlob } from "@/utils/video";
import { apiService } from "@/services/api";

export default function RecordPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "compressing" | "success">("idle");
  const [cameraActive, setCameraActive] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const MAX_DURATION = 30000; // 30 seconds in ms
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize camera access
   */
  const initCamera = async () => {
    try {
      setError(null);
      
      // Check if navigator.mediaDevices exists (client-side only)
      if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera API not available. Try a different browser.");
        setCameraActive(false);
        return;
      }
      
      // Try with minimal constraints first
      const constraints = {
        video: {
          facingMode: "user",
        },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera error:", err.name, err.message);
      
      let errorMsg = "Unable to access camera. Check permissions.";
      
      if (err.name === "NotAllowedError") {
        errorMsg = "Camera permission denied. Go to Settings > Permissions and allow camera access, then refresh.";
      } else if (err.name === "NotFoundError") {
        errorMsg = "No camera found on this device.";
      } else if (err.name === "NotReadableError") {
        errorMsg = "Camera is in use by another app. Close other apps and try again.";
      } else if (err.name === "OverconstrainedError") {
        errorMsg = "Camera constraints not supported on this device.";
      } else if (err.name === "TypeError") {
        errorMsg = "Camera API not available. Try Chrome or Firefox.";
      }
      
      setError(errorMsg);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    // Ensure this only runs on client
    if (typeof window === "undefined") {
      return;
    }

    const id = localStorage.getItem("userId");
    if (!id) {
      router.push("/login");
      return;
    }
    setUserId(id);

    // Auto-initialize camera on desktop only (larger screens)
    if (window.innerWidth >= 768) {
      initCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [router]);

  /**
   * Start recording
   */
  const startRecording = async () => {
    if (!videoRef.current?.srcObject) return;

    try {
      chunksRef.current = [];
      const stream = videoRef.current.srcObject as MediaStream;
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Timer
      durationInterval.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 100;
          if (newDuration >= MAX_DURATION) {
            if (mediaRecorderRef.current && isRecording) {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
            }
            if (durationInterval.current) {
              clearInterval(durationInterval.current);
            }
            return MAX_DURATION;
          }
          return newDuration;
        });
      }, 100);

      setError(null);
    } catch (err) {
      setError("রেকর্ডিং শুরু করতে সমস্যা হয়েছে");
    }
  };

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    }
  };

  /**
   * Retake video
   */
  const handleRetake = () => {
    setRecordedBlob(null);
    setRecordedUrl(null);
    setDuration(0);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
  };

  /**
   * Upload video
   */
  const handleUpload = async () => {
    if (!recordedBlob || !userId) {
      setError("ভিডিও পাওয়া যায়নি");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      setUploadStatus("compressing");

      // Validate
      const validation = validateVideoBlob(recordedBlob);
      if (!validation.valid) {
        setError(validation.error || "ভিডিও বৈধ নয়");
        setUploadStatus("idle");
        return;
      }

      // Compress (0-40% progress)
      setUploadProgress(10);
      const compressedBlob = await compressVideoBlob(recordedBlob);
      setUploadProgress(40);

      // Upload (40-90% progress)
      setUploadStatus("uploading");
      setUploadProgress(50);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 20;
          return next > 85 ? 85 : next;
        });
      }, 500);

      const response = await apiService.uploadVideo(compressedBlob, userId);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");

      if (response.processing_id) {
        localStorage.setItem("processingId", response.processing_id);
        
        // Show success for 1.5s then redirect
        setTimeout(() => {
          router.push("/processing");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "আপলোড ব্যর্থ হয়েছে");
      setUploadStatus("idle");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#F7F9F4] flex items-center justify-center px-4">
        <p className="text-[#344E41]/6000">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F4] overflow-hidden relative px-4 py-3">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-[#3A7D44]00 hover:text-[#3A7D44]00 font-semibold mb-3 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Record Video
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex gap-3 mb-2">
              <Icon name="warning-circle-svgrepo-com" size={20} color="#EF4444" className="flex-shrink-0" />
              <p className="text-red-300 text-sm font-semibold">{error}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => initCamera()}
                className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => setError(null)}
                className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded font-semibold border border-red-500/50"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Mobile Camera Button */}
        {!cameraActive && typeof window !== "undefined" && window.innerWidth < 768 && (
          <button
            onClick={() => {
              setError(null);
              initCamera();
            }}
            className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="earth-svgrepo-com" size={20} color="white" />
            Enable Camera
          </button>
        )}

        {/* Main Content */}
        <div className="bg-white/50 backdrop-blur-xl border border-[#A3B18A]00/50 space-y-4 rounded-xl p-4">
          {/* Video */}
          <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {!cameraActive && (
              <p className="text-white text-sm">Camera not active</p>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Timer */}
          <div className="text-center py-4 bg-[#A3B18A]/10 border border-[#A3B18A]00/50 rounded-lg">
            <p className="text-4xl font-bold text-[#3A7D44]00">
              {Math.floor(duration / 1000)}
            </p>
            <p className="text-xs text-[#344E41]/6000 mt-1">seconds / 30 max</p>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!cameraActive || !!recordedBlob || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] disabled:from-slate-500 disabled:to-slate-500 text-white font-bold rounded-xl transition-all"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopRecording}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all"
              >
                Stop
              </button>
            )}

            {recordedBlob && (
              <>
                {/* Upload Progress */}
                {uploadStatus !== "idle" && (
                  <div className="space-y-3 p-4 bg-white/50 border border-[#A3B18A]00/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      {uploadStatus === "success" ? (
                        <>
                          <Icon name="check-circle-svgrepo-com" size={24} color="#16A34A" />
                          <span className="font-semibold text-green-700">Upload Complete!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 animate-spin text-[#3A7D44]600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="font-semibold text-slate-700">
                            {uploadStatus === "compressing" ? "Compressing..." : "Uploading..."}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadStatus === "success" ? "bg-green-500" : "bg-[#3A7D44]500"
                        }`}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    
                    {/* Progress Text */}
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>{uploadStatus === "compressing" ? "Optimizing video..." : "Transferring..."}</span>
                      <span className="font-semibold">{Math.round(uploadProgress)}%</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleRetake}
                  disabled={isRecording || loading}
                  className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-900 font-semibold rounded-lg transition-colors"
                >
                  Retake
                </button>

                <button
                  onClick={handleUpload}
                  disabled={isRecording || loading}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading && uploadStatus === "idle" ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Icon name="upload-svgrepo-com" size={18} color="white" />
                      Upload
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Preview */}
          {recordedUrl && (
            <div className="bg-slate-100 rounded-lg overflow-hidden aspect-video">
              <video
                src={recordedUrl}
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
