export type OwnerBusinessType =
  | "venue_futsal"
  | "venue_badminton"
  | "venue_multi"
  | "kompleks_olahraga"
  | "klub_olahraga"
  | "akademi_olahraga"
  | "operator_lapangan"
  | "perorangan"
  | "lainnya";

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatar: string | null;
  role: string;
  status: string;
  email_verified: boolean;
  joined: string;
  created_at: string;
  updated_at: string;
  verificationStatus: string | null;
  verificationNotes: string | null;
  business_name: string | null;
  business_type: OwnerBusinessType | string | null;
  business_description: string | null;
  address: string | null;
  province: string | null;
  postal_code: string | null;
  website: string | null;
  instagram: string | null;
  npwp: string | null;
  bank_code: string | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  bank_complete?: boolean;
  profile_updated_at: string | null;
  totalLapangan: number;
  lapanganAktif: number;
  totalBooking: number;
  transaksiSukses: number;
  volumeTransaksi: number;
  lastLogin: {
    created_at: string;
    ip_address: string | null;
    device: string | null;
  } | null;
}

export interface OwnerProfileFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  business_name: string;
  business_type: string;
  business_description: string;
  address: string;
  province: string;
  postal_code: string;
  website: string;
  instagram: string;
  npwp: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_holder: string;
}

export interface OwnerProfileResponse {
  data: OwnerProfile;
}

export const OWNER_BUSINESS_TYPES: {
  value: OwnerBusinessType;
  label: string;
}[] = [
  { value: "venue_futsal", label: "Venue / Lapangan Futsal" },
  { value: "venue_badminton", label: "Venue / Lapangan Badminton" },
  { value: "venue_multi", label: "Venue Multi Olahraga (futsal, badminton, dll.)" },
  { value: "kompleks_olahraga", label: "Kompleks / GOR / Sport Center" },
  { value: "klub_olahraga", label: "Klub Olahraga" },
  { value: "akademi_olahraga", label: "Akademi / Sekolah Olahraga" },
  { value: "operator_lapangan", label: "Operator Lapangan (kelola banyak venue)" },
  { value: "perorangan", label: "Pemilik Perorangan" },
  { value: "lainnya", label: "Lainnya" },
];

/** Label lama (badan hukum) — untuk data owner sebelum revisi. */
export const LEGACY_BUSINESS_TYPE_LABELS: Record<string, string> = {
  pt: "PT (data lama — pilih ulang jenis bisnis lapangan)",
  cv: "CV (data lama — pilih ulang jenis bisnis lapangan)",
  yayasan: "Yayasan (data lama — pilih ulang jenis bisnis lapangan)",
  koperasi: "Koperasi (data lama — pilih ulang jenis bisnis lapangan)",
};

export const OWNER_BUSINESS_TYPE_LABELS: Record<string, string> = {
  ...LEGACY_BUSINESS_TYPE_LABELS,
  ...Object.fromEntries(
    OWNER_BUSINESS_TYPES.map((item) => [item.value, item.label])
  ),
};
