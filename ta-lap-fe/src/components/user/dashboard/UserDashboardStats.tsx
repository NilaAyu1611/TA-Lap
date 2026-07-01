"use client";

import Link from "next/link";
import {
  CalendarClock,
  CreditCard,
  Receipt,
} from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { UserDashboardStats } from "@/types/userDashboard";

type Props = {
  stats: UserDashboardStats;
};

function paymentStatCard(stats: UserDashboardStats) {
  if (stats.menungguBayar > 0) {
    return {
      label: "Perlu dibayar",
      display: String(stats.menungguBayar),
      sub: "Segera lunasi agar slot aman",
      warn: true,
    };
  }
  if (stats.pembayaranMenunggu > 0) {
    return {
      label: "Menunggu konfirmasi",
      display: String(stats.pembayaranMenunggu),
      sub: "Pembayaran sedang diproses",
      warn: true,
    };
  }
  if (stats.totalBooking === 0) {
    return {
      label: "Tagihan",
      display: "0",
      sub: "Belum ada pesanan",
      warn: false,
    };
  }
  return {
    label: "Pembayaran",
    display: "Lunas",
    sub: "Semua booking sudah dibayar",
    warn: false,
  };
}

/** Stat ringkas — fokus pada apa yang perlu user lakukan, bukan angka analitik. */
export default function UserDashboardStatsSection({ stats }: Props) {
  const payment = paymentStatCard(stats);

  const items = [
    {
      label: payment.label,
      display: payment.display,
      sub: payment.sub,
      icon: CreditCard,
      href: stats.menungguBayar > 0 ? "/user/pembayaran" : "/user/pesanan",
      warn: payment.warn,
      color: payment.warn
        ? "text-amber-600 dark:text-amber-400"
        : stats.totalBooking === 0
          ? "text-gray-500 dark:text-gray-400"
          : "text-emerald-600 dark:text-emerald-400",
      bg: payment.warn
        ? "bg-amber-50 dark:bg-amber-500/10"
        : stats.totalBooking === 0
          ? "bg-gray-100 dark:bg-white/5"
          : "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Jadwal mendatang",
      value: stats.bookingMendatang,
      display: String(stats.bookingMendatang),
      sub:
        stats.bookingHariIni > 0
          ? `${stats.bookingHariIni} main hari ini`
          : stats.bookingMendatang > 0
            ? "Siapkan diri & datang tepat waktu"
            : "Belum ada jadwal",
      icon: CalendarClock,
      href: "/user/pesanan",
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-500/10",
    },
    {
      label: "Bulan ini",
      value: stats.bookingBulanIni,
      display: formatRupiah(stats.pengeluaranBulanIni),
      sub: `${stats.bookingBulanIni} booking · rata ${stats.totalBooking > 0 ? formatRupiah(stats.avgPerBooking) : "—"}`,
      icon: Receipt,
      href: "/user/pesanan",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 transition hover:border-cyan-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-500/30 ${
              item.warn ? "ring-1 ring-amber-400/30" : ""
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg}`}
            >
              <Icon size={22} className={item.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500">{item.label}</p>
              <p
                className={`mt-0.5 text-xl font-bold tabular-nums ${
                  item.warn
                    ? "text-amber-600 dark:text-amber-400"
                    : item.display === "Lunas"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-900 dark:text-white"
                }`}
              >
                {item.display}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                {item.sub}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
