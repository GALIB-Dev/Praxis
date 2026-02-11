"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BANGLA_TEXT } from "@/constants/bangla";

/**
 * /start page - Welcome and CTA to record video
 * Extremely simple, no scrolling required
 */
export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
    }
  }, [router]);

  const handleStartRecording = () => {
    router.push("/record");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            {BANGLA_TEXT.START_WELCOME}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {BANGLA_TEXT.START_SUBTITLE}
          </p>
        </div>

        {/* Illustration / Icon area */}
        <div className="mb-12 text-6xl animate-bounce">
          🎥
        </div>

        {/* Help text */}
        <p className="text-sm text-slate-500 mb-8">
          {BANGLA_TEXT.START_HELP}
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleStartRecording}
          className="w-full py-5 text-lg font-bold"
        >
          {BANGLA_TEXT.START_CTA}
        </Button>

        {/* Info */}
        <div className="mt-12 space-y-3 text-left bg-white/50 rounded-2xl p-6 border border-slate-200">
          <div className="flex gap-3">
            <span className="text-2xl">📱</span>
            <p className="text-sm text-slate-700">ভিডিওটি আপনার ফোনে রেকর্ড হবে</p>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">✓</span>
            <p className="text-sm text-slate-700">আপনার দক্ষতা যাচাই করা হবে</p>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">💼</span>
            <p className="text-sm text-slate-700">মিলানো চাকরি দেখাবো</p>
          </div>
        </div>
      </div>
    </div>
  );
}
