import { needsPayment } from "@/lib/pesananPayment";
import { Pesanan } from "@/types/pesanan";

export type UserPesananStatusFilter =
  | "all"
  | "belum_dibayar"
  | "dibayar"
  | "selesai"
  | "dibatalkan"
  | "expired";

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(item: Pesanan, query: string) {
  if (!query) return true;

  const haystack = [
    item.kode_booking,
    item.lapangan_nama,
    item.lapangan_jenis,
    item.pembayaran?.kode_transaksi,
    item.catatan,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function matchesStatus(item: Pesanan, status: UserPesananStatusFilter) {
  if (status === "all") return true;
  if (status === "belum_dibayar") return needsPayment(item);
  return item.status === status;
}

export function filterUserPesanans(
  items: Pesanan[],
  {
    search = "",
    status = "all",
  }: {
    search?: string;
    status?: UserPesananStatusFilter;
  }
) {
  const query = normalizeQuery(search);
  return items.filter(
    (item) => matchesSearch(item, query) && matchesStatus(item, status)
  );
}

export const USER_PESANAN_STATUS_OPTIONS: {
  id: UserPesananStatusFilter;
  label: string;
}[] = [
  { id: "all", label: "Semua" },
  { id: "belum_dibayar", label: "Belum Dibayar" },
  { id: "dibayar", label: "Dibayar" },
  { id: "selesai", label: "Selesai" },
  { id: "dibatalkan", label: "Dibatalkan" },
  { id: "expired", label: "Expired" },
];
