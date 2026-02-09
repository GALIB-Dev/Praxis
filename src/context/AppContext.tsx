"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface Skill {
  name: string;
  confidence: number;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  matchPercentage: number;
  salaryRange?: string;
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: "worker" | "employer";
  skills?: Skill[];
  jobMatches?: JobMatch[];
  uploadedContent?: string[];
}

interface AppContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  jobMatches: JobMatch[];
  setJobMatches: (matches: JobMatch[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user.id) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    setUser({});
    setSkills([]);
    setJobMatches([]);
    localStorage.removeItem("user");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        skills,
        setSkills,
        jobMatches,
        setJobMatches,
        loading,
        setLoading,
        error,
        setError,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
