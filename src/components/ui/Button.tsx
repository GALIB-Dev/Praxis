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
  const baseClass = "font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm transition-all duration-300 ease-smooth";

  const variantClass = {
    primary: "bg-gradient-to-r from-primary to-indigo-400 text-white hover:from-primary/90 hover:to-indigo-400/90 active:from-primary active:to-indigo-400 focus:ring-primary disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200 disabled:text-slate-400",
    outline: "border border-primary text-primary hover:bg-primary/10 hover:text-primary active:bg-primary/20 focus:ring-primary disabled:border-slate-300 disabled:text-slate-400",
    danger: "bg-gradient-to-r from-rose-600 to-red-500 text-white hover:from-rose-500 hover:to-red-400 active:from-rose-700 active:to-red-600 focus:ring-rose-500 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500",
  }[variant];

  const sizeClass = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-7 py-3",
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
