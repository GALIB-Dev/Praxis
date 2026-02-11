"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export default function StartPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  const handleStartRecording = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    router.push("/record");
  };

  const handleAdminDashboard = () => {
    router.push("/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#A3B18A]/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 7s ease-in-out infinite 2s" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F7F9F4]/80 backdrop-blur-md border-b border-[#A3B18A]/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Icon name="business-svgrepo-com" size={32} color="#3A7D44" />
            <h2 className="text-2xl font-bold text-[#344E41]">Praxis</h2>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <button
                    onClick={handleAdminDashboard}
                    className="px-4 py-2 text-[#3A7D44] hover:text-[#2D5F34] font-semibold text-sm transition-colors"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-700 rounded-lg font-semibold text-sm transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-[#3A7D44] hover:text-[#2D5F34] font-semibold text-sm transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-4 py-2 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-[#F7F9F4] rounded-lg font-semibold text-sm transition-all"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-4 pt-16">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Text */}
            <div className="space-y-5 pt-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A3B18A]/20 border border-[#A3B18A]/50 rounded-full backdrop-blur-sm mb-1">
                <span className="w-2 h-2 bg-[#3A7D44] rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[#3A7D44]">AI-Powered Verification</span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-black text-[#344E41] leading-tight mb-2 tracking-tight">
                  Show Your
                  <br />
                  <span className="bg-gradient-to-r from-[#3A7D44] to-[#A3B18A] bg-clip-text text-transparent animate-pulse">
                    True Potential
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-[#344E41]/8000 leading-relaxed max-w-md">
                  Record a 30-second video, get AI-verified credentials, and land direct job opportunities from top employers.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleStartRecording}
                  className="group w-full bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-[#F7F9F4] font-bold py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden text-sm"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon name="earth-svgrepo-com" size={20} color="white" />
                  <span className="relative">Begin Recording</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={handleAdminDashboard}
                    className="group w-full border-2 border-[#A3B18A] hover:border-[#3A7D44] text-[#344E41] font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm hover:bg-[#3A7D44]/5"
                  >
                    <Icon name="business-svgrepo-com" size={20} color="white" />
                    Admin Dashboard
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#A3B18A]00/50">
                {[
                  { label: "Skills", value: "AI-Verified", icon: "check-circle-svgrepo-com", color: "#10B981" },
                  { label: "Time", value: "30 Seconds", icon: "7x24h-svgrepo-com", color: "#F59E0B" },
                  { label: "Jobs", value: "Instant Match", icon: "trending-up-svgrepo-com", color: "#8B5CF6" }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-md bg-white/30 border border-[#A3B18A]00/50 hover:border-slate-600/80 transition-all">
                    <Icon name={stat.icon} size={24} color={stat.color} className="mb-2 mx-auto" />
                    <p className="text-xl font-bold text-[#344E41]">{stat.value}</p>
                    <p className="text-xs text-[#344E41]/6000 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44] to-[#A3B18A]500/20 to-slate-600/20 rounded-3xl blur-3xl" />
              <div className="relative group">
                {/* Rotating border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3A7D44] to-[#A3B18A]600 to-slate-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                
                {/* Card */}
                <div className="relative bg-white/50 backdrop-blur-xl rounded-2xl p-12 border border-[#A3B18A]00/50">
                  <div className="relative w-48 h-48">
                    <Icon name="creativity-svgrepo-com" size={320} color="#EC4899" className="w-full h-full" />
                  </div>

                  {/* Animated accent elements */}
                  <div className="absolute top-6 right-6 w-3 h-3 bg-[#3A7D44]00 rounded-full animate-pulse" />
                  <div className="absolute bottom-6 left-6 w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-1/2 -right-6 w-2 h-2 bg-[#3A7D44]300 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Praxis */}
          <div className="grid md:grid-cols-3 gap-4 mt-14 pt-8 border-t border-[#A3B18A]00/50">
            {[
              { 
                icon: "check-circle-svgrepo-com",
                title: "Verified Skills",
                desc: "AI-powered analysis ensures authenticity",
                color: "#10B981",
                bgClass: "bg-emerald-500/20"
              },
              {
                icon: "accelerate-svgrepo-com",
                title: "Instant Results",
                desc: "Get credentials immediately",
                color: "#F59E0B",
                bgClass: "bg-amber-500/20"
              },
              {
                icon: "trophy-svgrepo-com",
                title: "Land Jobs",
                desc: "Direct opportunities from employers",
                color: "#8B5CF6",
                bgClass: "bg-violet-500/20"
              }
            ].map((item, i) => (
              <div key={i} className={`group relative p-4 rounded-lg ${item.bgClass} border border-[#A3B18A]00/50 hover:border-[#A3B18A]500/50 transition-all duration-300 hover:bg-slate-700/50`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44] to-[#A3B18A]500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative">
                  <Icon name={item.icon} size={32} color={item.color} className="mb-4" />
                  <p className="font-bold text-[#344E41] mb-2">{item.title}</p>
                  <p className="text-sm text-[#344E41]/6000">{item.desc}</p>
                </div>
              </div>
            ))}
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

