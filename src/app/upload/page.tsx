"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { Alert } from "@/components/ui/Alert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

export default function UploadPage() {
  const router = useRouter();
  const { user, setLoading, loading, error, setError } = useApp();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [contentType, setContentType] = useState<"video" | "image">("video");

  // Redirect if not logged in as worker
  React.useEffect(() => {
    if (!user.id) {
      router.push("/login");
    } else if (user.role !== "worker") {
      router.push("/employer/candidates");
    }
  }, [user.id, user.role, router]);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!uploadedFile || !user.id) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await (contentType === "video"
        ? apiService.uploadVideo(uploadedFile, user.id)
        : apiService.uploadImage(uploadedFile, user.id));

      setSuccessMessage(
        `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} uploaded successfully! Processing skills...`
      );
      setUploadedFile(null);

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        `Failed to upload ${contentType}. Please try again.`;
      setError(errorMsg);
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
      <main className="flex-1 bg-light py-12 grid-lines-sm">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 relative z-10 border border-gray-300">
            <h1 className="text-3xl font-bold mb-2">Upload Your Content</h1>
            <p className="text-gray-600 mb-8">
              Upload a video or image showcasing your skills. Our AI will analyze
              and extract your professional capabilities.
            </p>

            {/* Content Type Selection */}
            <div className="mb-8 p-4 bg-light rounded-lg">
              <label className="block text-sm font-medium mb-3">
                What are you uploading?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={contentType === "video"}
                    onChange={(e) =>
                      setContentType(e.target.value as "video" | "image")
                    }
                    className="mr-2"
                  />
                  <span className="text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <rect x="2.5" y="6" width="15" height="12" rx="2" />
                      <path d="M19 8l3-2v12l-3-2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9.5" cy="12" r="3" />
                    </svg>
                    Video
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="image"
                    checked={contentType === "image"}
                    onChange={(e) =>
                      setContentType(e.target.value as "video" | "image")
                    }
                    className="mr-2"
                  />
                  <span className="text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <rect x="3" y="3" width="18" height="14" rx="2" />
                      <path d="M3 17l4-4 4 4 6-6 4 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Image
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert type="error" message={error} onClose={() => setError(null)} />
            )}

            {/* Success Message */}
            {successMessage && (
              <Alert type="success" message={successMessage} />
            )}

            {/* File Upload */}
            <FileUpload
              label={`Select ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`}
              accept={contentType === "video" ? "video/*" : "image/*"}
              onFileSelect={handleFileSelect}
              isLoading={loading}
              helpText={
                contentType === "video"
                  ? "MP4, WebM, or MOV (max 50MB)"
                  : "PNG, JPG, or GIF (max 50MB)"
              }
              maxSize={50}
            />

            {/* File Preview */}
            {uploadedFile && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✓ File selected: {uploadedFile.name}
                </p>
                <p className="text-sm text-green-600">
                  Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)}MB
                </p>
              </div>
            )}

            {/* Tips */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path d="M9 18a3 3 0 006 0c0-2-3-3-3-6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Tips for Better Results
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  {contentType === "video"
                    ? "Clearly demonstrate your skills in action"
                    : "Provide clear, well-lit images of your work"}
                </li>
                <li>
                  {contentType === "video"
                    ? "Include relevant context or explanations"
                    : "Include certifications, portfolios, or samples"}
                </li>
                <li>Ensure good quality and clear visibility</li>
              </ul>
            </div>

            {/* Upload Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                isLoading={loading}
                disabled={!uploadedFile}
                size="lg"
                className="flex-1"
              >
                Upload & Extract Skills
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                size="lg"
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
