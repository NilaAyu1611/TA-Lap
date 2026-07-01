import { LabaRugiLine, LaporanBreakdownItem } from "@/types/laporan";
import { Transaksi } from "@/types/transaksi";

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
}

export interface OwnerLaporanRingkasan {
  volumeTransaksi: number;
  pendapatanBersih: number;
  komisiPlatform: number;
  komisiBelumSetor: number;
  komisiBelumSetorCount: number;
  payoutMenunggu: number;
  payoutDicairkan: number;
  totalRefundKeCustomer: number;
  totalPotonganBatal: number;
  labaBersihEstimasi: number;
  totalBookingSukses: number;
  rataRataTransaksi: number;
  transaksiSukses: number;
}

export interface OwnerLaporanOperasional {
  totalLapangan: number;
  lapanganAktif: number;
  totalPesanan: number;
  pesananPending: number;
  pesananDibayar: number;
  pesananSelesai: number;
  pesananDibatalkan: number;
  totalTransaksi: number;
  transaksiSukses: number;
  transaksiMenunggu: number;
  transaksiGagalRefund: number;
  totalCustomerUnik: number;
}

export interface OwnerLabaRugi {
  pendapatan: LabaRugiLine[];
  totalPendapatanPotensial: number;
  totalPendapatanRealisasi: number;
  pengeluaran: LabaRugiLine[];
  totalPengeluaran: number;
  labaBersih: number;
  posisiKeuangan: LabaRugiLine[];
}

export interface OwnerLaporanBulanan {
  year: number;
  month: number;
  volume: number;
  pendapatanOwner: number;
  komisiPlatform: number;
  transaksi: number;
}

export interface OwnerTopLapangan {
  lapangan_id: string;
  nama: string;
  jenis: string | null;
  booking: number;
  volume: number;
  pendapatanOwner: number;
}

export interface OwnerPerMetode {
  metode: string;
  count: number;
  volume: number;
  pendapatanOwner: number;
  komisiPlatform: number;
}

export interface OwnerPerJenis {
  jenis: string;
  count: number;
  volume: number;
  pendapatanOwner: number;
}

export interface OwnerLaporanKeuangan {
  generatedAt: string;
  owner: OwnerProfile;
  komisi_persen: number;
  batal_potongan_persen: number;
  ringkasan: OwnerLaporanRingkasan;
  operasional: OwnerLaporanOperasional;
  labaRugi: OwnerLabaRugi;
  breakdown: {
    pemasukan: LaporanBreakdownItem[];
    pengeluaran: LaporanBreakdownItem[];
    kewajiban: LaporanBreakdownItem[];
  };
  bulanan: OwnerLaporanBulanan[];
  topLapangan: OwnerTopLapangan[];
  perMetode: OwnerPerMetode[];
  perJenis: OwnerPerJenis[];
}

export type OwnerLaporanExportData = OwnerLaporanKeuangan & {
  transaksi: Transaksi[];
};
