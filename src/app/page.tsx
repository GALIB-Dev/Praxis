"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-light grid-dots-sm">
        <section className="py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-black">
              আপনার দক্ষতার প্রমাণ, চাকরির সেরা চাবিকাঠি
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-700 max-w-2xl mx-auto">
              ৩০ সেকেন্ডে ভিডিও দিন, এআই আপনার স্কিল যাচাই করে মিলিয়ে দেবে কাজ।
            </p>
            <Button variant="primary" size="lg">
              <Link href="/record">ভিডিও রেকর্ড করুন</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
