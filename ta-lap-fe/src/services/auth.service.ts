import api from "@/lib/api";

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city?: string;
};

export type RegisterOwnerPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  nama_usaha?: string;
  catatan?: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "owner" | "user";
    phone?: string;
    city?: string;
    avatar?: string;
    status?: string;
  };
};

export type GoogleAuthConfig = {
  enabled: boolean;
  clientId: string | null;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};

export const loginWithGoogle = async (credential: string) => {
  const response = await api.post<AuthResponse>("/auth/google", { credential });
  return response.data;
};

export const getGoogleAuthConfig = async () => {
  const response = await api.get<GoogleAuthConfig>("/auth/google/config");
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post<{
    message: string;
    devResetUrl?: string;
    emailConfigured?: boolean;
  }>("/auth/forgot-password", { email });
  return response.data;
};

export const verifyResetToken = async (token: string) => {
  const response = await api.get<{ valid: boolean; message?: string }>(
    "/auth/reset-password/verify",
    {
      params: { token },
      validateStatus: (status) => status === 200 || status === 400,
    }
  );
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post<{ message: string }>("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};

export const register = async (payload: RegisterUserPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const registerOwner = async (payload: RegisterOwnerPayload) => {
  const response = await api.post("/auth/register/owner", payload);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
