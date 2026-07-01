import { invokePrint } from "@/lib/printUtils";
import { formatDisplayEmailOrDash } from "@/lib/customerEmail";
import {
  OwnerLaporanExportData,
  OwnerLaporanKeuangan,
} from "@/types/ownerLaporan";

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

export function exportOwnerLaporanJson(data: OwnerLaporanExportData) {
  const slug = timestampSlug(data.generatedAt);
  const ownerSlug = (data.owner.name || "owner").replace(/\s+/g, "-").toLowerCase();
  downloadBlob(
    JSON.stringify(data, null, 2),
    `talap-laporan-owner_${ownerSlug}_${slug}.json`,
    "application/json"
  );
}

export function exportOwnerLaporanCsvRingkasan(data: OwnerLaporanKeuangan) {
  const r = data.ringkasan;
  const o = data.operasional;
  const rows = [
    ["TA-Lap — Laporan Keuangan Owner"],
    ["Owner", data.owner.name],
    ["Email", data.owner.email],
    ["Dibuat", data.generatedAt],
    ["Komisi Platform", `${data.komisi_persen}%`],
    ["Potongan Batal", `${data.batal_potongan_persen}%`],
    [],
    ["Metrik", "Nilai"],
    ["Volume Transaksi (GMV)", r.volumeTransaksi],
    ["Pendapatan Bersih Owner", r.pendapatanBersih],
    ["Komisi Platform Terpotong", r.komisiPlatform],
    ["Komisi Belum Setor", r.komisiBelumSetor],
    ["Payout Menunggu", r.payoutMenunggu],
    ["Payout Sudah Dicairkan", r.payoutDicairkan],
    ["Refund ke Customer", r.totalRefundKeCustomer],
    ["Potongan Batal (Retensi)", r.totalPotonganBatal],
    ["Booking Sukses", r.totalBookingSukses],
    ["Rata-rata Transaksi", r.rataRataTransaksi],
    [],
    ["Operasional", ""],
    ["Total Lapangan", o.totalLapangan],
    ["Lapangan Aktif", o.lapanganAktif],
    ["Total Pesanan", o.totalPesanan],
    ["Customer Unik", o.totalCustomerUnik],
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-owner-ringkasan_${slug}.csv`, "text/csv;charset=utf-8");
}

export function exportOwnerLaporanCsvBulanan(data: OwnerLaporanKeuangan) {
  const header = [
    "Tahun",
    "Bulan",
    "Transaksi",
    "Volume (Rp)",
    "Pendapatan Owner (Rp)",
    "Komisi Platform (Rp)",
  ];
  const rows = data.bulanan.map((b) => [
    b.year,
    b.month,
    b.transaksi,
    b.volume,
    b.pendapatanOwner,
    b.komisiPlatform,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-owner-bulanan_${slug}.csv`, "text/csv;charset=utf-8");
}

export function exportOwnerLaporanCsvTransaksi(data: OwnerLaporanExportData) {
  const header = [
    "Kode TRX",
    "Kode Booking",
    "Tanggal",
    "Customer",
    "Email",
    "Lapangan",
    "Jenis",
    "Metode",
    "Status",
    "Status Komisi",
    "Status Payout",
    "Total Bayar",
    "Komisi %",
    "Komisi Platform",
    "Pendapatan Owner",
    "Refund",
    "Potongan Batal",
  ];

  const rows = data.transaksi.map((t) => [
    t.kode_transaksi,
    t.kode_booking ?? "",
    t.tanggal_bayar || t.created_at,
    t.user_name ?? "",
    formatDisplayEmailOrDash(t.user_email),
    t.lapangan_nama ?? "",
    t.lapangan_jenis ?? "",
    t.metode,
    t.status,
    t.status_komisi,
    t.status_payout_owner,
    t.total_bayar,
    t.komisi_persen,
    t.komisi_platform,
    t.pendapatan_owner,
    t.jumlah_refund ?? 0,
    t.jumlah_potongan ?? 0,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-owner-transaksi_${slug}.csv`, "text/csv;charset=utf-8");
}

export function exportOwnerLaporanCsvTopLapangan(data: OwnerLaporanKeuangan) {
  const header = ["Lapangan", "Jenis", "Booking", "Volume (Rp)", "Pendapatan Owner (Rp)"];
  const rows = data.topLapangan.map((l) => [
    l.nama,
    l.jenis ?? "",
    l.booking,
    l.volume,
    l.pendapatanOwner,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const slug = timestampSlug(data.generatedAt);
  downloadBlob(csv, `talap-owner-lapangan_${slug}.csv`, "text/csv;charset=utf-8");
}

export function printOwnerLaporan() {
  invokePrint();
}
