"use client";

import {
  Building2,
  CalendarCheck,
  CreditCard,
  MapPin,
  Users,
} from "lucide-react";
import { LaporanOperasional } from "@/types/laporan";

type Props = {
  data: LaporanOperasional;
};

export default function LaporanOperasionalSection({ data }: Props) {
  const groups = [
    {
      title: "Pengguna & Mitra",
      icon: Users,
      items: [
        { label: "Total Customer", value: data.totalUsers },
        { label: "Total Owner", value: data.totalOwners },
      ],
    },
    {
      title: "Lapangan",
      icon: MapPin,
      items: [
        { label: "Total Lapangan", value: data.totalLapangan },
        { label: "Lapangan Aktif", value: data.lapanganAktif },
      ],
    },
    {
      title: "Pesanan",
      icon: CalendarCheck,
      items: [
        { label: "Total Pesanan", value: data.totalPesanan },
        { label: "Pending", value: data.pesananPending },
        { label: "Dibayar", value: data.pesananDibayar },
        { label: "Selesai", value: data.pesananSelesai },
        { label: "Dibatalkan", value: data.pesananDibatalkan },
      ],
    },
    {
      title: "Transaksi Pembayaran",
      icon: CreditCard,
      items: [
        { label: "Total Transaksi", value: data.totalTransaksi },
        { label: "Sukses", value: data.transaksiSukses },
        { label: "Menunggu", value: data.transaksiMenunggu },
        { label: "Gagal / Refund", value: data.transaksiGagal },
      ],
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-cyan-600 dark:text-cyan-400" />
          <div>
            <h3 className="text-base font-semibold">Ringkasan Operasional Platform</h3>
            <p className="text-xs text-gray-500">
              Data agregat dari seluruh modul admin — untuk audit & backup
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon size={16} className="text-gray-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {group.title}
                </p>
              </div>
              <dl className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
                      {item.value.toLocaleString("id-ID")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
