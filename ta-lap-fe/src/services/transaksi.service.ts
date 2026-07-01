import api from "@/lib/api";
import {
  OwnerKewajibanSetoranResponse,
  SetoranPengajuan,
  SetoranTunaiMonth,
  SetoranTunaiOverviewResponse,
} from "@/types/setoranTunai";
import {
  Transaksi,
  TransaksiResponse,
  TransaksiUpdateData,
} from "@/types/transaksi";

export const getAllTransaksi = async (): Promise<TransaksiResponse> => {
  const response = await api.get("/transaksi");
  return response.data;
};

export const getMyTransaksi = async (): Promise<TransaksiResponse> => {
  const response = await api.get("/transaksi/me");
  return response.data;
};

export const getMyTransaksiById = async (
  id: string
): Promise<{ data: Transaksi }> => {
  const response = await api.get(`/transaksi/me/${id}`);
  return response.data;
};

export const getTransaksiById = async (
  id: string
): Promise<{ data: Transaksi }> => {
  const response = await api.get(`/transaksi/${id}`);
  return response.data;
};

export const updateTransaksi = async (
  id: string,
  data: TransaksiUpdateData
): Promise<{ message: string; data: Transaksi }> => {
  const response = await api.put(`/transaksi/${id}`, data);
  return response.data;
};

export const markKomisiLunas = async (
  id: string,
  catatan?: string
): Promise<{ message: string; data: Transaksi }> => {
  const response = await api.put(`/transaksi/${id}/komisi-lunas`, {
    catatan_settlement: catatan,
  });
  return response.data;
};

export const markPayoutDicairkan = async (
  id: string,
  catatan?: string
): Promise<{ message: string; data: Transaksi }> => {
  const response = await api.put(`/transaksi/${id}/payout`, {
    catatan_settlement: catatan,
  });
  return response.data;
};

export const getSetoranTunaiOverview = async (
  months = 12
): Promise<SetoranTunaiOverviewResponse> => {
  const response = await api.get("/transaksi/setoran-tunai", {
    params: { months },
  });
  return response.data;
};

export const getSetoranTunaiDetail = async (
  tahun: number,
  bulan: number
): Promise<{ komisi_persen: number; data: SetoranTunaiMonth }> => {
  const response = await api.get(`/transaksi/setoran-tunai/${tahun}/${bulan}`);
  return response.data;
};

export const markSetoranTunaiDisetor = async (
  tahun: number,
  bulan: number,
  catatan?: string
): Promise<{ message: string; data: { total_komisi: number; jumlah_transaksi: number } }> => {
  const response = await api.post(
    `/transaksi/setoran-tunai/${tahun}/${bulan}/disetor`,
    { catatan }
  );
  return response.data;
};

export const getOwnerKewajibanSetoran = async (
  months = 6
): Promise<OwnerKewajibanSetoranResponse> => {
  const response = await api.get("/transaksi/kewajiban-setoran-tunai", {
    params: { months },
  });
  return response.data;
};

export const submitSetoranTunaiOwner = async (
  tahun: number,
  bulan: number,
  data: {
    metode: "transfer" | "ewallet";
    tanggal_bayar: string;
    catatan_owner?: string;
    bukti_base64: string;
  }
): Promise<{ message: string; data: SetoranPengajuan }> => {
  const response = await api.post(
    `/transaksi/setoran-tunai/${tahun}/${bulan}/ajukan`,
    data
  );
  return response.data;
};

export const getSetoranPengajuan = async (
  status = "all"
): Promise<{ menunggu: number; data: SetoranPengajuan[] }> => {
  const response = await api.get("/transaksi/setoran-pengajuan", {
    params: { status },
  });
  return response.data;
};

export const approveSetoranPengajuan = async (
  id: string,
  catatan_admin?: string
): Promise<{ message: string; data: SetoranPengajuan }> => {
  const response = await api.put(`/transaksi/setoran-pengajuan/${id}/setujui`, {
    catatan_admin,
  });
  return response.data;
};

export const rejectSetoranPengajuan = async (
  id: string,
  catatan_admin: string
): Promise<{ message: string; data: SetoranPengajuan }> => {
  const response = await api.put(`/transaksi/setoran-pengajuan/${id}/tolak`, {
    catatan_admin,
  });
  return response.data;
};
