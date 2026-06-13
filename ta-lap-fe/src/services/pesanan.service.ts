import api from "@/lib/api";

export const getMyPesanan = async () => {
  const response = await api.get("/pesanan/me");
  return response.data;
};

export const getAllPesanan = async () => {
  const response = await api.get("/pesanan");
  return response.data;
};

export const createPesanan = async (data: {
  lapangan_id: string | number;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  catatan?: string;
}) => {
  const response = await api.post("/pesanan", data);
  return response.data;
};

export const updateStatusPesanan = async (id: string, status: string) => {
  const response = await api.put(`/pesanan/${id}/status`, { status });
  return response.data;
};
