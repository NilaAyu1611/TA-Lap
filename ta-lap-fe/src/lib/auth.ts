import { logout as logoutApi } from "@/services/auth.service";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "user";
  phone?: string;
  city?: string;
  avatar?: string;
  status?: string;
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const storeUser = (user: AuthUser) => {
  const { password: _, ...safe } = user as AuthUser & { password?: string };
  localStorage.setItem("user", JSON.stringify(safe));
  document.cookie = `user=${encodeURIComponent(JSON.stringify(safe))}; path=/; max-age=86400; SameSite=Lax`;
};

export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const handleLogout = async () => {
  try {
    await logoutApi();
  } catch {
    // ignore network errors on logout
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "user=; path=/; max-age=0";
  window.location.href = "/login";
};

export const formatRupiah = (value: number | string) => {
  const num = Number(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
