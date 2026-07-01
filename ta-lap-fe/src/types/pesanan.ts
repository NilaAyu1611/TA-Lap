import { PembayaranFormData } from "@/lib/pembayaran";

export type PesananStatus =
  | "pending"
  | "dibayar"
  | "selesai"
  | "dibatalkan"
  | "expired";

export interface PesananPembayaran {
  id: string;
  metode: string;
  status: string;
  total_bayar: number;
  tanggal_bayar: string | null;
  komisi_persen?: number;
  komisi_platform?: number;
  pendapatan_owner?: number;
  status_komisi?: string;
  status_payout_owner?: string;
  jumlah_refund?: number;
  jumlah_potongan?: number;
  refund_reason?: string | null;
  /** True jika transaksi online sudah dikirim ke Midtrans dan menunggu settlement. */
  gateway_awaiting?: boolean;
  kode_transaksi?: string;
}

export interface Pesanan {
  id: string;
  kode_booking: string;
  status: PesananStatus;
  total_harga: number;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  catatan: string | null;
  created_at: string;
  updated_at?: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  lapangan_id: string;
  lapangan_nama: string | null;
  lapangan_jenis: string | null;
  owner_id: string | null;
  owner_name: string | null;
  pembayaran: PesananPembayaran | null;
}

export interface PesananStats {
  total: number;
  pending: number;
  dibayar: number;
  selesai: number;
  dibatalkan: number;
  totalRevenue: number;
}

export interface PesananResponse {
  stats?: PesananStats;
  data: Pesanan[];
  message?: string;
}

export interface WalkInCustomerInput {
  name: string;
  phone: string;
  email?: string;
}

export interface PesananFormData {
  user_id?: string;
  walk_in_customer?: WalkInCustomerInput;
  lapangan_id: string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  catatan?: string;
  status?: PesananStatus;
  pembayaran?: PembayaranFormData;
}

export type PesananStatusFilter = "all" | PesananStatus;
