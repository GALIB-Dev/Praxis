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

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useApp();

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    otp: "",
  });
  const [authMethod, setAuthMethod] = useState<"otp" | "password" | "email">("otp");
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

    if (authMethod !== "email") {
      if (!formData.phone.trim()) newErrors.phone = "ফোন নম্বর দিন";
    }

    if (authMethod === "otp") {
      if (!formData.otp.trim()) newErrors.otp = "ওটিপি দিন";
    }

    if (authMethod === "password") {
      if (!formData.password) newErrors.password = "পাসওয়ার্ড দিন";
    }

    if (authMethod === "email") {
      if (!formData.email.trim()) newErrors.email = "ইমেইল দিন";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "সঠিক ইমেইল দিন";
      if (!formData.password) newErrors.password = "পাসওয়ার্ড দিন";
    }

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
      let user = {
        id: `guest-${Date.now()}`,
        name: "Guest User",
        email: formData.email || undefined,
        role: "worker" as const,
      };

      if (authMethod === "email") {
        const response = await apiService.login(formData.email, formData.password);
        user = response.data.user;
        localStorage.setItem("authToken", response.data.token);
      }

      setUser(user);

      setTimeout(() => {
        router.push("/record");
      }, 300);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
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
          <h1 className="text-3xl font-bold text-center mb-2">লগইন করুন</h1>
          <p className="text-center text-gray-700 mb-8">শুরু করতে আপনার তথ্য দিন</p>

          {/* Error Message */}
          {errors.submit && (
            <Alert type="error" message={errors.submit} />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ফোন নম্বর"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="01XXXXXXXXX"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMethod("otp")}
                className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition ${
                  authMethod === "otp"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                ওটিপি
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("password")}
                className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition ${
                  authMethod === "password"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                পাসওয়ার্ড
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition ${
                  authMethod === "email"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                ইমেইল
              </button>
            </div>

            {authMethod === "otp" && (
              <Input
                label="ওটিপি"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                error={errors.otp}
                placeholder="******"
              />
            )}

            {authMethod === "password" && (
              <Input
                label="পাসওয়ার্ড"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
              />
            )}

            {authMethod === "email" && (
              <>
                <Input
                  label="ইমেইল"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                />
                <Input
                  label="পাসওয়ার্ড"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                />
              </>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              লগইন / চালিয়ে যান
            </Button>
          </form>

          {/* Links */}
          <p className="text-center text-gray-700 mt-6">
            নতুন অ্যাকাউন্ট?{" "}
            <Link href="/signup" className="text-primary font-semibold">
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
