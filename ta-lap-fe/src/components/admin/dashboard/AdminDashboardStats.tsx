"use client";

import {
  CalendarDays,
  Store,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { AdminDashboardStats } from "@/types/adminDashboard";

function GrowthBadge({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-xs text-gray-500">Stabil vs bulan lalu</span>;
  }
  const positive = value > 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        positive ? "text-emerald-600" : "text-red-500"
      }`}
    >
      <Icon size={14} />
      {positive ? "+" : ""}
      {value}% vs bulan lalu
    </span>
  );
}

export default function AdminDashboardStatsSection({
  stats,
}: {
  stats: AdminDashboardStats;
}) {
  const cards = [
    {
      label: "Booking",
      value: String(stats.totalBooking),
      sub: (
        <>
          <GrowthBadge value={stats.bookingGrowth} />
          <span className="text-gray-400"> · </span>
          {stats.bookingHariIni} jadwal hari ini
        </>
      ),
      icon: CalendarDays,
      accent: "border-l-emerald-500",
    },
    {
      label: "Bulan Ini",
      value: formatRupiah(stats.volumeBulanIni),
      sub: `Komisi ${formatRupiah(stats.komisiBulanIni)} · ${stats.bookingBulanIni} booking`,
      icon: Wallet,
      accent: "border-l-cyan-500",
    },
    {
      label: "Pemain & Owner",
      value: `${stats.totalUsers} / ${stats.totalOwners}`,
      sub: "Pemain aktif · owner terdaftar",
      icon: Users,
      accent: "border-l-violet-500",
    },
    {
      label: "Lapangan Aktif",
      value: `${stats.lapanganAktif}/${stats.totalLapangan}`,
      sub: "Venue siap menerima booking",
      icon: Store,
      accent: "border-l-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl border border-slate-200/90 border-l-4 bg-white p-5 shadow-sm shadow-slate-200/40 ${card.accent} dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{card.label}</p>
                <p className="mt-2 truncate text-xl font-bold tabular-nums">{card.value}</p>
                <div className="mt-1.5 text-xs text-gray-500">{card.sub}</div>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
                <Icon size={18} className="text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
