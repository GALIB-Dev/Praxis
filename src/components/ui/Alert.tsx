"use client";

import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const bgColor = {
    success: "bg-gray-100 border-l-4 border-l-black",
    error: "bg-gray-950 border-l-4 border-l-gray-900 text-white",
    warning: "bg-gray-200 border-l-4 border-l-black",
    info: "bg-gray-100 border-l-4 border-l-black",
  }[type];

  return (
    <div className={`p-4 mb-4 rounded-md flex items-start justify-between transition-all duration-300 ease-smooth ${bgColor}`}>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-200">
          ×
        </button>
      )}
    </div>
  );
}
