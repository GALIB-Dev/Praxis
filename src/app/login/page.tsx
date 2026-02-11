"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

const ADMIN_PHONE = "01785904899";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"phone" | "google">("phone");

  const isValidPhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    return (
      (cleanPhone.length === 11 && cleanPhone.startsWith("01")) ||
      (cleanPhone.length === 13 && cleanPhone.startsWith("880"))
    );
  };

  const isAdminPhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const cleanAdmin = ADMIN_PHONE.replace(/\D/g, "");
    
    let userPhone11 = cleanPhone;
    if (cleanPhone.length === 13 && cleanPhone.startsWith("880")) {
      userPhone11 = cleanPhone.substring(2);
    }
    
    let adminPhone11 = cleanAdmin;
    if (cleanAdmin.length === 13 && cleanAdmin.startsWith("880")) {
      adminPhone11 = cleanAdmin.substring(2);
    }
    
    return userPhone11 === adminPhone11;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError(null);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number (01XXXXXXXXX or +8801XXXXXXXXX)");
      return;
    }

    setLoading(true);

    try {
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userPhone", phone);
      
      if (isAdminPhone(phone)) {
        localStorage.setItem("isAdmin", "true");
      }

      setTimeout(() => {
        router.push("/start");
      }, 500);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userPhone", "google-user");
      
      setTimeout(() => {
        router.push("/start");
      }, 500);
    } catch (err) {
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-4">
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Icon name="business-svgrepo-com" size={40} color="#3A7D44" />
            </div>
            <h1 className="text-2xl font-bold text-green mb-1">Praxis</h1>
            <p className="text-sm text-[#344E41]/8000">Verify your skills, land your future</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <Icon name="warning-circle-svgrepo-com" size={20} color="#EF4444" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Auth Method Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-white/30 rounded-lg backdrop-blur-sm border border-[#A3B18A]00/50">
            <button
              onClick={() => setAuthMethod("phone")}
              className={`py-1 px-2 rounded-md font-semibold text-xs transition-all duration-200 ${
                authMethod === "phone"
                  ? "bg-[#A3B18A]/10 text-[#3A7D44]00 border border-[#A3B18A]00/50"
                  : "text-[#344E41]/6000 hover:text-[#344E41]/8000"
              }`}
            >
              Phone
            </button>
            <button
              onClick={() => setAuthMethod("google")}
              className={`py-2 px-3 rounded-md font-semibold text-sm transition-all duration-200 ${
                authMethod === "google"
                  ? "bg-[#A3B18A]/10 text-[#3A7D44]00 border border-[#A3B18A]00/50"
                  : "text-[#344E41]/6000 hover:text-[#344E41]/8000"
              }`}
            >
              Google
            </button>
          </div>

          {/* Phone Login */}
          {authMethod === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-green-500 mb-2 flex items-center gap-2">
                  <Icon name="user-svgrepo-com" size={18} color="#217d2f" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={loading}
                    autoFocus
                    className="w-full px-4 py-3 pl-10 bg-green-500/50 border border-[#A3B18A]00/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#A3B18A]00 focus:ring-1 focus:ring-blue-400/50 transition-all disabled:opacity-50"
                  />
                  <Icon name="mail-svgrepo-com" size={18} color="#94A3B8" className="absolute left-3 top-3.5" />
                </div>
                <p className="text-xs text-[#344E41]/6000 mt-2">
                  ✓ Enter your 11-digit phone number (01XXXXXXXXX)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] disabled:from-slate-500 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Icon name="arrow-right-svgrepo-com" size={20} color="white" />
                    Continue with Phone
                  </>
                )}
              </button>
            </form>
          )}

          {/* Google Login */}
          {authMethod === "google" && (
            <div className="space-y-6">
              <p className="text-sm text-[#344E41]/8000 text-center">
                Sign in with your Google account to get started
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white/50 hover:bg-slate-700/50 disabled:bg-slate-700/30 border-2 border-[#A3B18A]00/50 hover:border-[#A3B18A]00 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#A3B18A]00/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#F7F9F4] text-[#344E41]/6000">or</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#A3B18A]/10 border border-[#A3B18A]00/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex gap-3 items-start">
              <Icon name="notify-svgrepo-com" size={20} color="#3a7d44" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#3A7D44]200">
                <span className="font-semibold">Demo:</span> Use <code className="bg-[#3A7D44]500/30 px-2 py-1 rounded text-[#3A7D44]100 font-mono text-xs border border-[#A3B18A]00/50">01785904899</code> for admin access
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-[#344E41]/6000 text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Right Section - Visual */}
        <div className="hidden lg:flex flex-col items-center justify-center relative gap-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44] to-[#A3B18A]500/20 to-slate-600/20 rounded-3xl blur-3xl" />
          <div className="relative group w-80 h-80">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3A7D44] to-[#A3B18A]600 to-slate-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            <div className="relative bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-[#A3B18A]00/50 flex items-center justify-center w-full h-full">
              <Icon name="earth-svgrepo-com" size={160} color="#3A7D44" />
            </div>
          </div>

          {/* Feature badges */}
          <div className="grid gap-4 w-full max-w-sm relative z-10">
            {[
              { icon: "check-circle-svgrepo-com", text: "Secure Login", color: "#10B981" },
              { icon: "shield-empty-svgrepo-com", text: "Data Protected", color: "#8B5CF6" },
              { icon: "accelerate-svgrepo-com", text: "Fast Access", color: "#F59E0B" }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/30 p-4 rounded-lg border border-[#A3B18A]00/50 hover:border-slate-600/80 transition-all">
                <Icon name={badge.icon} size={24} color={badge.color} />
                <span className="text-white font-semibold text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
}
