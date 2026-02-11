// API Response Contracts - Strictly follow backend responses

export interface ProcessingResponse {
  processing_id: string;
  error?: string;
}

export interface ProcessingStatusResponse {
  status: "processing" | "done" | "failed";
  error?: string;
}

export interface Skill {
  name: string;
  level: 1 | 2 | 3;
  verified: boolean;
}

export interface SkillsResponse {
  user: string;
  skills: Skill[];
  error?: string;
}

export interface Job {
  title: string;
  match: number; // 0-100
  salary?: string;
  reason?: string;
}

export interface JobsResponse {
  jobs: Job[];
  error?: string;
}

export interface User {
  id: string;
  phone: string;
  processing_id?: string;
}
