"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import LapanganMapEmbed from "@/components/lapangan/LapanganMapEmbed";
import { formatRupiah } from "@/lib/auth";
import { formatDistance } from "@/lib/geo";
import { Lapangan } from "@/types/lapangan";

type LapanganWithDistance = Lapangan & { distanceKm?: number | null };

type Props = {
  lapangans: LapanganWithDistance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function LapanganMapBrowse({
  lapangans,
  selectedId,
  onSelect,
}: Props) {
  const withCoords = lapangans.filter(
    (l) => l.latitude != null && l.longitude != null
  );
  const selected =
    withCoords.find((l) => l.id === selectedId) || withCoords[0] || null;

  if (withCoords.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-white/10 dark:bg-white/[0.02]">
        <MapPin size={32} className="mx-auto text-gray-400" />
        <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">
          Belum ada lapangan dengan koordinat peta
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Owner perlu mengisi lokasi venue saat mendaftarkan lapangan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,340px),1fr] lg:items-start">
      <div className="max-h-[480px] space-y-2 overflow-y-auto rounded-2xl border border-gray-200/80 bg-white p-2 dark:border-white/10 dark:bg-white/[0.03]">
        {withCoords.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-xl p-3 text-left transition ${
              selected?.id === item.id
                ? "bg-cyan-50 ring-2 ring-cyan-500/30 dark:bg-cyan-500/10"
                : "hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  {item.nama}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {item.kota || item.alamat}
                </p>
              </div>
              {item.distanceKm != null && (
                <span className="shrink-0 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300">
                  {formatDistance(item.distanceKm)}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              {formatRupiah(item.harga)}/sesi
            </p>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-white/10">
        {selected && (
          <>
            <LapanganMapEmbed
              latitude={selected.latitude}
              longitude={selected.longitude}
              google_maps_url={selected.google_maps_url}
              alamat={selected.alamat}
              nama={selected.nama}
            />
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-4 dark:border-white/5">
              <div className="min-w-0">
                <p className="font-semibold">{selected.nama}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {selected.jenis}
                  {selected.kota ? ` · ${selected.kota}` : ""}
                </p>
              </div>
              <Link
                href={`/user/lapangan/${selected.id}`}
                className="shrink-0 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Lihat & Booking
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
