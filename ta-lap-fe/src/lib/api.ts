import axios from "axios";
import { getAuthToken } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (window.location.hostname.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
