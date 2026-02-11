"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export default function ProcessingPage() {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("preparing");
  const [estimatedTime, setEstimatedTime] = useState(45);

  useEffect(() => {
    const id = localStorage.getItem("processingId");
    if (!id) {
      router.push("/record");
      return;
    }
    setProcessingId(id);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 800);

    // Update status based on progress
    const statusInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 25) {
          setStatus("analyzing");
          setEstimatedTime(40);
        } else if (prev < 50) {
          setStatus("extracting");
          setEstimatedTime(30);
        } else if (prev < 75) {
          setStatus("verifying");
          setEstimatedTime(15);
        } else {
          setStatus("finalizing");
          setEstimatedTime(5);
        }
        return prev;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [router]);

  const getStatusMessage = () => {
    switch (status) {
      case "analyzing":
        return "Analyzing video content and speech patterns";
      case "extracting":
        return "Extracting skills and competencies";
      case "verifying":
        return "Verifying credentials and authenticity";
      case "finalizing":
        return "Finalizing results and generating report";
      default:
        return "Preparing video for processing";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] overflow-hidden relative">
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

      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Icon name="business-svgrepo-com" size={40} color="#3A7D44" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Processing Your Video</h1>
          <p className="text-sm text-[#344E41]/8000">We're analyzing your skills and preparing your profile</p>
        </div>

        {/* Processing Card */}
        <div className="bg-white/50 backdrop-blur-xl border border-[#A3B18A]00/50 rounded-xl p-6 space-y-6">
          {/* Progress Visual */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#475569" strokeWidth="8" />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  strokeDasharray={`${(progress / 100) * 565.48} 565.48`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: "stroke-dasharray 0.3s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#3A7D44]00">{Math.round(progress)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-[#3A7D44]00 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-lg font-semibold text-white capitalize">{status === "preparing" ? "Preparing" : status}</p>
            </div>
            <p className="text-[#344E41]/6000">{getStatusMessage()}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#344E41]/6000">
              <span>Processing time remaining</span>
              <span className="font-semibold">~{Math.max(0, Math.round(estimatedTime))}s</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {[
              { label: "Video Analysis", icon: "earth-svgrepo-com" },
              { label: "Skill Extraction", icon: "trending-up-svgrepo-com" },
              { label: "Verification", icon: "check-circle-svgrepo-com" },
              { label: "Final Report", icon: "document-svgrepo-com" },
            ].map((step, idx) => {
              const stepProgress = ((idx + 1) / 4) * 100;
              const isComplete = progress >= stepProgress;
              const isActive = progress >= stepProgress - 25 && progress < stepProgress;

              return (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isComplete
                        ? "bg-green-100 text-green-600"
                        : isActive
                          ? "bg-[#3A7D44]100 text-[#3A7D44]600 scale-110"
                          : "bg-slate-200 text-[#344E41]/6000"
                    }`}
                  >
                    {isComplete ? (
                      <Icon name="check-circle-svgrepo-com" size={20} />
                    ) : (
                      <Icon name={step.icon} size={20} />
                    )}
                  </div>
                  <span
                    className={`font-medium transition-colors ${
                      isComplete || isActive ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="bg-[#3A7D44]50 border border-[#A3B18A]200 rounded-lg p-4">
            <div className="flex gap-3 items-start">
              <Icon name="notify-svgrepo-com" size={20} color="#2563EB" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#3A7D44]900">
                <p className="font-semibold mb-1">Processing Details:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Typically takes 30-60 seconds</li>
                  <li>• ID: <code className="bg-[#3A7D44]100 px-2 py-0.5 rounded font-mono text-xs">{processingId}</code></li>
                  <li>• You can safely close this page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-redirect message */}
        {progress >= 100 && (
          <div className="mt-8 text-center">
            <p className="text-green-600 font-semibold mb-4">✓ Processing complete! Redirecting...</p>
            <button
              onClick={() => router.push("/skills")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              View Skills →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
      clearTimeout(completeTimer);
    };
  }, [user.id]);

  const fetchResults = async () => {
    if (!user.id) return;
    setError(null);

    try {
      if (user.id === "worker-001" && user.skills) {
        setSkills(user.skills);
        setJobMatches(user.jobMatches || []);
        return;
      }

      const [skillsRes, matchesRes] = await Promise.all([
        apiService.getExtractedSkills(user.id).catch(() => null),
        apiService.getJobMatches(user.id).catch(() => null),
      ]);

      if (skillsRes?.data?.skills) {
        setSkills(skillsRes.data.skills || []);
      }

      if (matchesRes?.data?.matches) {
        setJobMatches(matchesRes.data.matches || []);
      }
    } catch (err: any) {
      setError("ডেটা আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-light py-12 grid-dots-sm">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-300 text-center">
            <h1 className="text-3xl font-bold mb-2">এআই প্রসেসিং</h1>
            <p className="text-gray-700 mb-6">
              আপনার ভিডিও বিশ্লেষণ করা হচ্ছে। কিছুক্ষণ অপেক্ষা করুন।
            </p>

            {error && <Alert type="error" message={error} />}

            <div className="flex justify-center mb-6">
              <LoadingSpinner />
            </div>

            <ul className="text-left space-y-3 mb-6">
              {STATUS_MESSAGES.map((message, index) => (
                <li key={message} className="flex items-center gap-3 text-sm">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      index <= statusIndex ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className={index <= statusIndex ? "text-gray-900" : "text-gray-700"}>
                    {message}
                  </span>
                </li>
              ))}
            </ul>

            <Button onClick={() => router.push("/skill-wallet")} disabled={!isComplete}>
              স্কিল ওয়ালেট দেখুন
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
