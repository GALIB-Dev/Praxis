"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

const STATUS_MESSAGES = [
  "ভিডিও গ্রহণ করা হয়েছে",
  "এআই মডেল ভিডিও বিশ্লেষণ করছে",
  "দক্ষতা যাচাই করা হচ্ছে",
  "চাকরির মিল খোঁজা হচ্ছে",
];

export default function ProcessingPage() {
  const router = useRouter();
  const { user, setSkills, setJobMatches } = useApp();
  const [statusIndex, setStatusIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
      return;
    }

    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev >= STATUS_MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    fetchResults();

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, 6500);

    return () => {
      clearInterval(interval);
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
