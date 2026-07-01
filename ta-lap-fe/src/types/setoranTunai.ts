export type SetoranTunaiStatus = "menunggu" | "disetor" | "kosong";

export interface SetoranTunaiOwnerRow {
  owner_id: string;
  owner_name: string;
  jumlah_transaksi: number;
  total_volume: number;
  total_komisi: number;
  komisi_belum_setor: number;
}

export interface SetoranTunaiMonth {
  tahun: number;
  bulan: number;
  label: string;
  jumlah_transaksi: number;
  transaksi_belum_setor?: number;
  total_volume_tunai: number;
  total_komisi: number;
  komisi_belum_setor: number;
  komisi_sudah_setor: number;
  status: SetoranTunaiStatus;
  tanggal_setor?: string | null;
  catatan?: string | null;
  setoran_id?: string | null;
  is_current_month?: boolean;
  per_owner?: SetoranTunaiOwnerRow[];
}

export interface SetoranTunaiOverviewResponse {
  komisi_persen: number;
  total_komisi_menunggu: number;
  data: SetoranTunaiMonth[];
}

export interface OwnerKewajibanSetoranMonth {
  tahun: number;
  bulan: number;
  label: string;
  jumlah_transaksi: number;
  total_volume_tunai: number;
  total_komisi: number;
  komisi_belum_setor: number;
  komisi_sudah_setor: number;
  status: SetoranTunaiStatus;
  bulan_sudah_disetor_platform?: boolean;
  is_current_month?: boolean;
  pengajuan_id?: string | null;
  pengajuan_status?: "menunggu_verifikasi" | "disetujui" | "ditolak" | null;
  pengajuan_metode?: "transfer" | "ewallet" | null;
  pengajuan_bukti?: string | null;
  catatan_admin?: string | null;
  can_submit?: boolean;
  is_pending?: boolean;
}

export interface SetoranTujuanBayar {
  app_name: string;
  app_email: string | null;
  app_phone: string | null;
  bank_code: string | null;
  bank_name: string;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  ewallet_note: string | null;
}

export interface SetoranPengajuan {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_email: string | null;
  owner_phone: string | null;
  tahun: number;
  bulan: number;
  label: string;
  total_komisi: number;
  jumlah_transaksi: number;
  metode: "transfer" | "ewallet";
  bukti_pembayaran: string | null;
  catatan_owner: string | null;
  tanggal_bayar: string;
  status: "menunggu_verifikasi" | "disetujui" | "ditolak";
  catatan_admin: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface OwnerKewajibanSetoranResponse {
  komisi_persen: number;
  total_komisi_belum_setor: number;
  tujuan_bayar: SetoranTujuanBayar;
  data: OwnerKewajibanSetoranMonth[];
}
