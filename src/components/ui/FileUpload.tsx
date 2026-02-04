"use client";

import React from "react";

interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  helpText?: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  label,
  accept,
  onFileSelect,
  isLoading = false,
  helpText,
  maxSize = 50,
}: FileUploadProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-3">{label}</label>
      <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center bg-white hover:bg-gray-50 hover:border-black transition-all duration-300 ease-smooth">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <p className="text-gray-900 font-medium mb-2">
            Drag and drop your file here or click to browse
          </p>
          <p className="text-sm text-gray-600">{helpText}</p>
        </label>
      </div>
      {error && <p className="text-gray-900 text-sm font-medium mt-2">{error}</p>}
    </div>
  );
}
