// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "worker" | "employer";
  };
  token: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "worker" | "employer";
  createdAt: string;
  updatedAt: string;
}

// Skill Types
export interface Skill {
  name: string;
  confidence: number;
}

export interface ExtractedSkillsResponse {
  userId: string;
  skills: Skill[];
  contentId: string;
  extractedAt: string;
}

// Job Types
export interface JobMatch {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  matchPercentage: number;
  location?: string;
  salaryRange?: string;
}

export interface JobPosting {
  id: string;
  employerId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location?: string;
  salaryRange?: string;
  postedDate: string;
  status: "open" | "closed";
  applications?: number;
}

// Candidate Types
export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  uploadedContent: string[];
  matchScore?: number;
  createdAt: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "worker" | "employer";
}

export interface PostJobFormData {
  title: string;
  description: string;
  requiredSkills: string[];
  location?: string;
  salaryRange?: string;
}

// Upload Types
export interface UploadResponse {
  id: string;
  userId: string;
  filename: string;
  type: "video" | "image";
  url: string;
  uploadedAt: string;
}

export interface SkillExtractionResponse {
  id: string;
  contentId: string;
  skills: Skill[];
  confidence: number;
  extractedAt: string;
}
