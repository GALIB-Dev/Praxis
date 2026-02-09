"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

const MAX_DURATION_SECONDS = 30;

export default function RecordPage() {
  const router = useRouter();
  const { user } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<"idle" | "granted" | "denied">("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
      return;
    }

    requestCamera();
  }, [user.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [stream, recordedUrl]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const requestCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setPermissionState("granted");
    } catch (err) {
      setPermissionState("denied");
      setError("ক্যামেরা পারমিশন পাওয়া যায়নি। ব্রাউজারের পারমিশন অন করুন।");
    }
  };

  const startRecording = () => {
    if (!stream) return;

    setError(null);
    setElapsed(0);
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };

    recorder.start();
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= MAX_DURATION_SECONDS) {
          stopRecording();
          return MAX_DURATION_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);

    stopTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, MAX_DURATION_SECONDS * 1000);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  const handleRetake = () => {
    setRecordedBlob(null);
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setElapsed(0);
  };

  const handleUpload = async () => {
    if (!recordedBlob || !user.id) {
      setError("আগে ভিডিও রেকর্ড করুন।");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const file = new File([recordedBlob], "skill-video.webm", { type: "video/webm" });
      const response = await apiService.uploadVideo(file, user.id);

      const contentId =
        response?.data?.contentId ||
        response?.data?.id ||
        response?.data?.content?.id ||
        null;

      if (contentId) {
        localStorage.setItem("lastContentId", contentId);
      }
      localStorage.setItem("lastUploadResponse", JSON.stringify(response?.data || {}));

      router.push("/processing");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "ভিডিও আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user.id) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <LoadingSpinner fullScreen />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-light py-12 grid-lines-sm">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-300">
            <h1 className="text-3xl font-bold mb-2">ভিডিও রেকর্ড করুন</h1>
            <p className="text-gray-600 mb-6">
              ৩০ সেকেন্ডের মধ্যে আপনার দক্ষতার একটি ছোট ভিডিও রেকর্ড করুন।
            </p>

            {error && <Alert type="error" message={error} />}

            {permissionState === "denied" && (
              <div className="mb-6">
                <Button variant="secondary" onClick={requestCamera}>
                  আবার চেষ্টা করুন
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {recordedUrl ? (
                  <video src={recordedUrl} controls className="w-full h-72 object-cover" />
                ) : (
                  <p className="text-gray-700">রেকর্ড করা ভিডিও এখানে দেখা যাবে</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-gray-700">
                সময়: {elapsed}s / {MAX_DURATION_SECONDS}s
              </div>
              <div className="flex gap-3 flex-wrap">
                {!isRecording ? (
                  <Button onClick={startRecording} disabled={!stream || !!recordedBlob}>
                    রেকর্ড শুরু
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={stopRecording}>
                    রেকর্ড বন্ধ
                  </Button>
                )}
                <Button variant="outline" onClick={handleRetake} disabled={!recordedBlob || isRecording}>
                  রিটেক
                </Button>
                <Button onClick={handleUpload} isLoading={isUploading} disabled={!recordedBlob || isRecording}>
                  ভিডিও আপলোড
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
