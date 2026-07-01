"use client";

import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { LapanganAvailability, LapanganTimeSlot } from "@/types/lapanganAvailability";

type Props = {
  availability: LapanganAvailability | null;
  loading?: boolean;
  error?: string;
  selectedStart: string;
  selectedEnd: string;
  onSelectSlot: (slot: LapanganTimeSlot) => void;
};

const statusConfig = {
  available: {
    label: "Tersedia",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  booked: {
    label: "Sudah dibooking",
    chip: "cursor-not-allowed border-red-200 bg-red-50 text-red-400 line-through opacity-80 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-500",
  },
  past: {
    label: "Sudah lewat",
    chip: "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500",
    dot: "bg-gray-400",
  },
};

export default function LapanganSchedulePicker({
  availability,
  loading,
  error,
  selectedStart,
  selectedEnd,
  onSelectSlot,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5">
        <Loader2 size={16} className="animate-spin" />
        Memuat jadwal ketersediaan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
        {error}
      </div>
    );
  }

  if (!availability) return null;

  const { slots, booked, jam_buka, jam_tutup, total_available, total_booked } =
    availability;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Jadwal {jam_buka} – {jam_tutup}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            {total_available} slot tersedia · {total_booked} sudah dibooking
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Tersedia
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Terbooking
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500" />
            Dipilih
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => {
          const cfg = statusConfig[slot.status];
          const isSelected =
            slot.status === "available" &&
            selectedStart === slot.jam_mulai &&
            selectedEnd === slot.jam_selesai;

          return (
            <button
              key={`${slot.jam_mulai}-${slot.jam_selesai}`}
              type="button"
              disabled={slot.status !== "available"}
              onClick={() => onSelectSlot(slot)}
              className={`rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                  : cfg.chip
              }`}
              title={cfg.label}
            >
              {slot.jam_mulai}
              <span className="mt-0.5 block text-[10px] font-normal opacity-80">
                {isSelected
                  ? "Dipilih"
                  : slot.status === "booked"
                    ? "Penuh"
                    : slot.status === "past"
                      ? "Lewat"
                      : "Bisa"}
              </span>
            </button>
          );
        })}
      </div>

      {booked.length > 0 ? (
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 dark:border-red-500/20 dark:bg-red-500/5">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
            <XCircle size={14} />
            Jam yang sudah dibooking orang lain
          </p>
          <ul className="space-y-1.5">
            {booked.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-xs dark:bg-white/5"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {item.jam_mulai} – {item.jam_selesai}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700 dark:bg-red-500/15 dark:text-red-400">
                  Terbooking
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          Semua slot di tanggal ini masih tersedia. Pilih jam lalu booking.
        </div>
      )}

      {selectedStart && selectedEnd && (
        <div className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50/80 px-3 py-2 text-xs text-cyan-900 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200">
          <AlertCircle size={14} className="shrink-0" />
          Jam pilihan Anda:{" "}
          <strong>
            {selectedStart} – {selectedEnd}
          </strong>
        </div>
      )}
    </div>
  );
}
