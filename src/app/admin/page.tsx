"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserAdmin, getAdminStatus } from "@/utils/admin";
import { Icon } from "@/components/Icon";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "processing" | "settings">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [stats] = useState({
    totalUsers: 1250,
    activeToday: 342,
    videoProcessed: 4567,
    skillsVerified: 8945,
    jobsMatched: 2134,
    avgProcessingTime: "2.3s",
    successRate: "98.5%",
    usersThisWeek: 156,
  });

  useEffect(() => {
    const admin = isUserAdmin();
    setIsAdmin(admin);

    if (!admin) {
      router.push("/start");
      return;
    }

    const phone = localStorage.getItem("userPhone") || "";
    setUserPhone(phone);
  }, [router]);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  if (!isAdmin) {
    return null;
  }

  const tabs = ["overview", "users", "processing", "settings"];

  return (
    <div className="min-h-screen bg-white">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-slate-50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-slate-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className={`border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Top row - Logo & Menu */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon name="business-svgrepo-com" size={32} color="#2563EB" className="flex-shrink-0" />
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900">Admin</h1>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop buttons */}
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => router.push("/start")}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Subtitle and status - Stack on mobile */}
            <div className="mb-4 block md:hidden text-xs">
              <p className="font-semibold text-slate-900 truncate">{userPhone}</p>
              <p className="text-blue-600 font-medium">{getAdminStatus()}</p>
            </div>

            {/* Desktop subtitle */}
            <div className="hidden md:flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-sm text-slate-600">System administration & monitoring</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-semibold text-slate-900">{userPhone}</p>
                <p className="text-xs text-blue-600 font-medium">{getAdminStatus()}</p>
              </div>
            </div>

            {/* Tabs - Scrollable on mobile */}
            <div className="flex gap-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-600 border-transparent hover:text-slate-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile action buttons */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 flex gap-2 pb-4">
                <button
                  onClick={() => {
                    router.push("/start");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Icon name="notify-svgrepo-com" size={20} color="#2563EB" className="flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold text-blue-900 text-sm sm:text-base">Full system access enabled</p>
                  <p className="text-xs sm:text-sm text-blue-800 mt-1">You have complete administrative privileges. All actions are monitored and logged.</p>
                </div>
              </div>

              {/* Quick Stats - Responsive grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { 
                    label: "Total Users", 
                    value: stats.totalUsers, 
                    icon: "user-svgrepo-com",
                    color: "text-blue-600" 
                  },
                  { 
                    label: "Active Today", 
                    value: stats.activeToday, 
                    icon: "trending-up-svgrepo-com",
                    color: "text-green-600" 
                  },
                  { 
                    label: "Videos", 
                    value: stats.videoProcessed, 
                    icon: "screen-share-svgrepo-com",
                    color: "text-purple-600" 
                  },
                  { 
                    label: "Skills", 
                    value: stats.skillsVerified, 
                    icon: "check-circle-svgrepo-com",
                    color: "text-amber-600" 
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name={stat.icon} size={32} className={stat.color} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Extended Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Avg Processing Time</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.avgProcessingTime}</p>
                  <p className="text-xs text-green-600 font-semibold mt-2">↓ 12%</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Success Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.successRate}</p>
                  <p className="text-xs text-green-600 font-semibold mt-2">↑ 0.3%</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">New (7d)</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.usersThisWeek}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-2">↑ 23%</p>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">System Status</h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    "Video Processing Engine",
                    "Skill Verification AI",
                    "Job Matching Algorithm",
                    "Database Server",
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded text-sm sm:text-base">
                      <span className="font-medium text-slate-900 truncate">{service}</span>
                      <span className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs sm:text-sm font-semibold text-green-600">OK</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">User Management</h3>
                <div className="space-y-3">
                  {[
                    { title: "View All Users", desc: "Browse and manage registered users", btn: "Open" },
                    { title: "Block/Unblock Users", desc: "Manage user access permissions", btn: "Manage" },
                    { title: "Export User Data", desc: "Download user statistics and reports", btn: "Export" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "processing" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Processing Queue</h3>
                <div className="space-y-3">
                  {[
                    { title: "Processing Status", desc: "View real-time video processing", btn: "Monitor" },
                    { title: "Failed Videos", desc: "Review and reprocess failed items", btn: "Review" },
                    { title: "Processing Settings", desc: "Configure video quality and output", btn: "Configure" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">System Settings</h3>
                <div className="space-y-3">
                  {[
                    { title: "Global Configuration", desc: "Manage system-wide settings", btn: "Edit" },
                    { title: "API Keys & Webhooks", desc: "Manage integrations and services", btn: "Manage" },
                    { title: "Admin Logs", desc: "View audit trail of all admin actions", btn: "View" },
                    { title: "Backup & Restore", desc: "Manage system backups and recovery", btn: "Configure" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
