import api from "@/lib/api";
import {
  Pesanan,
  PesananFormData,
  PesananResponse,
  PesananStatus,
} from "@/types/pesanan";

export const getKebijakanBatal = async () => {
  const response = await api.get("/pesanan/kebijakan-batal");
  return response.data;
};

export const cancelPesanan = async (
  id: string,
  alasan?: string
): Promise<{
  message: string;
  data: Pesanan;
  refund?: {
    potongan_persen: number;
    refund_persen: number;
    jumlah_potongan: number;
    jumlah_refund: number;
  };
}> => {
  const response = await api.post(`/pesanan/${id}/batal`, { alasan });
  return response.data;
};

export const getMyPesanan = async () => {
  const response = await api.get("/pesanan/me");
  return response.data;
};

export const getAllPesanan = async (): Promise<PesananResponse> => {
  const response = await api.get("/pesanan");
  return response.data;
};

export const getPesananById = async (
  id: string
): Promise<{ data: Pesanan }> => {
  const response = await api.get(`/pesanan/${id}`);
  return response.data;
};

export const createPesanan = async (
  data: PesananFormData
): Promise<{ message: string; data: Pesanan }> => {
  const response = await api.post("/pesanan", data);
  return response.data;
};

export const updatePesanan = async (
  id: string,
  data: Partial<PesananFormData>
): Promise<{ message: string; data: Pesanan }> => {
  const response = await api.put(`/pesanan/${id}`, data);
  return response.data;
};

export const updateStatusPesanan = async (
  id: string,
  status: PesananStatus
): Promise<{ message: string; data: Pesanan }> => {
  const response = await api.put(`/pesanan/${id}/status`, { status });
  return response.data;
};

export const deletePesanan = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/pesanan/${id}`);
  return response.data;
};
