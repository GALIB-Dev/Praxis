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

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  skills: Array<{ name: string; confidence: number }>;
  matchScore?: number;
}

export default function CandidatesPage() {
  const router = useRouter();
  const { user, loading, setLoading, error, setError } = useApp();
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
    } else if (user.role !== "employer") {
      router.push("/dashboard");
    } else {
      fetchCandidates();
    }
  }, [user.id, user.role]);

  const fetchCandidates = async () => {
    if (!user.id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getCandidates(user.id);
      setCandidates(response.data.candidates || []);
    } catch (err) {
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Find Candidates</h1>
              <p className="text-gray-600">
                Browse and filter candidates by skills and expertise.
              </p>
            </div>
            <Button>
              <Link href="/employer/jobs">View My Jobs</Link>
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {loading && <LoadingSpinner />}

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Candidates List */}
              <div className="lg:col-span-2">
                {filteredCandidates.length === 0 ? (
                  <Card className="text-center py-12">
                    <p className="text-gray-600">
                      {candidates.length === 0 ? "No candidates available yet." : "No candidates match your search."}
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                      <Card
                        key={candidate.id}
                        className={`cursor-pointer hover:shadow-lg transition ${
                          selectedCandidate?.id === candidate.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{candidate.name}</h3>
                            <p className="text-gray-600 text-sm">{candidate.email}</p>

                            <div className="mt-4">
                              <h4 className="font-semibold text-sm mb-2">Top Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {candidate.skills.slice(0, 5).map((skill, index) => (
                                  <span
                                    key={index}
                                    className="bg-light px-2 py-1 rounded text-xs"
                                  >
                                    {skill.name}
                                  </span>
                                ))}
                                {candidate.skills.length > 5 && (
                                  <span className="text-gray-500 text-xs pt-1">
                                    +{candidate.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {candidate.matchScore && (
                            <div className="bg-secondary text-white px-4 py-2 rounded-lg font-bold h-fit">
                              {candidate.matchScore}% Match
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Candidate Details Panel */}
              <div className="lg:col-span-1">
                {selectedCandidate ? (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-1">{selectedCandidate.name}</h2>
                      <p className="text-gray-600 text-sm break-all">
                        {selectedCandidate.email}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold mb-3">Skills</h3>
                      <div className="space-y-3">
                        {selectedCandidate.skills.map((skill, index) => (
                          <div key={index}>
                            <p className="text-sm font-medium mb-1">{skill.name}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${skill.confidence * 100}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(skill.confidence * 100)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button className="w-full">Message Candidate</Button>
                      <Button variant="secondary" className="w-full">
                        View Full Profile
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="text-center py-12 text-gray-500">
                    <p>Select a candidate to view details</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
