import api from "@/lib/api";
import {
  PasswordFormData,
  PlatformSettings,
  ProfileFormData,
  SettingsFormData,
  SettingsResponse,
} from "@/types/settings";

export type PublicPlatformContact = {
  app_name: string;
  app_email: string | null;
  app_phone: string | null;
};

export const getPublicSettings = async (): Promise<PublicPlatformContact> => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
  const response = await fetch(`${base}/settings/public`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Gagal memuat kontak platform");
  }
  return response.json();
};

export const getSettings = async (): Promise<SettingsResponse> => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (
  data: Partial<SettingsFormData>
): Promise<{ message: string; settings: PlatformSettings }> => {
  const response = await api.put("/settings", data);
  return response.data;
};

export const updateAdminProfile = async (data: ProfileFormData) => {
  const response = await api.put("/settings/profile", data);
  return response.data;
};

export const changeAdminPassword = async (data: PasswordFormData) => {
  const response = await api.put("/settings/password", data);
  return response.data;
};

export const createSystemBackup = async () => {
  const response = await api.post("/settings/backup");
  return response.data as {
    message: string;
    fileName: string;
    download: Record<string, unknown>;
    backup: { id: string; file_name: string; size: string | null; status: string; created_at: string };
  };
};
