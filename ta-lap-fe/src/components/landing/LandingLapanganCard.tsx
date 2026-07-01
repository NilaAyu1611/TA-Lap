"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { getLapanganCover } from "@/lib/lapanganMedia";
import { Lapangan } from "@/types/lapangan";

type Props = {
  lapangan: Lapangan;
  onBook: () => void;
};

export default function LandingLapanganCard({ lapangan, onBook }: Props) {
  const cover = getLapanganCover(lapangan);

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="relative h-48 overflow-hidden sm:h-52">
        <img
          src={cover}
          alt={lapangan.nama}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {lapangan.jenis && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold capitalize text-gray-800">
            {lapangan.jenis}
          </span>
        )}
        {(lapangan.kota || lapangan.alamat) && (
          <span className="absolute bottom-3 left-3 inline-flex max-w-[85%] items-center gap-1 truncate rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
            <MapPin size={11} className="shrink-0" />
            {lapangan.kota || lapangan.alamat}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="truncate text-base font-bold sm:text-lg">{lapangan.nama}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {lapangan.deskripsi || lapangan.alamat || "Venue olahraga tersedia untuk booking online."}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Mulai dari
            </p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {formatRupiah(lapangan.harga)}
              <span className="text-sm font-normal text-gray-500"> /sesi</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            <CalendarDays size={15} />
            Booking
          </button>
        </div>
      </div>
    </article>
  );
}
