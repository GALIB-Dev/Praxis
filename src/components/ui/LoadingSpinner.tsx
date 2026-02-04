"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = "md", fullScreen = false }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }[size];

  const spinner = (
    <div
      className={`${sizeClass} border-4 border-gray-300 border-t-primary rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center">{spinner}</div>;
}
