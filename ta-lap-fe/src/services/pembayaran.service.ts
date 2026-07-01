import api from "@/lib/api";
import { PaymentChannel } from "@/lib/midtrans";

export type PaymentConfig = {
  snapEnabled: boolean;
  clientKey: string | null;
  isSandbox: boolean;
  configIssue?: "missing" | "placeholder" | "invalid_format" | "invalid_credentials" | "key_pair_mismatch" | "production_keys_sandbox_mode" | null;
  keyEnvironment?: "sandbox" | "production";
};

export const getPaymentConfig = async (): Promise<{ data: PaymentConfig }> => {
  const response = await api.get("/pembayaran/config");
  return response.data;
};

export const getMyPembayaran = async () => {
  const response = await api.get("/pembayaran/me");
  return response.data;
};

export const getAllPembayaran = async () => {
  const response = await api.get("/pembayaran");
  return response.data;
};

export const createSnapPayment = async (data: {
  pesanan_id: string | number;
  channel?: PaymentChannel;
}) => {
  const response = await api.post("/pembayaran/snap", data);
  return response.data;
};

export const createCashPayment = async (data: {
  pesanan_id: string | number;
}) => {
  const response = await api.post("/pembayaran/cash", data);
  return response.data;
};

export const syncPaymentStatus = async (pesananId: string) => {
  const response = await api.post(`/pembayaran/sync/${pesananId}`);
  return response.data;
};

export const abortSnapPayment = async (pesananId: string) => {
  const response = await api.post(`/pembayaran/abort/${pesananId}`);
  return response.data;
};

export const markGatewayAwaiting = async (pesananId: string) => {
  const response = await api.post(`/pembayaran/awaiting/${pesananId}`);
  return response.data;
};

/** @deprecated */
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

export const upsertPembayaranByPesanan = async (
  pesananId: string,
  data: {
    metode: string;
    status?: string;
    total_bayar?: number;
  }
) => {
  const response = await api.put(`/pembayaran/pesanan/${pesananId}`, data);
  return response.data;
};
