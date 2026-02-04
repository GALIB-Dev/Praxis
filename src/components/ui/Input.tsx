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
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 border-2 rounded-md font-medium transition-all duration-300 ease-smooth focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 ${
          error ? "border-gray-900 focus:border-gray-900" : "border-gray-300 focus:border-black"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-gray-900 text-sm font-medium mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-gray-600 text-sm mt-1.5">{helperText}</p>}
    </div>
  );
}
