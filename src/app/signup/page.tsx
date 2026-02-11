"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/Icon";

export default function SignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidPhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    return (
      (cleanPhone.length === 11 && cleanPhone.startsWith("01")) ||
      (cleanPhone.length === 13 && cleanPhone.startsWith("880"))
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phone)) {
      setError("Please enter a valid 11-digit phone number (01XXXXXXXXX)");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create user ID and store info
      const userId = `user_${Date.now()}`;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userPhone", phone);

      setTimeout(() => {
        router.push("/start");
      }, 500);
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
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
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="business-svgrepo-com" size={36} color="#3A7D44" />
                  <h1 className="text-2xl font-bold text-green-500">Praxis</h1>
                </div>
                <h2 className="text-3xl font-bold text-green mb-2">Create Account</h2>
                <p className="text-base text-[#344E41]/8000">
                  Start your journey to verified expertise and career opportunities.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                  <Icon name="warning-circle-svgrepo-com" size={18} color="#EF4444" />
                  <p className="text-red-300 text-xs font-semibold">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-green-500 mb-2 flex items-center gap-2">
                    <Icon name="user-1-svgrepo-com" size={18} color="#3A7D44" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError(null);
                      }}
                      disabled={loading}
                      autoFocus
                      className="w-full px-4 py-3 pl-10 bg-white/50 border border-[#A3B18A]00/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#A3B18A]00 focus:ring-1 focus:ring-blue-400/50 transition-all disabled:opacity-50"
                    />
                    <Icon name="conversation-svgrepo-com" size={18} color="#94A3B8" className="absolute left-3 top-3.5" />
                  </div>
                  <p className="text-xs text-[#344E41]/6000 mt-2">
                    ✓ Valid 11-digit number (01XXXXXXXXX)
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Icon name="arrow-right-svgrepo-com" size={20} color="white" />
                      Get Started
                    </>
                  )}
                </button>
              </form>

              {/* Link to Login */}
              <p className="text-center text-[#344E41]/8000 text-sm mt-6">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-[#3A7D44]00 hover:text-[#3A7D44]00 font-semibold"
                >
                  Sign In
                </button>
              </p>

              {/* Footer */}
              <p className="text-xs text-[#344E41]/6000 text-center mt-8">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {/* Right Section - Visual */}
            <div className="hidden lg:flex flex-col items-center justify-center relative gap-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44] to-[#A3B18A]500/20 to-slate-600/20 rounded-3xl blur-3xl" />
              <div className="relative group w-80 h-80">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3A7D44] to-[#A3B18A]600 to-slate-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                <div className="relative bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-[#A3B18A]00/50 flex items-center justify-center w-full h-full">
                  <Icon name="tree-svgrepo-com(4)" size={160} color="#3A7D44" />
                </div>
              </div>

              {/* Step indicators */}
              <div className="grid gap-3 w-full max-w-sm relative z-10">
                {[
                  { num: "1", text: "Enter Phone", icon: "conversation-svgrepo-com", color: "#3A7D44" },
                  { num: "2", text: "Create Account", icon: "check-circle-svgrepo-com", color: "#10B981" },
                  { num: "3", text: "Record Video", icon: "tree-svgrepo-com(4)", color: "#F59E0B" }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/30 border border-[#A3B18A]00/50 hover:border-slate-600/80 transition-all group/step">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#3A7D44]500/30 flex items-center justify-center font-bold text-[#3A7D44]00 group-hover/step:bg-[#3A7D44]500/50 transition-all">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{step.text}</p>
                    </div>
                    <Icon name={step.icon} size={20} color={step.color} />
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
