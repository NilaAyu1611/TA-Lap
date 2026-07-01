"use client";

import Link from "next/link";
import { Images, MapPin } from "lucide-react";
import { getLapanganCover, getLapanganGallery } from "@/lib/lapanganMedia";
import { formatDistance } from "@/lib/geo";
import { formatRupiah } from "@/lib/auth";
import { Lapangan } from "@/types/lapangan";
import VenueOperatorLine from "@/components/shared/VenueOperatorLine";

type Props = {
  lapangan: Lapangan;
  distanceKm?: number | null;
};

export default function UserLapanganCard({ lapangan, distanceKm }: Props) {
  const cover = getLapanganCover(lapangan);
  const photoCount = getLapanganGallery(lapangan).length;

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
      <Link href={`/user/lapangan/${lapangan.id}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={cover}
            alt={lapangan.nama}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {lapangan.jenis && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-gray-800">
              {lapangan.jenis}
            </span>
          )}
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
            <Images size={12} />
            {photoCount} foto
          </span>
          {(lapangan.kota || lapangan.alamat) && (
            <span className="absolute bottom-4 left-4 inline-flex max-w-[85%] items-center gap-1 truncate rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
              <MapPin size={12} className="shrink-0" />
              {distanceKm != null
                ? `${formatDistance(distanceKm)} · ${lapangan.kota || lapangan.alamat}`
                : lapangan.kota || lapangan.alamat}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/user/lapangan/${lapangan.id}`}>
              <h3 className="truncate text-lg font-semibold transition hover:text-cyan-600 dark:hover:text-cyan-400">
                {lapangan.nama}
              </h3>
            </Link>
            <div className="mt-1">
              <VenueOperatorLine
                businessName={lapangan.owner_business_name}
                ownerName={lapangan.owner_name}
                compact
              />
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {lapangan.deskripsi ||
                lapangan.alamat ||
                "Lihat detail foto & peta venue"}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              lapangan.status
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-100 text-red-600"
            }`}
          >
            {lapangan.status ? "Tersedia" : "Penuh"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-white/10">
            {lapangan.indoor ? "Indoor" : "Outdoor"}
          </span>
          {lapangan.jumlah_court && (
            <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-white/10">
              {lapangan.jumlah_court} court
            </span>
          )}
          {lapangan.kapasitas && (
            <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-white/10">
              ±{lapangan.kapasitas} orang
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              Mulai dari
            </p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {formatRupiah(lapangan.harga)}
              <span className="text-sm font-normal text-gray-500"> / sesi</span>
            </p>
          </div>
          <Link
            href={`/user/lapangan/${lapangan.id}`}
            className="rounded-2xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
