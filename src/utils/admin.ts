/**
 * Admin utility functions for access control
 */

export const isUserAdmin = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isAdmin") === "true";
};

export const clearAdminStatus = (): void => {
  localStorage.removeItem("isAdmin");
};

export const getAdminStatus = (): string => {
  return isUserAdmin() ? "Admin" : "User";
};
