"use client";

import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white mt-16 border-t border-gray-700 bengali-alpana">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">SkillsMatcher</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              আপনার দক্ষতা যাচাই করে কাজের সাথে সংযোগ দিচ্ছি দ্রুত এবং নির্ভরযোগ্যভাবে।
            </p>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">কর্মীদের জন্য</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/record" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  ভিডিও রেকর্ড
                </a>
              </li>
              <li>
                <a href="/skill-wallet" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  স্কিল ওয়ালেট
                </a>
              </li>
              <li>
                <a href="/job-match" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  চাকরির মিল
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">নিয়োগকারীদের জন্য</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/employer/candidates" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  প্রার্থী খুঁজুন
                </a>
              </li>
              <li>
                <a href="/employer/jobs" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  চাকরি পোস্ট করুন
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">নীতিমালা</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/privacy" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  প্রাইভেসি পলিসি
                </a>
              </li>
              <li>
                <a href="/terms" className="!text-gray-300 hover:!text-white transition-colors duration-200">
                  সেবার শর্তাবলি
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} SkillsMatcher. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
}
