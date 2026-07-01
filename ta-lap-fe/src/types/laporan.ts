import { Transaksi } from "@/types/transaksi";

export type KategoriPengeluaran =
  | "operasional"
  | "refund_manual"
  | "marketing"
  | "lainnya";

export interface LaporanRingkasan {
  volumeTransaksi: number;
  pendapatanAdmin: number;
  piutangKomisi: number;
  totalPemasukanPotensial: number;
  pengeluaranRefund: number;
  pengeluaranOperasional: number;
  totalPengeluaran: number;
  labaBersih: number;
  kewajibanPayout: number;
  payoutDicairkan: number;
  totalBookingSukses: number;
  ownerBelumBayarKomisi: number;
}

export interface LaporanOperasional {
  totalUsers: number;
  totalOwners: number;
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
  transaksiGagal: number;
}

export interface LabaRugiLine {
  label: string;
  amount: number;
  note?: string;
  isReceivable?: boolean;
  type?: "liability" | "info";
}

export interface LabaRugi {
  pendapatan: LabaRugiLine[];
  totalPendapatanRealisasi: number;
  totalPendapatanPotensial: number;
  pengeluaran: LabaRugiLine[];
  totalPengeluaran: number;
  labaBersih: number;
  posisiKeuangan: LabaRugiLine[];
}

export interface LaporanBreakdownItem {
  label: string;
  amount: number;
  type: "income" | "receivable" | "expense" | "liability" | "info";
}

export interface LaporanBulanan {
  year: number;
  month: number;
  volume: number;
  pemasukan: number;
  transaksi: number;
}

export interface PengeluaranItem {
  id: string;
  kategori: KategoriPengeluaran;
  deskripsi: string;
  jumlah: number;
  tanggal: string;
}

export interface LaporanKeuangan {
  generatedAt: string;
  komisi_persen: number;
  operasional: LaporanOperasional;
  ringkasan: LaporanRingkasan;
  labaRugi: LabaRugi;
  breakdown: {
    pemasukan: LaporanBreakdownItem[];
    pengeluaran: LaporanBreakdownItem[];
    kewajiban: LaporanBreakdownItem[];
  };
  bulanan: LaporanBulanan[];
  pengeluaran: PengeluaranItem[];
}

export type LaporanExportData = LaporanKeuangan & {
  transaksi: Transaksi[];
};

export interface PengeluaranFormData {
  kategori: KategoriPengeluaran;
  deskripsi: string;
  jumlah: number;
  tanggal?: string;
}
