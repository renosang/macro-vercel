// src/app/lib/auth.ts
export const checkAuth = (): boolean => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("isLoggedIn") === "true";
  }
  return false;
};

export const checkAdmin = (): boolean => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("userRole") === "admin";
  }
  return false;
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userRole");
  }
};