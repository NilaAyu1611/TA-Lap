import { PesananPaymentInfo } from "@/types/pesananPayment";
import { needsPayment } from "@/lib/pesananPayment";

/** Batas bayar: 15 menit sebelum jam mulai booking (selaras backend). */
export const PAYMENT_DEADLINE_MINUTES_BEFORE = 15;

export function getPaymentDeadlineMs(jamMulai: string): number {
  return (
    new Date(jamMulai).getTime() -
    PAYMENT_DEADLINE_MINUTES_BEFORE * 60 * 1000
  );
}

export function getMsUntilPaymentDeadline(
  jamMulai: string,
  now = Date.now()
): number {
  return getPaymentDeadlineMs(jamMulai) - now;
}

export function formatPaymentCountdown(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

export function isUnpaidNearDeadline(
  pesanan: Pick<PesananPaymentInfo, "status" | "jam_mulai" | "pembayaran">,
  now = Date.now()
): boolean {
  if (!needsPayment(pesanan) || !pesanan.jam_mulai) return false;
  const msUntilStart = new Date(pesanan.jam_mulai).getTime() - now;
  return msUntilStart > 0 && msUntilStart <= 60 * 60 * 1000;
}

export function isUnpaidInCriticalWindow(
  pesanan: Pick<PesananPaymentInfo, "status" | "jam_mulai" | "pembayaran">,
  now = Date.now()
): boolean {
  if (!needsPayment(pesanan) || !pesanan.jam_mulai) return false;
  const msUntilDeadline = getMsUntilPaymentDeadline(pesanan.jam_mulai, now);
  return msUntilDeadline > 0 && msUntilDeadline <= 15 * 60 * 1000;
}

export function getPaymentDeadlineLabel(jamMulai: string): string {
  const deadline = new Date(getPaymentDeadlineMs(jamMulai));
  return deadline.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
