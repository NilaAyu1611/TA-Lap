"use client";

import Link from "next/link";
import { AlertTriangle, Clock3 } from "lucide-react";

import { getPaymentPageHref } from "@/lib/pesananPayment";
import {
  formatPaymentCountdown,
  getMsUntilPaymentDeadline,
  isUnpaidInCriticalWindow,
  isUnpaidNearDeadline,
  PAYMENT_DEADLINE_MINUTES_BEFORE,
} from "@/lib/paymentDeadline";
import { PesananPaymentInfo } from "@/types/pesananPayment";

type PaymentDeadlineBannerProps = {
  pesanan: PesananPaymentInfo & {
    id: string;
    jam_mulai: string;
    lapangan_nama?: string | null;
  };
  now?: number;
  compact?: boolean;
};

export default function PaymentDeadlineBanner({
  pesanan,
  now = Date.now(),
  compact = false,
}: PaymentDeadlineBannerProps) {
  if (!isUnpaidNearDeadline(pesanan, now)) return null;

  const msLeft = getMsUntilPaymentDeadline(pesanan.jam_mulai, now);
  const critical = isUnpaidInCriticalWindow(pesanan, now);
  const countdown = formatPaymentCountdown(msLeft);

  if (compact) {
    return (
      <p
        className={`mt-2 text-xs font-medium ${
          critical
            ? "text-red-600 dark:text-red-400"
            : "text-amber-700 dark:text-amber-300"
        }`}
      >
        {critical ? "⚠️ " : "⏰ "}
        Batas bayar {countdown} — otomatis batal jika belum dibayar
      </p>
    );
  }

  return (
    <div
      className={`mt-4 rounded-xl border p-4 ${
        critical
          ? "border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
          : "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
      }`}
    >
      <div className="flex items-start gap-3">
        {critical ? (
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
          />
        ) : (
          <Clock3
            size={20}
            className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
          />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold ${
              critical
                ? "text-red-800 dark:text-red-200"
                : "text-amber-900 dark:text-amber-100"
            }`}
          >
            {critical
              ? `${PAYMENT_DEADLINE_MINUTES_BEFORE} menit lagi — booking akan dibatalkan!`
              : "1 jam lagi main — belum dibayar"}
          </p>
          <p
            className={`mt-1 text-sm ${
              critical
                ? "text-red-700/90 dark:text-red-300/90"
                : "text-amber-800/80 dark:text-amber-300/90"
            }`}
          >
            {pesanan.lapangan_nama ? `${pesanan.lapangan_nama}: ` : ""}
            Bayar sebelum{" "}
            <strong>{countdown}</strong> atau slot otomatis kosong dan bisa
            dipesan user lain.
          </p>
          <Link
            href={getPaymentPageHref(pesanan.id)}
            className={`mt-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              critical
                ? "bg-red-600 hover:bg-red-500"
                : "bg-amber-600 hover:bg-amber-500"
            }`}
          >
            Bayar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
