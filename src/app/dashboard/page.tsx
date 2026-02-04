"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";
import type { Skill, JobMatch } from "@/context/AppContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, skills, setSkills, jobMatches, setJobMatches, loading, setLoading, error, setError } = useApp();
  const [activeTab, setActiveTab] = useState<"skills" | "matches">("skills");

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
    } else if (user.role !== "worker") {
      router.push("/employer/candidates");
    } else {
      // Load demo data if user is demo user
      if (user.id === "worker-001" && user.skills) {
        setSkills(user.skills);
        setJobMatches(user.jobMatches || []);
      } else {
        fetchData();
      }
    }
  }, [user.id, user.role]);

  const fetchData = async () => {
    if (!user.id) return;
    setLoading(true);
    setError(null);

    try {
      const [skillsRes, matchesRes] = await Promise.all([
        apiService.getExtractedSkills(user.id).catch(() => null),
        apiService.getJobMatches(user.id).catch(() => null),
      ]);

      if (skillsRes?.data) {
        setSkills(skillsRes.data.skills || []);
      }
      if (matchesRes?.data) {
        setJobMatches(matchesRes.data.matches || []);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
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
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-600">
              Manage your skills and explore job opportunities that match your expertise.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab("skills")}
              className={`py-2 px-4 font-medium border-b-2 transition ${
                activeTab === "skills"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-primary"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Your Skills ({skills.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`py-2 px-4 font-medium border-b-2 transition ${
                activeTab === "matches"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-primary"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V6a4 4 0 018 0v1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Job Matches ({jobMatches.length})
              </span>
            </button>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Skills Tab */}
          {activeTab === "skills" && !loading && (
            <div>
              {skills.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-gray-600 mb-6">
                    No skills extracted yet. Upload a video or image to get started!
                  </p>
                  <Button>
                    <Link href="/upload">Upload Content</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill: Skill, index: number) => (
                    <Card key={index}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{skill.name}</h3>
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {Math.round(skill.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full"
                          style={{ width: `${skill.confidence * 100}%` }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {skills.length > 0 && (
                <div className="mt-8">
                  <Button variant="secondary">
                    <Link href="/upload">Add More Skills</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Job Matches Tab */}
          {activeTab === "matches" && !loading && (
            <div>
              {jobMatches.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-gray-600 mb-6">
                    {skills.length === 0
                      ? "Upload content to see job matches"
                      : "No matching jobs found yet. Check back soon!"}
                  </p>
                  {skills.length === 0 && (
                    <Button>
                      <Link href="/upload">Upload Content</Link>
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {jobMatches.map((job: JobMatch) => (
                    <Card key={job.id} className="hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <div className="bg-secondary text-white px-4 py-2 rounded-lg font-bold">
                          {job.matchPercentage}% Match
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="bg-light px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button>Apply Now</Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
