import { Pesanan } from "@/types/pesanan";

/** Pesanan dibatalkan tetap tampil sebentar lalu hilang dari daftar user. */
export const CANCELLED_HIDE_DELAY_MS = 10_000;

export function shouldShowUserPesanan(
  pesanan: Pick<Pesanan, "status" | "updated_at">,
  now = Date.now()
): boolean {
  if (pesanan.status !== "dibatalkan") return true;

  if (!pesanan.updated_at) return false;

  const cancelledAt = new Date(pesanan.updated_at).getTime();
  if (Number.isNaN(cancelledAt)) return false;

  return now - cancelledAt < CANCELLED_HIDE_DELAY_MS;
}

export function getCancelledHideSecondsLeft(
  pesanan: Pick<Pesanan, "status" | "updated_at">,
  now = Date.now()
): number | null {
  if (pesanan.status !== "dibatalkan" || !pesanan.updated_at) return null;

  const cancelledAt = new Date(pesanan.updated_at).getTime();
  if (Number.isNaN(cancelledAt)) return null;

  const leftMs = CANCELLED_HIDE_DELAY_MS - (now - cancelledAt);
  if (leftMs <= 0) return 0;

  return Math.ceil(leftMs / 1000);
}

export function filterVisibleUserPesanans(
  pesanans: Pesanan[],
  now = Date.now()
): Pesanan[] {
  return pesanans.filter((item) => shouldShowUserPesanan(item, now));
}
