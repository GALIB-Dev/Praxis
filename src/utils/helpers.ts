// String utilities
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Date utilities
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const secondsPassed = Math.floor(
    (now.getTime() - dateObj.getTime()) / 1000
  );

  if (secondsPassed < 60) return "just now";
  if (secondsPassed < 3600) return `${Math.floor(secondsPassed / 60)}m ago`;
  if (secondsPassed < 86400) return `${Math.floor(secondsPassed / 3600)}h ago`;
  if (secondsPassed < 604800) return `${Math.floor(secondsPassed / 86400)}d ago`;

  return formatDate(dateObj);
};

// Array utilities
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export const sortByProperty = <T extends Record<string, any>>(
  arr: T[],
  property: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...arr].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// Object utilities
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });
  return params.toString();
};

// Local storage utilities
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue || null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
};

// Number utilities
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const percentageColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-blue-600";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
};

export const percentageBgColor = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-100";
  if (percentage >= 60) return "bg-blue-100";
  if (percentage >= 40) return "bg-yellow-100";
  return "bg-red-100";
};
