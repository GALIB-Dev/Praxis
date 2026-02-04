"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useApp } from "@/context/AppContext";
import { apiService } from "@/services/api";

// Demo users for testing
const DEMO_USERS = {
  worker: {
    email: "worker@demo.com",
    password: "demo123",
    user: {
      id: "worker-001",
      name: "Ravi Kumar",
      email: "worker@demo.com",
      role: "worker" as const,
      skills: [
        { name: "JavaScript", confidence: 0.95 },
        { name: "React", confidence: 0.92 },
        { name: "UI/UX Design", confidence: 0.88 },
      ],
      jobMatches: [
        {
          id: "job-001",
          title: "Frontend Developer",
          company: "TechCorp India",
          description: "Build responsive web applications using React and modern JavaScript.",
          requiredSkills: ["JavaScript", "React"],
          matchPercentage: 96,
        },
        {
          id: "job-002",
          title: "UI/UX Developer",
          company: "Creative Studios",
          description: "Design and develop beautiful user interfaces.",
          requiredSkills: ["UI/UX Design", "React"],
          matchPercentage: 88,
        },
      ],
    },
  },
  employer: {
    email: "employer@demo.com",
    password: "demo123",
    user: {
      id: "employer-001",
      name: "Priya Sharma",
      email: "employer@demo.com",
      role: "employer" as const,
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useApp();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Check for demo credentials
      let user = null;
      if (formData.email === DEMO_USERS.worker.email && formData.password === DEMO_USERS.worker.password) {
        user = DEMO_USERS.worker.user;
        localStorage.setItem("authToken", "demo-token-worker");
      } else if (formData.email === DEMO_USERS.employer.email && formData.password === DEMO_USERS.employer.password) {
        user = DEMO_USERS.employer.user;
        localStorage.setItem("authToken", "demo-token-employer");
      } else {
        // Try API login
        const response = await apiService.login(formData.email, formData.password);
        user = response.data.user;
        localStorage.setItem("authToken", response.data.token);
      }

      setUser(user);
      
      // Small delay to ensure context updates before redirect
      setTimeout(() => {
        router.push(user.role === "worker" ? "/dashboard" : "/employer/candidates");
      }, 300);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-light py-12 grid-dots-sm">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 relative z-10 border border-gray-300">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-8">Login to your account</p>

          {/* Error Message */}
          {errors.submit && (
            <Alert type="error" message={errors.submit} />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Login
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs font-semibold text-gray-700 mb-4">DEMO ACCOUNTS</p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: DEMO_USERS.worker.email, password: DEMO_USERS.worker.password });
                }}
                className="w-full text-left p-3 bg-bengalRed/10 border border-bengalRed rounded-md text-sm hover:bg-bengalRed/20 transition"
              >
                <span className="font-semibold text-bengalRed">Worker</span>
                <div className="text-xs text-gray-600 mt-1">{DEMO_USERS.worker.email}</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: DEMO_USERS.employer.email, password: DEMO_USERS.employer.password });
                }}
                className="w-full text-left p-3 bg-mustard/20 border border-mustard rounded-md text-sm hover:bg-mustard/30 transition"
              >
                <span className="font-semibold text-mustard">Employer</span>
                <div className="text-xs text-gray-600 mt-1">{DEMO_USERS.employer.email}</div>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Password: <span className="font-mono font-semibold">demo123</span></p>
            </div>
          </div>

          {/* Links */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold">
              Sign up here
            </Link>
          </p>
          <p className="text-center text-gray-600 mt-2">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
