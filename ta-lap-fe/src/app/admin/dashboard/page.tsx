"use client";

import Link from "next/link";
import { LayoutDashboard, Loader2, RefreshCw } from "lucide-react";

import AdminDashboardAlerts from "@/components/admin/dashboard/AdminDashboardAlerts";
import {
  AdminBookingStatusChart,
  AdminPaymentMethodChart,
  AdminVolumeChart,
} from "@/components/admin/dashboard/AdminDashboardCharts";
import AdminDashboardStatsSection from "@/components/admin/dashboard/AdminDashboardStats";
import AdminQuickActions from "@/components/admin/dashboard/AdminQuickActions";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { formatDate } from "@/lib/auth";

export default function AdminDashboardPage() {
  const { data, loading, error, reload } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          Memuat dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">{error}</p>
        <button
          type="button"
          onClick={reload}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-r from-cyan-50 via-white to-violet-50/40 p-5 shadow-md shadow-slate-200/50 dark:border-white/10 dark:from-cyan-950/25 dark:via-gray-900/50 dark:to-violet-950/15 dark:shadow-none md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              <LayoutDashboard size={14} />
              Dashboard Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Ringkasan Platform
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Diperbarui {formatDate(data.generatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/laporan"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              Laporan
            </Link>
            <Link
              href="/admin/transaksi"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              Transaksi
            </Link>
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <AdminDashboardAlerts stats={data.stats} />

      <AdminDashboardStatsSection stats={data.stats} />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none xl:col-span-2">
          <h3 className="text-base font-semibold">Tren Transaksi & Komisi</h3>
          <p className="mt-0.5 text-xs text-gray-500">6 bulan terakhir</p>
          <div className="mt-4">
            <AdminVolumeChart data={data.charts.bulanan} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
          <h3 className="mb-3 text-base font-semibold">Aksi Cepat</h3>
          <AdminQuickActions />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
          <h3 className="text-base font-semibold">Status Pesanan</h3>
          <div className="mt-4">
            <AdminBookingStatusChart data={data.charts.bookingStatus} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
          <h3 className="text-base font-semibold">Metode Pembayaran</h3>
          <div className="mt-4">
            <AdminPaymentMethodChart data={data.charts.perMetode} />
          </div>
        </div>
      </div>
    </div>
  );
}
