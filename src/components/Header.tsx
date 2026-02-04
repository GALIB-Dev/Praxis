"use client";

import React, { useState } from "react";
import logoImg from "@/Images/Gemini_Generated_Image_qv7n1tqv7n1tqv7n.png";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Button } from "./ui/Button";

export function Header() {
  const { user, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-50 transition-all duration-300 ease-smooth">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logoImg} alt="SkillsMatcher logo" width={64} height={64} className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-black">SkillsMatcher</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Home
            </Link>
            <a href="#how" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              How It Works
            </a>
            {user.id && user.role === "worker" && (
              <Link href="/upload" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
                Upload
              </Link>
            )}
            {user.id && user.role === "employer" && (
              <Link href="/employer/candidates" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
                Candidates
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <input
                aria-label="Search"
                placeholder="Search jobs or skills"
                className="hidden md:block w-56 bg-light border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user.id ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link href="/signup" className="inline-block">
                  <Button variant="primary" size="md" className="bg-bengalRed border-bengalRed hover:bg-bengalRed/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <button
                  className="flex items-center gap-3 bg-light border border-gray-200 rounded-full px-3 py-2"
                  onClick={() => setIsProfileOpen((s) => !s)}
                  aria-expanded={isProfileOpen}
                >
                  <span className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-6 top-16 bg-white rounded-md border border-gray-300 shadow-lg p-3 w-48">
                    <div className="flex flex-col gap-2">
                      {user.role === "worker" ? (
                        <Link href="/dashboard" className="text-gray-700 hover:text-black py-1">Dashboard</Link>
                      ) : (
                        <Link href="/employer/candidates" className="text-gray-700 hover:text-black py-1">Candidates</Link>
                      )}
                      <button onClick={handleLogout} className="text-left text-gray-700 hover:text-black py-1">Logout</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 bg-white rounded-md border border-gray-300 shadow-lg md:hidden transition-all duration-300 ease-smooth w-56">
            <div className="flex flex-col gap-1 p-4">
              <Link href="/" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">Home</Link>
              <a href="#how" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">How It Works</a>
              {!user.id ? (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">Login</Link>
                  <Link href="/signup" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">Sign Up</Link>
                </>
              ) : (
                <>
                  {user.role === "worker" ? (
                    <>
                      <Link href="/upload" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">Upload</Link>
                      <Link href="/dashboard" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">Dashboard</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/employer/candidates" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">Candidates</Link>
                      <Link href="/employer/jobs" className="text-gray-700 hover:text-black py-2 font-medium transition-colors duration-200">My Jobs</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="text-gray-900 hover:text-black py-2 text-left font-medium transition-colors duration-200">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
