"use client";

import Link from "next/link";
import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";

import OwnerDashboardAlerts from "@/components/owner/dashboard/OwnerDashboardAlerts";
import {
  OwnerBookingStatusChart,
  OwnerPaymentMethodChart,
  OwnerRevenueChart,
  OwnerTopLapanganChart,
} from "@/components/owner/dashboard/OwnerDashboardCharts";
import OwnerDashboardStatsSection from "@/components/owner/dashboard/OwnerDashboardStats";
import OwnerQuickActions from "@/components/owner/dashboard/OwnerQuickActions";
import OwnerRecentBookings from "@/components/owner/dashboard/OwnerRecentBookings";
import OwnerSetoranTunaiSection from "@/components/owner/setoran/OwnerSetoranTunaiSection";
import OwnerNavbar from "@/components/OwnerNavbar";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";
import { formatDate, formatRupiah } from "@/lib/auth";

export default function OwnerDashboardPage() {
  const { data, loading, error, reload } = useOwnerDashboard();

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#020617] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <OwnerNavbar active="dashboard" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6">
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat dashboard bisnis Anda...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={reload}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white"
            >
              Coba Lagi
            </button>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-violet-50/30 p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/25 dark:via-gray-900/50 dark:to-violet-950/15">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck size={14} />
                    Dashboard Owner
                  </p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                    Halo, {data.owner.name}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                    Ringkasan bisnis venue — pendapatan bersih, booking, dan
                    performa lapangan. Komisi platform{" "}
                    <strong>{data.komisi_persen}%</strong> per booking sukses.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Diperbarui: {formatDate(data.generatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/owner/pesanan"
                    className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500"
                  >
                    Kelola Pesanan
                  </Link>
                  <Link
                    href="/owner/laporan"
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
                  >
                    Lihat Laporan
                  </Link>
                  <button
                    onClick={reload}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <OwnerDashboardAlerts stats={data.stats} />

            <OwnerSetoranTunaiSection variant="compact" />

            <OwnerDashboardStatsSection
              stats={data.stats}
              komisiPersen={data.komisi_persen}
            />

            {/* Charts row */}
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] xl:col-span-2">
                <div className="mb-4">
                  <h3 className="text-base font-semibold">
                    Tren Pendapatan & Booking
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    6 bulan terakhir — pendapatan bersih (setelah komisi) &
                    jumlah booking sukses
                  </p>
                </div>
                <OwnerRevenueChart data={data.charts.bulanan} />
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mb-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    Pendapatan Hari Ini
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                    {formatRupiah(data.stats.pendapatanHariIni)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Bulan ini: {formatRupiah(data.stats.pendapatanBulanIni)}
                  </p>
                </div>
                <OwnerQuickActions />
              </div>
            </div>

            {/* Second charts row */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <h3 className="text-base font-semibold">Status Pesanan</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Distribusi semua booking
                </p>
                <div className="mt-4">
                  <OwnerBookingStatusChart data={data.charts.bookingStatus} />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <h3 className="text-base font-semibold">Metode Pembayaran</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Pendapatan bersih per metode
                </p>
                <div className="mt-4">
                  <OwnerPaymentMethodChart data={data.charts.perMetode} />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] md:col-span-2 xl:col-span-1">
                <h3 className="text-base font-semibold">Top Lapangan</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Performa pendapatan per venue
                </p>
                <div className="mt-4">
                  <OwnerTopLapanganChart data={data.charts.topLapangan} />
                </div>
              </div>
            </div>

            <OwnerRecentBookings bookings={data.recentBookings} />
          </div>
        ) : null}
      </section>
    </main>
  );
}
