"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import PesananStatusBadge from "@/components/admin/pesanan/PesananStatusBadge";
import { getLapanganCover } from "@/lib/lapanganMedia";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { getPaymentPageHref, needsPayment } from "@/lib/pesananPayment";
import { UserDashboardBooking } from "@/types/userDashboard";
import { PesananStatus } from "@/types/pesanan";

type Props = {
  title: string;
  subtitle: string;
  bookings: UserDashboardBooking[];
  viewAllHref: string;
  showCover?: boolean;
  emptyMessage: string;
};

export default function UserDashboardBookingsList({
  title,
  subtitle,
  bookings,
  viewAllHref,
  showCover = false,
  emptyMessage,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/5">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Lihat Semua
          <ChevronRight size={16} />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {bookings.map((item) => (
            <BookingRow key={item.id} item={item} showCover={showCover} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingRow({
  item,
  showCover,
}: {
  item: UserDashboardBooking;
  showCover?: boolean;
}) {
  const cover = getLapanganCover({
    gambar: item.lapangan_gambar,
    images: [],
  });

  const detailHref = item.lapangan_id
    ? `/user/lapangan/${item.lapangan_id}`
    : "/user/pesanan";

  return (
    <div className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cyan-50/40 dark:hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {showCover && (
          <Link href={detailHref} className="shrink-0">
            <img
              src={cover}
              alt=""
              className="h-14 w-20 rounded-xl object-cover"
            />
          </Link>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              {item.kode_booking}
            </span>
            <PesananStatusBadge status={item.status as PesananStatus} />
          </div>
          <Link href={detailHref} className="mt-1 block truncate font-medium hover:text-cyan-600">
            {item.lapangan_nama || "Lapangan"}
            {item.lapangan_jenis ? ` · ${item.lapangan_jenis}` : ""}
          </Link>
          <p className="mt-0.5 text-sm text-gray-500">
            {formatDate(item.tanggal_booking)} · {formatTime(item.jam_mulai)}–
            {formatTime(item.jam_selesai)}
          </p>
          {item.lapangan_kota && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} />
              {item.lapangan_kota}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start sm:items-end">
        <p className="font-semibold tabular-nums">
          {formatRupiah(item.total_harga)}
        </p>
        {item.pembayaran_metode ? (
          <p className="text-xs text-gray-500">
            {formatMetodePembayaran(item.pembayaran_metode)}
            {item.pembayaran_status ? ` · ${item.pembayaran_status}` : ""}
          </p>
        ) : needsPayment({
            status: item.status,
            pembayaran: item.pembayaran_status
              ? { status: item.pembayaran_status, metode: item.pembayaran_metode || undefined }
              : null,
          }) ? (
          <Link
            href={getPaymentPageHref(item.id)}
            className="mt-1 inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-500"
          >
            Bayar Sekarang
          </Link>
        ) : null}
      </div>
    </div>
  );
}
