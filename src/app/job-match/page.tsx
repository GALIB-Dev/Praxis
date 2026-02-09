"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

export default function JobMatchPage() {
  const router = useRouter();
  const { user, jobMatches, setJobMatches, loading, setLoading, error, setError } = useApp();

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
      return;
    }

    if (jobMatches.length === 0) {
      fetchMatches();
    }
  }, [user.id]);

  const fetchMatches = async () => {
    if (!user.id) return;
    setLoading(true);
    setError(null);

    try {
      if (user.jobMatches) {
        setJobMatches(user.jobMatches);
      } else {
        const response = await apiService.getJobMatches(user.id);
        setJobMatches(response.data.matches || []);
      }
    } catch (err) {
      setError("চাকরির মিল লোড করা যায়নি।");
    } finally {
      setLoading(false);
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
      <main className="flex-1 bg-light py-12 grid-dots-sm">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">চাকরির মিল</h1>
            <p className="text-gray-700">আপনার স্কিল অনুযায়ী সাজানো চাকরির তালিকা</p>
          </div>

          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          {loading && <LoadingSpinner />}

          {!loading && jobMatches.length === 0 && (
            <Card className="text-center py-10">
              <p className="text-gray-700 mb-4">এই মুহূর্তে কোনো ম্যাচ পাওয়া যায়নি।</p>
              <Button onClick={() => router.push("/record")}>আরেকটি ভিডিও দিন</Button>
            </Card>
          )}

          {!loading && jobMatches.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {jobMatches.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{job.title}</h3>
                      <p className="text-gray-700">{job.company}</p>
                    </div>
                    <div className="bg-secondary text-white px-4 py-2 rounded-lg font-bold">
                      {job.matchPercentage}% Match
                    </div>
                  </div>

                  {job.salaryRange && (
                    <p className="text-sm text-gray-700 mb-2">বেতন: {job.salaryRange}</p>
                  )}

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">প্রয়োজনীয় স্কিল:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={`${job.id}-${index}`}
                          className="bg-light px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button>আবেদন করুন</Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
