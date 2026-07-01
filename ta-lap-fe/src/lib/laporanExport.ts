import { invokePrint } from "@/lib/printUtils";
import { formatDisplayEmailOrDash } from "@/lib/customerEmail";
import { LaporanExportData, LaporanKeuangan } from "@/types/laporan";

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function timestampSlug(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function csvEscape(value: string | number | null | undefined) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportLaporanJson(data: LaporanExportData) {
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(
    JSON.stringify(data, null, 2),
    `talap-laporan-backup_${slug}.json`,
    "application/json"
  );
}

export function exportLaporanCsvRingkasan(data: LaporanKeuangan) {
  const r = data.ringkasan;
  const rows = [
    ["TA-Lap — Laporan Keuangan Platform"],
    ["Dibuat", data.generatedAt],
    ["Komisi Platform", `${data.komisi_persen}%`],
    [],
    ["Metrik", "Nilai (Rp)"],
    ["Volume Transaksi (GMV)", r.volumeTransaksi],
    ["Pendapatan Admin (Komisi Terkumpul)", r.pendapatanAdmin],
    ["Piutang Komisi", r.piutangKomisi],
    ["Total Pemasukan Potensial", r.totalPemasukanPotensial],
    ["Pengeluaran Refund", r.pengeluaranRefund],
    ["Pengeluaran Operasional", r.pengeluaranOperasional],
    ["Total Pengeluaran", r.totalPengeluaran],
    ["Laba Bersih", r.labaBersih],
    ["Kewajiban Payout Owner", r.kewajibanPayout],
    ["Payout Sudah Dicairkan", r.payoutDicairkan],
    ["Booking Sukses", r.totalBookingSukses],
    ["Owner Belum Bayar Komisi", r.ownerBelumBayarKomisi],
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-laporan-ringkasan_${slug}.csv`, "text/csv;charset=utf-8");
}

export function exportLaporanCsvBulanan(data: LaporanKeuangan) {
  const header = ["Tahun", "Bulan", "Jumlah Transaksi", "Volume (Rp)", "Pemasukan Admin (Rp)"];
  const rows = data.bulanan.map((b) => [
    b.year,
    b.month,
    b.transaksi,
    b.volume,
    b.pemasukan,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-laporan-bulanan_${slug}.csv`, "text/csv;charset=utf-8");
}

export function exportLaporanCsvTransaksi(data: LaporanExportData) {
  const header = [
    "Kode TRX",
    "Kode Booking",
    "Tanggal",
    "Customer",
    "Email Customer",
    "Lapangan",
    "Owner",
    "Metode",
    "Status",
    "Status Komisi",
    "Status Payout",
    "Total Bayar",
    "Komisi %",
    "Komisi Platform",
    "Pendapatan Owner",
  ];

  const rows = data.transaksi.map((t) => [
    t.kode_transaksi,
    t.kode_booking ?? "",
    t.tanggal_bayar || t.created_at,
    t.user_name ?? "",
    formatDisplayEmailOrDash(t.user_email),
    t.lapangan_nama ?? "",
    t.owner_name ?? "",
    t.metode,
    t.status,
    t.status_komisi,
    t.status_payout_owner,
    t.total_bayar,
    t.komisi_persen,
    t.komisi_platform,
    t.pendapatan_owner,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-laporan-transaksi_${slug}.csv`, "text/csv;charset=utf-8");
}

export function exportLaporanCsvPengeluaran(data: LaporanKeuangan) {
  const header = ["Tanggal", "Kategori", "Deskripsi", "Jumlah (Rp)"];
  const rows = data.pengeluaran.map((p) => [
    p.tanggal,
    p.kategori,
    p.deskripsi,
    p.jumlah,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-laporan-pengeluaran_${slug}.csv`, "text/csv;charset=utf-8");
}

export function printLaporan() {
  invokePrint();
}
