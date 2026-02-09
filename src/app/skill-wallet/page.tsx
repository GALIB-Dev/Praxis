"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

export default function SkillWalletPage() {
  const router = useRouter();
  const { user, skills, setSkills, loading, setLoading, error, setError } = useApp();

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
      return;
    }

    if (skills.length === 0) {
      fetchSkills();
    }
  }, [user.id]);

  const fetchSkills = async () => {
    if (!user.id) return;
    setLoading(true);
    setError(null);

    try {
      if (user.skills) {
        setSkills(user.skills);
      } else {
        const response = await apiService.getExtractedSkills(user.id);
        setSkills(response.data.skills || []);
      }
    } catch (err) {
      setError("স্কিল লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const displayName = useMemo(() => user.name || "Guest User", [user.name]);

  const getLevel = (confidence: number) => {
    if (confidence >= 0.8) return "Level 3";
    if (confidence >= 0.5) return "Level 2";
    return "Level 1";
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">স্কিল ওয়ালেট</h1>
            <p className="text-gray-700">ব্যবহারকারী: {displayName}</p>
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <div className="mb-6">
            <h2 className="text-xl font-semibold">AI Verified Skills</h2>
          </div>

          {loading && <LoadingSpinner />}

          {!loading && skills.length === 0 && (
            <Card className="text-center py-10">
              <p className="text-gray-700 mb-4">এখনও কোনো স্কিল পাওয়া যায়নি।</p>
              <Button onClick={() => router.push("/record")}>নতুন ভিডিও রেকর্ড করুন</Button>
            </Card>
          )}

          {!loading && skills.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <Card key={`${skill.name}-${index}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{skill.name}</h3>
                      <p className="text-sm text-gray-700">{getLevel(skill.confidence)}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.round(skill.confidence * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      কনফিডেন্স: {Math.round(skill.confidence * 100)}%
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Button onClick={() => router.push("/job-match")}>
              চাকরির মিল দেখুন
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
