"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to start page (landing page)
    router.push("/start");
  }, [router]);

  return null;
}
