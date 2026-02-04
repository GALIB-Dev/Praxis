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
      className={`bg-white rounded-md border border-gray-300 p-6 transition-all duration-300 ease-smooth hover:shadow-lg ${className} ${onClick ? 'cursor-pointer hover:border-black' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
