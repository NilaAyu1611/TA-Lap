import api from "@/lib/api";

export const getMyPembayaran = async () => {
  const response = await api.get("/pembayaran/me");
  return response.data;
};

export const getAllPembayaran = async () => {
  const response = await api.get("/pembayaran");
  return response.data;
};

export const createPembayaran = async (data: {
  pesanan_id: string | number;
  metode: string;
  total_bayar?: number;
}) => {
  const response = await api.post("/pembayaran", data);
  return response.data;
};

export const updateStatusPembayaran = async (id: string, status: string) => {
  const response = await api.put(`/pembayaran/${id}`, { status });
  return response.data;
};
