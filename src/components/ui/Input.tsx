"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-900 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 border rounded-xl bg-white font-medium text-slate-800 transition-all duration-300 ease-smooth focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
          error ? "border-rose-500" : "border-slate-200"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-rose-600 text-sm font-medium mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-slate-500 text-sm mt-1.5">{helperText}</p>}
    </div>
  );
}
