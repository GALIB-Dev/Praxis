// API service layer
// Single source of truth for all backend communication

import {
  ProcessingResponse,
  ProcessingStatusResponse,
  SkillsResponse,
  JobsResponse,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiService {
  /**
   * Upload video to backend
   * POST /upload-video with multipart/form-data
   */
  async uploadVideo(videoBlob: Blob, userId: string): Promise<ProcessingResponse> {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "video.webm");
      formData.append("user_id", userId);

      const response = await fetch(`${API_BASE_URL}/upload-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  /**
   * Poll processing status
   * GET /processing-status?id=xxx
   */
  async getProcessingStatus(processingId: string): Promise<ProcessingStatusResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/processing-status?id=${processingId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Status check failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Status check error:", error);
      throw error;
    }
  }

  /**
   * Get verified skills
   * GET /skills?id=xxx
   */
  async getSkills(processingId: string): Promise<SkillsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/skills?id=${processingId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Skills fetch failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Skills fetch error:", error);
      throw error;
    }
  }

  /**
   * Get matched jobs
   * GET /jobs?id=xxx
   */
  async getJobs(processingId: string): Promise<JobsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs?id=${processingId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Jobs fetch failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Jobs fetch error:", error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}


export const apiService = new ApiService();
