export type TransaksiStatus = "menunggu" | "sukses" | "gagal" | "refund";

export type StatusKomisi = "terpotong" | "belum_lunas" | "lunas";

export type StatusPayoutOwner = "menunggu" | "dicairkan";

export interface Transaksi {
  id: string;
  kode_transaksi: string;
  kode_booking: string | null;
  tanggal_booking: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
  metode: string;
  status: TransaksiStatus;
  status_komisi: StatusKomisi;
  status_payout_owner: StatusPayoutOwner;
  total_bayar: number;
  komisi_persen: number;
  komisi_platform: number;
  pendapatan_owner: number;
  tanggal_bayar: string | null;
  catatan_settlement: string | null;
  created_at: string;
  jumlah_refund?: number;
  jumlah_potongan?: number;
  refund_reason?: string | null;
  pesanan_id: string;
  pesanan_status: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  lapangan_id: string | null;
  lapangan_nama: string | null;
  lapangan_jenis: string | null;
  owner_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
}

export interface TransaksiStats {
  total: number;
  sukses: number;
  menunggu: number;
  gagal: number;
  komisiBelumLunas: number;
  payoutMenunggu: number;
  totalVolume: number;
  totalKomisi: number;
  pendapatanAdmin: number;
  piutangKomisi: number;
  hariIni?: number;
  totalPendapatan?: number;
  pendapatanDicairkan?: number;
  komisiBelumSetor?: number;
  totalKomisiHarusSetor?: number;
}

export interface TransaksiResponse {
  stats?: TransaksiStats;
  data: Transaksi[];
  message?: string;
}

export type TransaksiStatusFilter =
  | "all"
  | "sukses"
  | "menunggu"
  | "gagal";

export type TransaksiKomisiFilter =
  | "all"
  | "terpotong"
  | "belum_lunas"
  | "lunas";

export type TransaksiPayoutFilter = "all" | "menunggu" | "dicairkan";

export interface TransaksiUpdateData {
  status?: TransaksiStatus;
  status_komisi?: StatusKomisi;
  status_payout_owner?: StatusPayoutOwner;
  catatan_settlement?: string;
}
