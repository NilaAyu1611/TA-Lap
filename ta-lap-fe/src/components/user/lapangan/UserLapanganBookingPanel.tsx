"use client";

import { CalendarDays, Clock, Loader2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { formatRupiah, getAuthToken } from "@/lib/auth";
import {
  findFirstAvailableSlot,
  isRangeBooked,
} from "@/lib/lapanganAvailability";
import { getLapanganAvailability } from "@/services/lapangan.service";
import { Lapangan } from "@/types/lapangan";
import { LapanganAvailability, LapanganTimeSlot } from "@/types/lapanganAvailability";
import LapanganSchedulePicker from "./LapanganSchedulePicker";

export type BookingFormData = {
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  catatan: string;
};

type Props = {
  lapangan: Lapangan;
  loading?: boolean;
  onSubmit: (data: BookingFormData) => Promise<void>;
};

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function UserLapanganBookingPanel({
  lapangan,
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<BookingFormData>({
    tanggal: tomorrowIso(),
    jam_mulai: "09:00",
    jam_selesai: "10:00",
    catatan: "",
  });
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<LapanganAvailability | null>(
    null
  );
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");

  const loadAvailability = useCallback(async () => {
    if (!form.tanggal) return;
    setScheduleLoading(true);
    setScheduleError("");
    try {
      const result = await getLapanganAvailability(lapangan.id, form.tanggal);
      setAvailability(result.data);

      const first = findFirstAvailableSlot(result.data.slots);
      setForm((prev) => {
        if (first) {
          return {
            ...prev,
            jam_mulai: first.jam_mulai,
            jam_selesai: first.jam_selesai,
          };
        }
        return { ...prev, jam_mulai: "", jam_selesai: "" };
      });
    } catch (err) {
      setScheduleError(getApiErrorMessage(err, "Gagal memuat jadwal"));
      setAvailability(null);
    } finally {
      setScheduleLoading(false);
    }
  }, [lapangan.id, form.tanggal]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const estimasi = useMemo(() => {
    if (!form.jam_mulai || !form.jam_selesai) return 0;
    const [h1, m1] = form.jam_mulai.split(":").map(Number);
    const [h2, m2] = form.jam_selesai.split(":").map(Number);
    const hours = (h2 * 60 + m2 - (h1 * 60 + m1)) / 60;
    if (hours <= 0) return 0;
    return Math.round(Number(lapangan.harga) * hours);
  }, [form.jam_mulai, form.jam_selesai, lapangan.harga]);

  const rangeConflict = useMemo(() => {
    if (!availability || !form.jam_mulai || !form.jam_selesai) return false;
    if (form.jam_mulai >= form.jam_selesai) return true;
    return isRangeBooked(form.jam_mulai, form.jam_selesai, availability.booked);
  }, [availability, form.jam_mulai, form.jam_selesai]);

  const handleSelectSlot = (slot: LapanganTimeSlot) => {
    setForm((prev) => ({
      ...prev,
      jam_mulai: slot.jam_mulai,
      jam_selesai: slot.jam_selesai,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.tanggal || !form.jam_mulai || !form.jam_selesai) {
      setError("Tanggal dan jam wajib diisi");
      return;
    }

    if (form.jam_mulai >= form.jam_selesai) {
      setError("Jam selesai harus lebih besar dari jam mulai");
      return;
    }

    if (rangeConflict) {
      setError(
        "Jam yang dipilih bentrok dengan booking yang sudah ada. Pilih slot hijau (tersedia)."
      );
      return;
    }

    if (estimasi <= 0) {
      setError("Durasi booking tidak valid");
      return;
    }

    if (!getAuthToken()) {
      setError("Anda belum login. Silakan login terlebih dahulu.");
      return;
    }

    try {
      await onSubmit(form);
    } catch (err) {
      const message = getApiErrorMessage(err, "Gagal membuat pesanan");
      if (
        message.toLowerCase().includes("token") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        setError("Sesi login habis. Silakan logout lalu login ulang.");
      } else if (message.toLowerCase().includes("bentrok")) {
        setError(message);
        await loadAvailability();
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-gray-900/80">
      <div className="border-b border-gray-100 pb-4 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Booking Lapangan
        </p>
        <p className="mt-2 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
          {formatRupiah(lapangan.harga)}
          <span className="text-base font-normal text-gray-500"> / sesi</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <CalendarDays size={14} />
            Tanggal Main
          </label>
          <input
            type="date"
            value={form.tanggal}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setForm({ ...form, tanggal: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
            required
          />
        </div>

        <LapanganSchedulePicker
          availability={availability}
          loading={scheduleLoading}
          error={scheduleError}
          selectedStart={form.jam_mulai}
          selectedEnd={form.jam_selesai}
          onSelectSlot={handleSelectSlot}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Clock size={14} />
              Jam Mulai
            </label>
            <input
              type="time"
              value={form.jam_mulai}
              onChange={(e) => {
                setForm({ ...form, jam_mulai: e.target.value });
                setError("");
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Clock size={14} />
              Jam Selesai
            </label>
            <input
              type="time"
              value={form.jam_selesai}
              onChange={(e) => {
                setForm({ ...form, jam_selesai: e.target.value });
                setError("");
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
              required
            />
          </div>
        </div>

        {rangeConflict && !scheduleLoading && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            Jam manual yang dipilih bentrok dengan jadwal terbooking. Ubah jam
            atau klik slot hijau di atas.
          </p>
        )}

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <MessageSquare size={14} />
            Catatan (opsional)
          </label>
          <textarea
            value={form.catatan}
            onChange={(e) => setForm({ ...form, catatan: e.target.value })}
            rows={2}
            placeholder="Butuh bola tambahan, dll."
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
          />
        </div>

        <div className="rounded-xl bg-cyan-50/80 px-4 py-3 dark:bg-cyan-500/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Estimasi total</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatRupiah(estimasi)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Total dihitung dari durasi slot × harga per sesi
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={
            !lapangan.status ||
            loading ||
            scheduleLoading ||
            rangeConflict ||
            availability?.total_available === 0
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {lapangan.status ? "Booking Sekarang" : "Tidak Tersedia"}
        </button>

        <p className="text-center text-[11px] text-gray-500">
          Jadwal realtime — slot merah sudah dibooking user lain.
          Bayar sebelum H-15 menit jam main atau booking otomatis dibatalkan.
        </p>
      </form>
    </div>
  );
}
