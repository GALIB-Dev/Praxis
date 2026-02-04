"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseClass = "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-smooth";

  const variantClass = {
    primary: "bg-black text-white hover:bg-gray-900 active:bg-black focus:ring-black disabled:bg-gray-300 disabled:text-gray-600",
    secondary: "bg-gray-800 text-white hover:bg-gray-900 active:bg-black focus:ring-gray-800 disabled:bg-gray-400 disabled:text-gray-600",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white active:bg-gray-900 focus:ring-black disabled:border-gray-400 disabled:text-gray-400",
    danger: "bg-gray-900 text-white hover:bg-black active:bg-gray-950 focus:ring-gray-900 disabled:bg-gray-300 disabled:text-gray-600",
  }[variant];

  const sizeClass = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-7 py-3.5",
  }[size];

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
