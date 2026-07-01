"use client";

import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  Landmark,
  MapPin,
  Settings2,
  Wallet,
} from "lucide-react";

const actions = [
  {
    label: "Profil & Bisnis",
    desc: "Data usaha, lokasi, keamanan",
    href: "/owner/profile",
    icon: Settings2,
  },
  {
    label: "Kelola Pesanan",
    desc: "Konfirmasi booking & pembayaran",
    href: "/owner/pesanan",
    icon: CalendarDays,
  },
  {
    label: "Setoran Bulanan",
    desc: "Komisi tunai 5% — setor 1× per bulan",
    href: "/owner/setoran-tunai",
    icon: Landmark,
  },
  {
    label: "Monitoring Pembayaran",
    desc: "Verifikasi & komisi per booking",
    href: "/owner/pembayaran",
    icon: Wallet,
  },
  {
    label: "Kelola Lapangan",
    desc: "Tambah & edit venue",
    href: "/owner/lapangan",
    icon: MapPin,
  },
  {
    label: "Laporan Bisnis",
    desc: "Analitik & arsip keuangan",
    href: "/owner/laporan",
    icon: BarChart3,
  },
];

export default function OwnerQuickActions() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="text-base font-semibold">Aksi Cepat</h3>
      <p className="mt-0.5 text-xs text-gray-500">Navigasi modul utama venue</p>
      <div className="mt-4 space-y-2">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 transition hover:border-cyan-200 hover:bg-cyan-50/50 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-cyan-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
