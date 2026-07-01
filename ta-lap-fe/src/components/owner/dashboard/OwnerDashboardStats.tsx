"use client";

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { OwnerDashboardStats as Stats } from "@/types/ownerDashboard";

type Props = {
  stats: Stats;
  komisiPersen: number;
};

function GrowthBadge({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-xs text-gray-500">Stabil bulan ini</span>;
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

export default function OwnerDashboardStatsSection({
  stats,
  komisiPersen,
}: Props) {
  const cards = [
    {
      label: "Pendapatan Bersih",
      value: formatRupiah(stats.pendapatanBersih),
      sub: <GrowthBadge value={stats.pendapatanGrowth} />,
      icon: Wallet,
      accent: "border-l-emerald-500",
      highlight: true,
    },
    {
      label: "Total Booking",
      value: String(stats.totalBooking),
      sub: <GrowthBadge value={stats.bookingGrowth} />,
      icon: CalendarDays,
      accent: "border-l-cyan-500",
    },
    {
      label: "Pelanggan Unik",
      value: String(stats.totalPelanggan),
      sub: `${stats.bookingBulanIni} booking bulan ini`,
      icon: Users,
      accent: "border-l-violet-500",
    },
    {
      label: "Lapangan Aktif",
      value: `${stats.lapanganAktif}/${stats.totalLapangan}`,
      sub: `${stats.bookingHariIni} jadwal hari ini`,
      icon: Building2,
      accent: "border-l-orange-500",
    },
    {
      label: "Hari Ini",
      value: formatRupiah(stats.pendapatanHariIni),
      sub: "Pendapatan bersih sukses",
      icon: Wallet,
      accent: "border-l-sky-500",
      isText: true,
    },
    {
      label: "Perlu Tindakan",
      value: String(stats.menungguVerifikasi + stats.komisiBelumSetor),
      sub:
        stats.menungguVerifikasi > 0
          ? `${stats.menungguVerifikasi} verifikasi · komisi ${komisiPersen}% per booking`
          : stats.komisiBelumSetor > 0
            ? `${stats.komisiBelumSetor} tunai belum setor`
            : "Semua beres",
      icon: AlertTriangle,
      accent: "border-l-amber-500",
      warn: stats.menungguVerifikasi + stats.komisiBelumSetor > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-200/80 border-l-4 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] ${card.accent} ${
              card.highlight ? "ring-1 ring-emerald-500/15" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {card.label}
                </p>
                <p
                  className={`mt-1 font-semibold text-gray-900 dark:text-white ${
                    card.isText ? "text-base" : "text-2xl tabular-nums"
                  } ${card.warn ? "text-amber-600 dark:text-amber-400" : ""}`}
                >
                  {card.value}
                </p>
                <div className="mt-1 text-[11px] text-gray-500">{card.sub}</div>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                <Icon size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
