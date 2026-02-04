import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  signup: (name: string, email: string, password: string, role: string) =>
    api.post("/auth/signup", { name, email, password, role }),

  // Upload endpoints
  uploadVideo: (file: File, userId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    return api.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadImage: (file: File, userId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Skill extraction endpoints
  extractSkills: (contentId: string) =>
    api.post("/skills/extract", { contentId }),

  getExtractedSkills: (userId: string) =>
    api.get(`/skills/${userId}`),

  // Job matching endpoints
  getJobMatches: (userId: string) =>
    api.get(`/jobs/matches/${userId}`),

  getJobDetails: (jobId: string) =>
    api.get(`/jobs/${jobId}`),

  // Employer endpoints
  getCandidates: (employerId: string) =>
    api.get(`/employer/candidates/${employerId}`),

  getCandidateProfile: (candidateId: string) =>
    api.get(`/employer/candidate/${candidateId}`),

  postJob: (employerId: string, jobData: any) =>
    api.post(`/employer/jobs/${employerId}`, jobData),

  getEmployerJobs: (employerId: string) =>
    api.get(`/employer/jobs/${employerId}`),

  // User endpoints
  getUserProfile: (userId: string) =>
    api.get(`/users/${userId}`),

  updateUserProfile: (userId: string, data: any) =>
    api.put(`/users/${userId}`, data),
};

export default api;
