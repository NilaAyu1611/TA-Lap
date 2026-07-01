"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PesananStatusBadge from "@/components/admin/pesanan/PesananStatusBadge";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { OwnerDashboardBooking } from "@/types/ownerDashboard";
import { PesananStatus } from "@/types/pesanan";

type Props = {
  bookings: OwnerDashboardBooking[];
};

export default function OwnerRecentBookings({ bookings }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/5">
        <div>
          <h3 className="text-base font-semibold">Booking Terbaru</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Aktivitas pesanan terakhir di lapangan Anda
          </p>
        </div>
        <Link
          href="/owner/pesanan"
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Lihat Semua
          <ChevronRight size={16} />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          Belum ada booking. Bagikan lapangan Anda ke pelanggan.
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {bookings.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cyan-50/40 dark:hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                    {item.kode_booking}
                  </span>
                  <PesananStatusBadge status={item.status as PesananStatus} />
                </div>
                <p className="mt-1 truncate font-medium">
                  {item.lapangan_nama || "Lapangan"}
                  {item.lapangan_jenis ? ` · ${item.lapangan_jenis}` : ""}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {item.user_name || "Customer"} · {formatDate(item.tanggal_booking)}{" "}
                  · {formatTime(item.jam_mulai)}–{formatTime(item.jam_selesai)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start sm:items-end">
                <p className="font-semibold tabular-nums">
                  {formatRupiah(item.total_harga)}
                </p>
                {item.pembayaran_metode && (
                  <p className="text-xs text-gray-500">
                    {formatMetodePembayaran(item.pembayaran_metode)}
                    {item.pembayaran_status
                      ? ` · ${item.pembayaran_status}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
