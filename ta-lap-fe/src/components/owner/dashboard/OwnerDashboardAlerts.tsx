"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight, Clock3, Wallet } from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { OwnerDashboardStats } from "@/types/ownerDashboard";

type Props = {
  stats: OwnerDashboardStats;
};

export default function OwnerDashboardAlerts({ stats }: Props) {
  const items = [];

  if (stats.menungguVerifikasi > 0) {
    items.push({
      icon: Clock3,
      title: `${stats.menungguVerifikasi} pembayaran menunggu verifikasi`,
      desc: "Konfirmasi di halaman Pembayaran agar komisi & pendapatan tercatat.",
      href: "/owner/pembayaran",
      color: "amber",
    });
  }

  if (stats.komisiBelumSetor > 0) {
    items.push({
      icon: Wallet,
      title: `Komisi tunai belum setor: ${formatRupiah(stats.komisiBelumSetorNominal)}`,
      desc: `${stats.komisiBelumSetor} transaksi tunai — setor total per bulan di halaman Setoran Bulanan.`,
      href: "/owner/setoran-tunai",
      color: "orange",
    });
  }

  if (stats.payoutMenunggu > 0) {
    items.push({
      icon: AlertTriangle,
      title: `${stats.payoutMenunggu} payout menunggu pencairan`,
      desc: "Admin platform akan transfer pendapatan bersih ke rekening Anda.",
      href: "/owner/laporan",
      color: "sky",
    });
  }

  if (items.length === 0) return null;

  const colorMap = {
    amber:
      "border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200",
    orange:
      "border-orange-200 bg-orange-50/80 text-orange-900 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-200",
    sky: "border-sky-200 bg-sky-50/80 text-sky-900 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200",
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href={item.href}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition hover:shadow-sm ${colorMap[item.color as keyof typeof colorMap]}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-0.5 text-xs opacity-80">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="mt-1 shrink-0 opacity-60" />
          </Link>
        );
      })}
    </div>
  );
}
