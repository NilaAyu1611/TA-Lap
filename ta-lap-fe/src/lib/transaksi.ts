import {
  StatusKomisi,
  StatusPayoutOwner,
  TransaksiStatus,
} from "@/types/transaksi";

export const TRANSAKSI_STATUS_OPTIONS: {
  value: TransaksiStatus;
  label: string;
}[] = [
  { value: "menunggu", label: "Menunggu" },
  { value: "sukses", label: "Sukses" },
  { value: "gagal", label: "Gagal" },
  { value: "refund", label: "Refund" },
];

export const KOMISI_STATUS_OPTIONS: {
  value: StatusKomisi;
  label: string;
  description: string;
}[] = [
  {
    value: "terpotong",
    label: "Terpotong",
    description:
      "Komisi per booking otomatis dipotong (QRIS/Transfer/E-Wallet)",
  },
  {
    value: "belum_lunas",
    label: "Belum Lunas",
    description:
      "Komisi tunai untuk booking ini belum disetor ke platform",
  },
  {
    value: "lunas",
    label: "Lunas",
    description: "Owner sudah bayar komisi ke platform",
  },
];

export const PAYOUT_STATUS_OPTIONS: {
  value: StatusPayoutOwner;
  label: string;
  description: string;
}[] = [
  {
    value: "menunggu",
    label: "Belum ditransfer",
    description:
      "Pendapatan owner belum Anda transfer ke rekening owner (tandai setelah transfer manual)",
  },
  {
    value: "dicairkan",
    label: "Sudah ditransfer",
    description: "Admin sudah transfer pendapatan owner ke rekening mereka",
  },
];

export function formatTransaksiStatus(status: string): string {
  return (
    TRANSAKSI_STATUS_OPTIONS.find((item) => item.value === status)?.label ??
    status
  );
}

export function formatKomisiStatus(status: string): string {
  return (
    KOMISI_STATUS_OPTIONS.find((item) => item.value === status)?.label ??
    status
  );
}

export function formatPayoutStatus(status: string): string {
  return (
    PAYOUT_STATUS_OPTIONS.find((item) => item.value === status)?.label ??
    status
  );
}
