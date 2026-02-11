import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Praxis - Video Skill Verification",
  description:
    "30-second video to verified skills and job matches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProvider>
          <div className="min-h-screen relative">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
