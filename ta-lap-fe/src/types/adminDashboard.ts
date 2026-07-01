export type AdminDashboardBulanan = {
  year: number;
  month: number;
  label: string;
  volume: number;
  komisi: number;
  booking: number;
};

export type AdminDashboardMetode = {
  metode: string;
  count: number;
  volume: number;
  komisi: number;
};

export type AdminDashboardStatusCount = {
  status: string;
  count: number;
};

export type AdminDashboardStats = {
  totalUsers: number;
  totalOwners: number;
  totalLapangan: number;
  lapanganAktif: number;
  totalBooking: number;
  bookingBulanIni: number;
  bookingGrowth: number;
  bookingHariIni: number;
  volumeTransaksi: number;
  komisiPlatform: number;
  volumeHariIni: number;
  komisiHariIni: number;
  volumeBulanIni: number;
  komisiBulanIni: number;
  volumeGrowth: number;
  pendingOwnerReview: number;
  pembayaranMenunggu: number;
  komisiBelumSetor: number;
  komisiBelumSetorNominal: number;
  payoutMenunggu: number;
};

export type AdminDashboardData = {
  generatedAt: string;
  komisi_persen: number;
  stats: AdminDashboardStats;
  charts: {
    bulanan: AdminDashboardBulanan[];
    perMetode: AdminDashboardMetode[];
    bookingStatus: AdminDashboardStatusCount[];
  };
};
