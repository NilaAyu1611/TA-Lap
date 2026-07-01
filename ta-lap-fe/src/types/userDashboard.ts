export interface UserDashboardStats {
  totalBooking: number;
  bookingBulanIni: number;
  bookingGrowth: number;
  bookingHariIni: number;
  bookingMendatang: number;
  bookingSelesai: number;
  bookingDibatalkan: number;
  menungguBayar: number;
  pembayaranMenunggu: number;
  totalPengeluaran: number;
  pengeluaranBulanIni: number;
  pengeluaranGrowth: number;
  avgPerBooking: number;
  totalLapanganTersedia: number;
}

export interface UserDashboardBulanan {
  year: number;
  month: number;
  label: string;
  pengeluaran: number;
  booking: number;
}

export interface UserDashboardMetode {
  metode: string;
  count: number;
  total: number;
}

export interface UserDashboardStatusCount {
  status: string;
  count: number;
}

export interface UserDashboardTopLapangan {
  id: string;
  nama: string;
  jenis: string | null;
  kota: string | null;
  booking: number;
  total: number;
}

export interface UserDashboardJenisCount {
  jenis: string;
  count: number;
}

export interface UserDashboardBooking {
  id: string;
  kode_booking: string;
  status: string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  lapangan_id: string | null;
  lapangan_nama: string | null;
  lapangan_jenis: string | null;
  lapangan_kota: string | null;
  lapangan_gambar: string | null;
  pembayaran_status: string | null;
  pembayaran_metode: string | null;
}

export interface UserDashboardData {
  generatedAt: string;
  maintenance_mode: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    city: string | null;
    memberSince: string | null;
  };
  stats: UserDashboardStats;
  charts: {
    bulanan: UserDashboardBulanan[];
    bookingStatus: UserDashboardStatusCount[];
    perMetode: UserDashboardMetode[];
    topLapangan: UserDashboardTopLapangan[];
    perJenis: UserDashboardJenisCount[];
  };
  upcomingBookings: UserDashboardBooking[];
  recentBookings: UserDashboardBooking[];
}
