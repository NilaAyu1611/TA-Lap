import api from "@/lib/api";
import { LaporanKeuangan, PengeluaranFormData } from "@/types/laporan";
import { Transaksi } from "@/types/transaksi";

export const getLaporanKeuangan = async (): Promise<LaporanKeuangan> => {
  const response = await api.get("/laporan/keuangan");
  return response.data;
};

export const getLaporanTransaksi = async (): Promise<{
  total: number;
  data: Transaksi[];
}> => {
  const response = await api.get("/laporan/transaksi");
  return response.data;
};

export const createPengeluaran = async (data: PengeluaranFormData) => {
  const response = await api.post("/laporan/pengeluaran", data);
  return response.data;
};

export const deletePengeluaran = async (id: string) => {
  const response = await api.delete(`/laporan/pengeluaran/${id}`);
  return response.data;
};

export const getOwnerLaporanKeuangan = async () => {
  const response = await api.get("/laporan/owner/keuangan");
  return response.data;
};

export const getOwnerLaporanTransaksi = async (): Promise<{
  total: number;
  data: Transaksi[];
}> => {
  const response = await api.get("/laporan/owner/transaksi");
  return response.data;
};
