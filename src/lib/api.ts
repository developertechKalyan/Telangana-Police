export interface ApiUser {
  id: string;
  email: string;
  name: string;
  badgeNumber?: string;
  role: "superadmin" | "admin" | "officer";
  lastLogin?: string;
}

export interface ApiGalleryItem {
  _id: string;
  title: string;
  description?: string;
  caption: {
    en: string;
    hi?: string;
    te?: string;
    gu?: string;
    ur?: string;
    sd?: string;
  };
  category: "Parade" | "Operation" | "Community" | "Traffic" | "Cyber Safety" | "Events" | "Fleet" | "General";
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  type: "photo" | "video";
  featured?: boolean;
  postedBy?: {
    _id: string;
    name: string;
    badgeNumber?: string;
  };
  createdAt: string;
}

import { API_BASE } from "@/lib/apiBase";

function getAuthHeaders(isJson: boolean = true): HeadersInit {
  const token = localStorage.getItem("mppolice_auth_token");
  const headers: Record<string, string> = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Calls the API and returns its JSON. Throws a readable error when the server is unreachable or
 * answers with something that isn't JSON (e.g. a web page because no API server is configured).
 */
async function request<T>(path: string, init: RequestInit, fallbackError: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!data) {
    throw new Error(
      res.status === 404 || !isJson ? "The server for this feature is not available right now." : fallbackError
    );
  }
  if (!res.ok) throw new Error(data.message || fallbackError);
  return data as T;
}

// Auth API Calls
export async function loginApi(email: string, password: string):Promise<{ success: boolean; token: string; user: ApiUser; message?: string }> {
  return request(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }, "Failed to log in");
}

export async function forgotPasswordApi(email: string): Promise<{ success: boolean; message: string }> {
  return request(`/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }, "Failed to dispatch reset code");
}

export async function verifyOtpApi(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  return request(`/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  }, "Invalid or expired OTP");
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string): Promise<{ success: boolean; token: string; user: ApiUser; message: string }> {
  return request(`/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  }, "Failed to reset password");
}

export async function getMeApi(): Promise<{ success: boolean; user: ApiUser }> {
  return request(`/auth/me`, {
    headers: getAuthHeaders(),
  }, "Unauthorized");
}

// Gallery API Calls
export async function fetchGalleryItems(category?: string): Promise<ApiGalleryItem[]> {
  try {
    // Works for both absolute (https://api.example/api) and relative (/api) bases.
    const qs = category && category !== "All" ? `?${new URLSearchParams({ category })}` : "";
    const data = await request<{ data?: ApiGalleryItem[] }>(`/gallery${qs}`, {}, "Failed to load gallery");
    return data.data || [];
  } catch (error) {
    console.warn("Could not reach Gallery API:", error);
    return [];
  }
}

export async function uploadGalleryItemApi(formData: FormData): Promise<{ success: boolean; data: ApiGalleryItem; message: string }> {
  return request(`/gallery`, {
    method: "POST",
    headers: getAuthHeaders(false), // No Content-Type for FormData
    body: formData,
  }, "Failed to upload image");
}

export async function uploadBulkGalleryItemsApi(formData: FormData): Promise<{ success: boolean; data: ApiGalleryItem[]; message: string; count: number }> {
  return request(`/gallery/bulk`, {
    method: "POST",
    headers: getAuthHeaders(false), // No Content-Type for FormData
    body: formData,
  }, "Failed to upload batch images");
}

export async function deleteGalleryItemApi(id: string): Promise<{ success: boolean; message: string }> {
  return request(`/gallery/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }, "Failed to delete gallery item");
}