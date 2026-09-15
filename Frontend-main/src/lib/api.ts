// Centralized API configuration for ARG Frontend

const rawBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:5000/api";

// Ensure API_BASE always includes the '/api' prefix and never ends with a trailing slash
function normalizeApiBase(url: string): string {
  let cleaned = url.trim().replace(/\/+$/, "");
  if (!cleaned.endsWith("/api")) {
    cleaned = `${cleaned}/api`;
  }
  return cleaned;
}

export const API_BASE = normalizeApiBase(rawBase);

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
