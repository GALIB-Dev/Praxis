"use client";

import React from "react";
import Link from "next/link";
import Typewriter from "@/components/Typewriter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-black text-white py-28 relative overflow-hidden grid-dots">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              {/* Typewriter title */}
              <span className="sr-only">Unlock Your Career Potential</span>
              <Typewriter
                texts={[
                  "Unlock Your Career Potential",
                  "Showcase Your Skills",
                  "Get Matched with Jobs",
                ]}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDelay={1500}
                className="inline"
              />
            </h1>
            <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              SkillsMatcher uses AI to analyze your talents and connect you with
              perfect job opportunities. Or find the right talent for your team.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Button
                variant="primary"
                size="lg"
              >
                <Link href="/signup?role=worker">I'm a Worker</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
              >
                <Link href="/signup?role=employer">I'm an Employer</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white relative grid-lines-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-5xl font-bold text-center mb-20 text-black">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <Card>
                <div className="mb-6 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <rect x="2.5" y="6" width="15" height="12" rx="2" />
                    <path d="M19 8l3-2v12l-3-2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9.5" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Upload Content</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  Share videos or images showcasing your skills and expertise.
                </p>
              </Card>

              {/* Feature 2 */}
              <Card>
                <div className="mb-6 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M8 9h8M8 13h8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 17v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">AI Analysis</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  Our AI extracts and identifies all your professional skills.
                </p>
              </Card>

              {/* Feature 3 */}
              <Card>
                <div className="mb-6 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <rect x="3" y="7" width="18" height="10" rx="2" />
                    <path d="M8 7V6a4 4 0 018 0v1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">Smart Matching</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  Get matched with relevant job opportunities instantly.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* For Workers Section */}
        <section className="py-24 bg-gray-50 relative grid-dots-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-bold mb-8 text-black">For Workers</h2>
                <p className="text-gray-700 mb-10 leading-relaxed text-lg font-light">
                  Transform your skills into opportunities. Upload a video or
                  image, and let our AI identify your expertise. Get matched
                  with jobs that value what you know.
                </p>
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">AI-powered skill extraction</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">Personalized job recommendations</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">Build your professional profile</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">Direct employer connections</span>
                  </li>
                </ul>
                <Button variant="primary" size="lg">
                  <Link href="/signup?role=worker">Get Started as Worker</Link>
                </Button>
              </div>
              <div className="bg-white rounded-md border border-gray-300 p-16 text-center">
                <div className="mb-8 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <circle cx="12" cy="8" r="3" />
                    <path d="M5.5 20a6.5 6.5 0 0113 0" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg font-light">
                  Ready to showcase your skills and find your next opportunity?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Employers Section */}
        <section className="py-24 bg-white relative grid-lines-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="bg-gray-50 rounded-md border border-gray-300 p-16 text-center order-2 md:order-1">
                <div className="mb-8 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h.01M11 8h2M7 12h2M11 12h6M7 16h6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg font-light">
                  Access a pool of talented workers matched to your requirements.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-5xl font-bold mb-8 text-black">For Employers</h2>
                <p className="text-gray-700 mb-10 leading-relaxed text-lg font-light">
                  Find the right talent quickly. Browse candidates with verified
                  skills and make informed hiring decisions based on actual
                  demonstrated abilities.
                </p>
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">AI-verified skill matching</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">View detailed candidate profiles</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">Post multiple job openings</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-black font-bold text-2xl leading-none">✓</span>
                    <span className="text-gray-800 font-medium">Reduce hiring time and costs</span>
                  </li>
                </ul>
                <Button variant="primary" size="lg">
                  <Link href="/signup?role=employer">Get Started as Employer</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white py-24 relative overflow-hidden grid-dots">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-12 text-gray-300 font-light">
              Join thousands of workers and employers using SkillsMatcher.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Button variant="primary" size="lg" className="bg-white text-black hover:bg-gray-100">
                <Link href="/signup?role=worker">Sign Up as Worker</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
              >
                <Link href="/signup?role=employer">Sign Up as Employer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
