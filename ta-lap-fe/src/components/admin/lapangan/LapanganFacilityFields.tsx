"use client";

import {
  Building2,
  Clock,
  Layers,
  Sun,
  Users,
} from "lucide-react";

type FacilityValues = {
  jenis?: string | null;
  indoor?: boolean;
  kapasitas?: number | null;
  jumlah_court?: number | null;
  jam_buka?: string | null;
  jam_tutup?: string | null;
  kota?: string | null;
};

type Props = {
  values: FacilityValues;
  columns?: 2 | 3;
  /** Tampilkan peringatan jika kapasitas/court belum diisi (untuk owner/admin). */
  highlightEmpty?: boolean;
};

function formatFacilityValue(
  raw: string,
  isEmpty: boolean,
  highlightEmpty?: boolean
) {
  if (isEmpty && highlightEmpty) {
    return {
      text: "Belum diisi",
      className: "text-amber-600 dark:text-amber-400",
    };
  }
  return {
    text: raw,
    className: "text-gray-900 dark:text-white",
  };
}

export default function LapanganFacilityFields({
  values,
  columns = 2,
  highlightEmpty = false,
}: Props) {
  const gridClass =
    columns === 3
      ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-3 sm:grid-cols-2";

  const items = [
    {
      icon: Layers,
      label: "Jenis Olahraga",
      value: values.jenis || "—",
    },
    {
      icon: values.indoor ? Building2 : Sun,
      label: "Tipe Venue",
      value: values.indoor ? "Indoor" : "Outdoor",
    },
    {
      icon: Users,
      label: "Kapasitas Maksimal",
      value: values.kapasitas ? `${values.kapasitas} orang` : "—",
      empty: !values.kapasitas,
      hint: "Jumlah pemain maksimal per sesi booking",
    },
    {
      icon: Layers,
      label: "Jumlah Court",
      value: values.jumlah_court ? `${values.jumlah_court} court` : "—",
      empty: !values.jumlah_court,
      hint: "Berapa lapangan/court tersedia di venue ini",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value:
        values.jam_buka && values.jam_tutup
          ? `${formatJam(values.jam_buka)} – ${formatJam(values.jam_tutup)}`
          : "—",
    },
    {
      icon: Building2,
      label: "Kota",
      value: values.kota || "—",
    },
  ];

  return (
    <div className={gridClass}>
      {items.map((item) => {
        const Icon = item.icon;
        const display = formatFacilityValue(
          item.value,
          Boolean(item.empty),
          highlightEmpty
        );
        return (
          <div
            key={item.label}
            className={`flex items-start gap-3 rounded-xl border p-3 ${
              item.empty && highlightEmpty
                ? "border-amber-200 bg-amber-50/80 dark:border-amber-500/25 dark:bg-amber-500/5"
                : "border-gray-100 bg-gray-50/80 dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p
                className={`mt-0.5 text-sm font-semibold capitalize ${display.className}`}
              >
                {display.text}
              </p>
              {"hint" in item && item.hint && (
                <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                  {item.hint}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatJam(value: string) {
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  try {
    return new Date(value).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export type FacilityFormValue = {
  kapasitas: string;
  jumlah_court: string;
  indoor: boolean;
};

export const defaultFacilityForm: FacilityFormValue = {
  kapasitas: "",
  jumlah_court: "",
  indoor: false,
};

export function FacilityFormSection({
  value,
  onChange,
}: {
  value: FacilityFormValue;
  onChange: (value: FacilityFormValue) => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          Detail Venue
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Kapasitas & jumlah court ditampilkan ke user di halaman detail lapangan
          — isi agar pemain tahu batas maksimal sebelum booking.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Kapasitas Maksimal (orang)
          </label>
          <input
            type="number"
            min={1}
            value={value.kapasitas}
            onChange={(e) => onChange({ ...value, kapasitas: e.target.value })}
            placeholder="Contoh: 14 pemain futsal"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
          />
          <p className="mt-1 text-[10px] text-gray-500">
            Ditampilkan ke user sebagai info &quot;±14 orang&quot;
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Jumlah Court
          </label>
          <input
            type="number"
            min={1}
            value={value.jumlah_court}
            onChange={(e) =>
              onChange({ ...value, jumlah_court: e.target.value })
            }
            placeholder="Contoh: 2"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
          Tipe Lapangan
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...value, indoor: false })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
              !value.indoor
                ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                : "border-gray-200 text-gray-600 dark:border-white/10"
            }`}
          >
            <Sun size={16} />
            Outdoor
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, indoor: true })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
              value.indoor
                ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                : "border-gray-200 text-gray-600 dark:border-white/10"
            }`}
          >
            <Building2 size={16} />
            Indoor
          </button>
        </div>
      </div>
    </div>
  );
}

export function facilityToPayload(facility: FacilityFormValue) {
  return {
    kapasitas: facility.kapasitas ? Number(facility.kapasitas) : undefined,
    jumlah_court: facility.jumlah_court
      ? Number(facility.jumlah_court)
      : undefined,
    indoor: facility.indoor,
  };
}

export function facilityFromLapangan(data: {
  kapasitas?: number | null;
  jumlah_court?: number | null;
  indoor?: boolean;
}): FacilityFormValue {
  return {
    kapasitas: data.kapasitas ? String(data.kapasitas) : "",
    jumlah_court: data.jumlah_court ? String(data.jumlah_court) : "",
    indoor: Boolean(data.indoor),
  };
}
