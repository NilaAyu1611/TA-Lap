export type OwnerStatus = "active" | "pending" | "blocked" | "suspended";
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface OwnerLapangan {
  id: string;
  nama: string;
  status: boolean;
  kota: string | null;
  totalBooking?: number;
  transaksiSukses?: number;
  volumeTransaksi?: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatar: string | null;
  status: OwnerStatus;
  email_verified?: boolean;
  joined: string;
  verificationStatus: VerificationStatus | null;
  verificationNotes: string | null;
  registrationSource?: "website" | "admin";
  totalLapangan: number;
  lapanganAktif: number;
  totalBooking: number;
  transaksiSukses: number;
  volumeTransaksi: number;
  pendapatanOwner: number;
  lapangans: OwnerLapangan[];
}

export type OwnerActivityFilter =
  | "all"
  | "menunggu_verifikasi"
  | "sudah_laku"
  | "belum_laku"
  | "tanpa_lapangan";

export interface OwnerStats {
  total: number;
  active: number;
  pending: number;
  blocked: number;
  pendingReview: number;
  totalVenues: number;
  sudahLaku: number;
  belumLaku: number;
  tanpaLapangan: number;
}

export interface OwnerResponse {
  stats: OwnerStats;
  data: Owner[];
}

export interface OwnerFormData {
  name: string;
  email: string;
  password?: string;
  phone: string;
  city: string;
  status: OwnerStatus;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
}
