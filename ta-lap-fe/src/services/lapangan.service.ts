import api from "@/lib/api";
import { LapanganAvailability } from "@/types/lapanganAvailability";
import {
  Lapangan,
  LapanganFormData,
  LapanganResponse,
} from "@/types/lapangan";

export const getLapangan = async (): Promise<LapanganResponse> => {
  const response = await api.get("/lapangan");
  return response.data;
};

export type PublicLapanganPreviewResponse = {
  message: string;
  data: Lapangan[];
  total: number;
};

/** Preview beranda — tanpa token (hindari interceptor 401) */
export const getPublicLapanganPreview = async (
  limit = 3
): Promise<PublicLapanganPreviewResponse> => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
  const response = await fetch(`${base}/lapangan/public?limit=${limit}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Gagal memuat preview lapangan");
  }
  return response.json();
};

export const getLapanganById = async (
  id: string
): Promise<{ data: Lapangan }> => {
  const response = await api.get(`/lapangan/${id}`);
  return response.data;
};

export const getLapanganAvailability = async (
  id: string,
  date: string
): Promise<{ data: LapanganAvailability }> => {
  const response = await api.get(`/lapangan/${id}/availability`, {
    params: { date },
  });
  return response.data;
};

export const createLapangan = async (
  data: LapanganFormData
): Promise<{ message: string; data: Lapangan }> => {
  const response = await api.post("/lapangan", data);
  return response.data;
};

export const updateLapangan = async (
  id: string,
  data: Partial<LapanganFormData>
): Promise<{ message: string; data: Lapangan }> => {
  const response = await api.put(`/lapangan/${id}`, data);
  return response.data;
};

export const deleteLapangan = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/lapangan/${id}`);
  return response.data;
};
