export interface OwnerDashboardStats {
  totalLapangan: number;
  lapanganAktif: number;
  totalBooking: number;
  bookingBulanIni: number;
  bookingGrowth: number;
  bookingHariIni: number;
  totalPelanggan: number;
  pendapatanBersih: number;
  pendapatanHariIni: number;
  pendapatanBulanIni: number;
  pendapatanGrowth: number;
  volumeTransaksi: number;
  komisiPlatform: number;
  menungguVerifikasi: number;
  komisiBelumSetor: number;
  komisiBelumSetorNominal: number;
  payoutMenunggu: number;
}

export interface OwnerDashboardBulanan {
  year: number;
  month: number;
  label: string;
  pendapatan: number;
  volume: number;
  booking: number;
}

export interface OwnerDashboardMetode {
  metode: string;
  count: number;
  pendapatan: number;
}

export interface OwnerDashboardStatusCount {
  status: string;
  count: number;
}

export interface OwnerDashboardTopLapangan {
  id: string;
  nama: string;
  jenis: string | null;
  booking: number;
  pendapatan: number;
}

export interface OwnerDashboardBooking {
  id: string;
  kode_booking: string;
  status: string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  total_harga: number;
  user_name: string | null;
  lapangan_nama: string | null;
  lapangan_jenis: string | null;
  pembayaran_status: string | null;
  pembayaran_metode: string | null;
}

export interface OwnerDashboardData {
  generatedAt: string;
  komisi_persen: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  stats: OwnerDashboardStats;
  charts: {
    bulanan: OwnerDashboardBulanan[];
    perMetode: OwnerDashboardMetode[];
    bookingStatus: OwnerDashboardStatusCount[];
    topLapangan: OwnerDashboardTopLapangan[];
  };
  recentBookings: OwnerDashboardBooking[];
}
