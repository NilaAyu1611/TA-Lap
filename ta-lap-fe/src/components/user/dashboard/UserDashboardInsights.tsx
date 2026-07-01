"use client";

import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  MapPinned,
  TrendingUp,
} from "lucide-react";

import { formatMetodePembayaran } from "@/lib/pembayaran";
import { formatRupiah } from "@/lib/auth";
import {
  UserDashboardBulanan,
  UserDashboardJenisCount,
  UserDashboardMetode,
  UserDashboardStatusCount,
  UserDashboardTopLapangan,
} from "@/types/userDashboard";
import { UserSpendingChart } from "./UserDashboardCharts";

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  dibayar: "Dibayar",
  selesai: "Selesai",
  dibatalkan: "Batal",
  expired: "Expired",
};

type Props = {
  bulanan: UserDashboardBulanan[];
  bookingStatus: UserDashboardStatusCount[];
  perMetode: UserDashboardMetode[];
  topLapangan: UserDashboardTopLapangan[];
  perJenis: UserDashboardJenisCount[];
  totalPengeluaran: number;
  avgPerBooking: number;
};

export default function UserDashboardInsights({
  bulanan,
  bookingStatus,
  perMetode,
  topLapangan,
  perJenis,
  totalPengeluaran,
  avgPerBooking,
}: Props) {
  const hasHistory = bulanan.some((b) => b.booking > 0);
  const topVenue = topLapangan[0];
  const topSport = perJenis[0];
  const topMethod = perMetode[0];
  const activeStatuses = bookingStatus.filter((s) => s.count > 0);

  return (
    <div className="space-y-6">
      {/* Ringkasan cepat — menggantikan 4 chart terpisah */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={MapPinned}
          label="Venue favorit"
          value={topVenue?.nama || "—"}
          sub={
            topVenue
              ? `${topVenue.booking}× booking · ${formatRupiah(topVenue.total)}`
              : "Belum ada riwayat"
          }
          accent="from-violet-500/10 to-violet-600/5 border-violet-200/60 dark:border-violet-500/20"
        />
        <InsightCard
          icon={TrendingUp}
          label="Olahraga andalan"
          value={topSport?.jenis || "—"}
          sub={
            topSport
              ? `${topSport.count} kali dipesan`
              : "Eksplor lapangan baru"
          }
          accent="from-cyan-500/10 to-cyan-600/5 border-cyan-200/60 dark:border-cyan-500/20"
        />
        <InsightCard
          icon={CreditCard}
          label="Cara bayar favorit"
          value={
            topMethod ? formatMetodePembayaran(topMethod.metode) : "—"
          }
          sub={
            topMethod
              ? `${topMethod.count} transaksi sukses`
              : "Belum ada pembayaran"
          }
          accent="from-emerald-500/10 to-emerald-600/5 border-emerald-200/60 dark:border-emerald-500/20"
        />
        <InsightCard
          icon={BarChart3}
          label="Rata-rata per main"
          value={avgPerBooking > 0 ? formatRupiah(avgPerBooking) : "—"}
          sub={`Total ${formatRupiah(totalPengeluaran)} sepanjang waktu`}
          accent="from-amber-500/10 to-amber-600/5 border-amber-200/60 dark:border-amber-500/20"
        />
      </div>

      {/* Status booking — chip, bukan pie chart */}
      {activeStatuses.length > 0 && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Ringkasan booking Anda
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeStatuses.map((s) => (
              <span
                key={s.status}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-white/5"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                {STATUS_LABELS[s.status] || s.status}
                <span className="tabular-nums text-gray-500">{s.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Satu chart tren — cukup untuk insight pengeluaran */}
      {hasHistory && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-base font-semibold">Aktivitas 6 Bulan Terakhir</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Pola main & pengeluaran — bantu rencanakan budget olahraga
              </p>
            </div>
            <Link
              href="/user/pesanan"
              className="text-xs font-medium text-cyan-600 hover:underline dark:text-cyan-400"
            >
              Lihat riwayat lengkap →
            </Link>
          </div>
          <UserSpendingChart data={bulanan} />
        </div>
      )}
    </div>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof MapPinned;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 ${accent} dark:from-white/[0.04] dark:to-transparent`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-1 truncate text-base font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">{sub}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-white/5">
          <Icon size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
      </div>
    </div>
  );
}
