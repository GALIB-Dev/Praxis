"use client";

import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">SkillsMatcher</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting workers with opportunities through intelligent skill matching.
            </p>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">For Workers</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/upload" className="hover:text-white transition-colors duration-200">
                  Upload Content
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors duration-200">
                  View Matches
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-white transition-colors duration-200">
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">For Employers</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/employer/candidates" className="hover:text-white transition-colors duration-200">
                  Find Candidates
                </a>
              </li>
              <li>
                <a href="/employer/jobs" className="hover:text-white transition-colors duration-200">
                  Post Jobs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} SkillsMatcher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
