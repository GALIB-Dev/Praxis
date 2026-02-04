"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  salaryRange?: string;
  location?: string;
  postedDate: string;
  applications?: number;
}

export default function JobsPage() {
  const router = useRouter();
  const { user, loading, setLoading, error, setError } = useApp();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    salaryRange: "",
    location: "",
  });

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
    } else if (user.role !== "employer") {
      router.push("/dashboard");
    } else {
      fetchJobs();
    }
  }, [user.id, user.role]);

  const fetchJobs = async () => {
    if (!user.id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getEmployerJobs(user.id);
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) return;

    setLoading(true);
    setError(null);

    try {
      await apiService.postJob(user.id, {
        ...formData,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      setShowPostForm(false);
      setFormData({
        title: "",
        description: "",
        requiredSkills: "",
        salaryRange: "",
        location: "",
      });

      await fetchJobs();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to post job. Please try again."
      );
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
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
              <p className="text-gray-600">
                Manage and track your open positions.
              </p>
            </div>
            <Button onClick={() => setShowPostForm(!showPostForm)}>
              {showPostForm ? "Cancel" : "Post New Job"}
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          {/* Post Job Form */}
          {showPostForm && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
              <form onSubmit={handlePostJob} className="space-y-4">
                <Input
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior React Developer"
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the job responsibilities and requirements..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    rows={5}
                    required
                  />
                </div>

                <Input
                  label="Required Skills (comma-separated)"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, TypeScript, Node.js"
                  required
                />

                <Input
                  label="Salary Range (optional)"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  placeholder="e.g., $100,000 - $150,000"
                />

                <Input
                  label="Location (optional)"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY / Remote"
                />

                <Button type="submit" isLoading={loading} className="w-full">
                  Post Job
                </Button>
              </form>
            </Card>
          )}

          {/* Jobs List */}
          {loading && !showPostForm && <LoadingSpinner />}

          {!loading && (
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-gray-600 mb-6">
                    You haven't posted any jobs yet.
                  </p>
                  <Button onClick={() => setShowPostForm(true)}>
                    Post Your First Job
                  </Button>
                </Card>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">{job.title}</h3>
                        {job.location && (
                          <p className="text-gray-600">{job.location}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {job.applications && (
                          <p className="text-sm text-gray-600">
                            {job.applications} Applications
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Posted: {new Date(job.postedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {job.salaryRange && (
                      <p className="text-primary font-semibold mb-4">
                        {job.salaryRange}
                      </p>
                    )}

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-light px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary">View Applicants</Button>
                      <Button variant="outline">Edit</Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
