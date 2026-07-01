"use client";

import {
  Building2,
  Clock,
  Layers,
  MapPin,
  Sun,
  Users,
} from "lucide-react";
import { Lapangan } from "@/types/lapangan";

type Props = {
  lapangan: Lapangan;
};

export default function UserLapanganFacilities({ lapangan }: Props) {
  const items = [
    {
      icon: Layers,
      label: "Jenis Olahraga",
      value: lapangan.jenis || "—",
    },
    {
      icon: lapangan.indoor ? Building2 : Sun,
      label: "Tipe Venue",
      value: lapangan.indoor ? "Indoor" : "Outdoor",
    },
    {
      icon: Users,
      label: "Kapasitas Maksimal",
      value: lapangan.kapasitas
        ? `${lapangan.kapasitas} orang`
        : "Info belum diisi venue",
      muted: !lapangan.kapasitas,
    },
    {
      icon: MapPin,
      label: "Jumlah Court",
      value: lapangan.jumlah_court
        ? `${lapangan.jumlah_court} court`
        : "Info belum diisi venue",
      muted: !lapangan.jumlah_court,
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value:
        lapangan.jam_buka && lapangan.jam_tutup
          ? `${formatJam(lapangan.jam_buka)} – ${formatJam(lapangan.jam_tutup)}`
          : "Hubungi venue",
    },
    {
      icon: MapPin,
      label: "Kota",
      value: lapangan.kota || "—",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p
                className={`mt-0.5 text-sm font-semibold capitalize ${
                  item.muted
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {item.value}
              </p>
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
