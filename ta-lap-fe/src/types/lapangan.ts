export interface LapanganImage {
  id: string;
  image_url: string;
}

export interface Lapangan {
  id: string;
  nama: string;
  jenis: string | null;
  jenis_id: number;
  harga: number;
  status: boolean;
  gambar: string | null;
  images?: LapanganImage[];
  deskripsi: string | null;
  alamat: string | null;
  kota: string | null;
  kapasitas: number | null;
  indoor: boolean;
  jumlah_court: number | null;
  jam_buka: string | null;
  jam_tutup: string | null;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  owner_id: string | null;
  owner_name: string | null;
  owner_business_name: string | null;
  owner_email: string | null;
  totalBooking: number;
  created_at: string;
}

export interface LapanganStats {
  total: number;
  aktif: number;
  nonaktif: number;
  tanpaOwner?: number;
  totalBooking?: number;
}

export interface LapanganResponse {
  stats?: LapanganStats;
  data: Lapangan[];
  message?: string;
}

export interface LapanganFormData {
  nama: string;
  jenis?: string;
  jenis_id?: number;
  harga: number;
  kota: string;
  alamat: string;
  owner_id?: string;
  deskripsi?: string;
  status?: boolean;
  kapasitas?: number;
  indoor?: boolean;
  jumlah_court?: number;
  jam_buka?: string;
  jam_tutup?: string;
  google_maps_url?: string;
  latitude?: number | null;
  longitude?: number | null;
  gambar?: string;
  images?: string[];
}

export type LapanganStatusFilter = "all" | "active" | "inactive";
