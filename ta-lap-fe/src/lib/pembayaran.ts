export type MetodePembayaran = "transfer" | "qris" | "cash" | "ewallet";

export type StatusPembayaran = "menunggu" | "sukses" | "gagal" | "refund";

export const METODE_PEMBAYARAN_OPTIONS: {
  value: MetodePembayaran;
  label: string;
}[] = [
  { value: "transfer", label: "Transfer Bank" },
  { value: "qris", label: "QRIS" },
  { value: "cash", label: "Tunai (Cash)" },
  { value: "ewallet", label: "E-Wallet" },
];

export const STATUS_PEMBAYARAN_OPTIONS: {
  value: StatusPembayaran;
  label: string;
}[] = [
  { value: "menunggu", label: "Menunggu Verifikasi" },
  { value: "sukses", label: "Sukses" },
  { value: "gagal", label: "Gagal" },
  { value: "refund", label: "Refund" },
];

export function formatMetodePembayaran(metode: string | null | undefined): string {
  if (!metode) return "—";
  const found = METODE_PEMBAYARAN_OPTIONS.find(
    (item) => item.value === metode.toLowerCase()
  );
  if (found) return found.label;
  return metode.charAt(0).toUpperCase() + metode.slice(1);
}

export function formatStatusPembayaran(status: string | null | undefined): string {
  if (!status) return "—";
  const found = STATUS_PEMBAYARAN_OPTIONS.find((item) => item.value === status);
  return found?.label ?? status;
}

export interface PembayaranFormData {
  metode: MetodePembayaran;
  status?: StatusPembayaran;
  total_bayar?: number;
}
