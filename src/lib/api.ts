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

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

// Auth API Calls
export async function loginApi(email: string, password: string):Promise<{ success: boolean; token: string; user: ApiUser; message?: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to log in");
  return data;
}

export async function forgotPasswordApi(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to dispatch reset code");
  return data;
}

export async function verifyOtpApi(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid or expired OTP");
  return data;
}

export async function resetPasswordApi(email: string, otp: string, newPassword: string): Promise<{ success: boolean; token: string; user: ApiUser; message: string }> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
}

export async function getMeApi(): Promise<{ success: boolean; user: ApiUser }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unauthorized");
  return data;
}

// Gallery API Calls
export async function fetchGalleryItems(category?: string): Promise<ApiGalleryItem[]> {
  try {
    const url = new URL(`${API_BASE}/gallery`);
    if (category && category !== "All") {
      url.searchParams.set("category", category);
    }
    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn("Could not reach Gallery API:", error);
    return [];
  }
}

export async function uploadGalleryItemApi(formData: FormData): Promise<{ success: boolean; data: ApiGalleryItem; message: string }> {
  const res = await fetch(`${API_BASE}/gallery`, {
    method: "POST",
    headers: getAuthHeaders(false), // No Content-Type for FormData
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to upload image");
  return data;
}

export async function uploadBulkGalleryItemsApi(formData: FormData): Promise<{ success: boolean; data: ApiGalleryItem[]; message: string; count: number }> {
  const res = await fetch(`${API_BASE}/gallery/bulk`, {
    method: "POST",
    headers: getAuthHeaders(false), // No Content-Type for FormData
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to upload batch images");
  return data;
}

export async function deleteGalleryItemApi(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/gallery/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete gallery item");
  return data;
}
