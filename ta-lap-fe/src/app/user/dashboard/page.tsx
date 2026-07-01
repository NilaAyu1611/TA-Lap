"use client";

import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";

import UserNavbar from "@/components/UserNavbar";
import UserDashboardAlerts from "@/components/user/dashboard/UserDashboardAlerts";
import UserDashboardBookingsList from "@/components/user/dashboard/UserDashboardBookingsList";
import UserDashboardHero from "@/components/user/dashboard/UserDashboardHero";
import UserDashboardInsights from "@/components/user/dashboard/UserDashboardInsights";
import UserDashboardStatsSection from "@/components/user/dashboard/UserDashboardStats";
import { useUserDashboard } from "@/hooks/useUserDashboard";

export default function UserDashboard() {
  const { data, loading, error, reload } = useUserDashboard();

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#0b1120] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <UserNavbar active="dashboard" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat dashboard Anda...</span>
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
          <div className="space-y-8">
            <UserDashboardHero
              userName={data.user.name}
              city={data.user.city}
              stats={data.stats}
              nextBooking={data.upcomingBookings[0] ?? null}
            />

            <UserDashboardAlerts
              stats={data.stats}
              maintenanceMode={data.maintenance_mode}
            />

            <UserDashboardStatsSection stats={data.stats} />

            {/* Jadwal — prioritas utama pelanggan */}
            <UserDashboardBookingsList
              title="Jadwal Main Mendatang"
              subtitle="Booking aktif — pastikan sudah dibayar & datang tepat waktu"
              bookings={data.upcomingBookings}
              viewAllHref="/user/pesanan"
              showCover
              emptyMessage="Belum ada jadwal. Yuk cari lapangan dan booking slot favorit Anda!"
            />

            <UserDashboardInsights
              bulanan={data.charts.bulanan}
              bookingStatus={data.charts.bookingStatus}
              perMetode={data.charts.perMetode}
              topLapangan={data.charts.topLapangan}
              perJenis={data.charts.perJenis}
              totalPengeluaran={data.stats.totalPengeluaran}
              avgPerBooking={data.stats.avgPerBooking}
            />

            {data.recentBookings.length > 0 && (
              <UserDashboardBookingsList
                title="Aktivitas Terbaru"
                subtitle="Riwayat pesanan terakhir"
                bookings={data.recentBookings.slice(0, 4)}
                viewAllHref="/user/pesanan"
                emptyMessage=""
              />
            )}

            <div className="flex justify-center pt-2">
              <button
                onClick={reload}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
              >
                <RefreshCw size={14} />
                Perbarui data
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
