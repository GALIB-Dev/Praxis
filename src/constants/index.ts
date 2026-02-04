// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/quicktime"],
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
  VIDEO_EXTENSIONS: [".mp4", ".webm", ".mov"],
  IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
};

// Skill Extraction
export const SKILL_CONFIG = {
  MIN_CONFIDENCE: 0.5,
  CONFIDENCE_THRESHOLD: 0.6,
  MAX_SKILLS_DISPLAY: 10,
};

// Job Matching
export const JOB_MATCHING_CONFIG = {
  MIN_MATCH_PERCENTAGE: 50,
  MATCH_CALCULATION_METHOD: "cosine_similarity",
};

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// User Roles
export const USER_ROLES = {
  WORKER: "worker",
  EMPLOYER: "employer",
} as const;

// Job Status
export const JOB_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
  DRAFT: "draft",
} as const;

// Application Status
export const APPLICATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: "Authentication failed. Please try again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_ALREADY_EXISTS: "Email already registered.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  FILE_TOO_LARGE: "File is too large. Maximum size is 50MB.",
  INVALID_FILE_TYPE: "Invalid file type. Please upload a supported format.",
  SKILL_EXTRACTION_FAILED: "Failed to extract skills. Please try again.",
  NO_DATA: "No data available.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: "Account created successfully!",
  LOGIN_SUCCESS: "Logged in successfully!",
  UPLOAD_SUCCESS: "File uploaded successfully!",
  SKILL_EXTRACTION_SUCCESS: "Skills extracted successfully!",
  JOB_POST_SUCCESS: "Job posted successfully!",
  APPLICATION_SUBMITTED: "Application submitted successfully!",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  UPLOAD: "/upload",
  EMPLOYER_CANDIDATES: "/employer/candidates",
  EMPLOYER_JOBS: "/employer/jobs",
  PROFILE: "/profile",
  FORGOT_PASSWORD: "/forgot-password",
};

// Colors
export const COLORS = {
  PRIMARY: "#3B82F6",
  SECONDARY: "#10B981",
  ACCENT: "#F59E0B",
  DARK: "#1F2937",
  LIGHT: "#F3F4F6",
  SUCCESS: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",
};

// Skill Confidence Ranges
export const CONFIDENCE_RANGES = {
  VERY_HIGH: { min: 0.8, max: 1.0, label: "Very High", color: "bg-green-500" },
  HIGH: { min: 0.6, max: 0.8, label: "High", color: "bg-blue-500" },
  MEDIUM: { min: 0.4, max: 0.6, label: "Medium", color: "bg-yellow-500" },
  LOW: { min: 0.0, max: 0.4, label: "Low", color: "bg-red-500" },
};

// Common Skills for Quick Reference
export const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "REST API",
  "GraphQL",
  "CSS",
  "HTML",
  "Tailwind CSS",
  "Next.js",
  "Express.js",
  "Communication",
  "Leadership",
  "Project Management",
  "Problem Solving",
  "Teamwork",
  "Time Management",
];
