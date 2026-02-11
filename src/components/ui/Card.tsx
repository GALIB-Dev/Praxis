"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`bg-white/90 backdrop-blur rounded-2xl border border-slate-200 p-6 transition-all duration-300 ease-smooth hover:shadow-xl hover:border-slate-300 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
