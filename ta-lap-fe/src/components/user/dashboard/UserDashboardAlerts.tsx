"use client";

import Link from "next/link";
import { AlertCircle, CalendarClock, CreditCard, Wrench } from "lucide-react";
import { UserDashboardStats } from "@/types/userDashboard";

type Props = {
  stats: UserDashboardStats;
  maintenanceMode?: boolean;
};

export default function UserDashboardAlerts({
  stats,
  maintenanceMode,
}: Props) {
  const alerts: {
    type: "warning" | "info" | "danger";
    title: string;
    message: string;
    href?: string;
    label?: string;
  }[] = [];

  if (maintenanceMode) {
    alerts.push({
      type: "danger",
      title: "Platform Maintenance",
      message:
        "Booking sementara tidak tersedia. Coba lagi nanti atau hubungi admin.",
    });
  }

  if (stats.menungguBayar > 0) {
    alerts.push({
      type: "warning",
      title: `${stats.menungguBayar} booking belum lunas`,
      message:
        "Bayar sebelum batas waktu agar slot tidak dibatalkan otomatis dan venue tetap reserved untuk Anda.",
      href: "/user/pembayaran",
      label: "Bayar Sekarang",
    });
  }

  if (stats.bookingHariIni > 0) {
    alerts.push({
      type: "info",
      title: `Hari ini ada ${stats.bookingHariIni} jadwal main`,
      message:
        "Cek lokasi venue, bawa perlengkapan, dan datang 10–15 menit lebih awal.",
      href: "/user/pesanan",
      label: "Lihat Detail",
    });
  }

  if (stats.pembayaranMenunggu > 0) {
    alerts.push({
      type: "info",
      title: `${stats.pembayaranMenunggu} pembayaran menunggu konfirmasi`,
      message:
        "Pembayaran tunai/online sudah dicatat — menunggu konfirmasi owner atau proses gateway. Cek di halaman Pesanan.",
      href: "/user/pesanan",
      label: "Cek Status",
    });
  }

  if (alerts.length === 0) return null;

  const styles = {
    warning:
      "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
    info: "border-cyan-200 bg-cyan-50 dark:border-cyan-500/20 dark:bg-cyan-500/10",
    danger:
      "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
  };

  const icons = {
    warning: AlertCircle,
    info: CalendarClock,
    danger: Wrench,
  };

  const iconColors = {
    warning: "text-amber-600",
    info: "text-cyan-600",
    danger: "text-red-600",
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = icons[alert.type];
        return (
          <div
            key={alert.title}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${styles[alert.type]}`}
          >
            <div className="flex items-start gap-3">
              <Icon
                size={20}
                className={`mt-0.5 shrink-0 ${iconColors[alert.type]}`}
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {alert.title}
                </p>
                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                  {alert.message}
                </p>
              </div>
            </div>
            {alert.href && (
              <Link
                href={alert.href}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/15"
              >
                {alert.type === "warning" ? (
                  <CreditCard size={14} />
                ) : null}
                {alert.label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
