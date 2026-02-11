"use client";

import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const bgColor = {
    success: "bg-emerald-50 border-l-4 border-l-emerald-500 text-emerald-900",
    error: "bg-rose-50 border-l-4 border-l-rose-500 text-rose-900",
    warning: "bg-amber-50 border-l-4 border-l-amber-500 text-amber-900",
    info: "bg-indigo-50 border-l-4 border-l-indigo-500 text-indigo-900",
  }[type];

  return (
    <div className={`p-4 mb-4 rounded-md flex items-start justify-between transition-all duration-300 ease-smooth ${bgColor}`}>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold text-current/70 hover:text-current transition-colors duration-200">
          ×
        </button>
      )}
    </div>
  );
}
