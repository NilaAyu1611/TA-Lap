"use client";

import { Loader2, MapPin, X } from "lucide-react";
import { useState } from "react";
import LapanganMapEmbed from "@/components/lapangan/LapanganMapEmbed";
import LapanganPhotoGallery from "@/components/lapangan/LapanganPhotoGallery";
import { formatRupiah } from "@/lib/auth";
import { Lapangan } from "@/types/lapangan";

type Props = {
  open: boolean;
  lapangan: Lapangan | null;
  bookingLoading?: boolean;
  onClose: () => void;
  onBook: (lapangan: Lapangan) => Promise<void>;
};

export default function UserLapanganDetailModal({
  open,
  lapangan,
  bookingLoading,
  onClose,
  onBook,
}: Props) {
  const [error, setError] = useState("");

  if (!open || !lapangan) return null;

  const handleBook = async () => {
    setError("");
    try {
      await onBook(lapangan);
    } catch {
      setError("Gagal membuat pesanan. Pastikan sudah login.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="relative">
          <LapanganPhotoGallery
            gambar={lapangan.gambar}
            images={lapangan.images}
            alt={lapangan.nama}
            className="rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                {lapangan.jenis || "Olahraga"}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{lapangan.nama}</h2>
              {lapangan.kota && (
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  {lapangan.kota}
                </p>
              )}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                lapangan.status
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {lapangan.status ? "Tersedia" : "Tidak Tersedia"}
            </span>
          </div>

          {lapangan.deskripsi && (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {lapangan.deskripsi}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs text-gray-500">Harga sewa</p>
              <p className="mt-1 text-xl font-bold text-cyan-600 dark:text-cyan-400">
                {formatRupiah(lapangan.harga)} / sesi
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs text-gray-500">Jam operasional</p>
              <p className="mt-1 text-sm font-semibold">
                {lapangan.jam_buka && lapangan.jam_tutup
                  ? `${lapangan.jam_buka} – ${lapangan.jam_tutup}`
                  : "Hubungi venue"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Lokasi & Peta</h3>
            <LapanganMapEmbed
              latitude={lapangan.latitude}
              longitude={lapangan.longitude}
              google_maps_url={lapangan.google_maps_url}
              alamat={lapangan.alamat}
              nama={lapangan.nama}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
              {error}
            </p>
          )}

          <div className="flex gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium dark:border-white/10"
            >
              Tutup
            </button>
            <button
              onClick={handleBook}
              disabled={!lapangan.status || bookingLoading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {bookingLoading && <Loader2 size={16} className="animate-spin" />}
              Booking Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
