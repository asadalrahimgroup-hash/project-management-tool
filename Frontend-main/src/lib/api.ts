// Centralized API configuration for ARG Frontend

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:5000/api";

// Base URL without /api trailing segment (for static uploads, health checks, etc.)
export const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    return { "Content-Type": "application/json" };
  }
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
