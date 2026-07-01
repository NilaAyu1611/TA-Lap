"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight, Clock3, ShieldAlert, Wallet } from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { AdminDashboardStats } from "@/types/adminDashboard";

type AlertItem = {
  icon: typeof Clock3;
  label: string;
  href: string;
};

export default function AdminDashboardAlerts({ stats }: { stats: AdminDashboardStats }) {
  const items: AlertItem[] = [];

  if (stats.pendingOwnerReview > 0) {
    items.push({
      icon: ShieldAlert,
      label: `${stats.pendingOwnerReview} owner verifikasi`,
      href: "/admin/owners?review=pending",
    });
  }

  if (stats.pembayaranMenunggu > 0) {
    items.push({
      icon: Clock3,
      label: `${stats.pembayaranMenunggu} pembayaran menunggu`,
      href: "/admin/transaksi?status=menunggu",
    });
  }

  if (stats.komisiBelumSetor > 0) {
    items.push({
      icon: Wallet,
      label: `Komisi tunai ${formatRupiah(stats.komisiBelumSetorNominal)}`,
      href: "/admin/transaksi?komisi=belum_lunas",
    });
  }

  if (stats.payoutMenunggu > 0) {
    items.push({
      icon: AlertTriangle,
      label: `${stats.payoutMenunggu} belum transfer ke owner`,
      href: "/admin/transaksi?payout=menunggu",
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/5">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-300">
        Perlu tindakan
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/90 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-amber-500/30 dark:bg-white/5 dark:text-amber-100 dark:hover:border-cyan-500/40 dark:hover:text-cyan-300"
            >
              <Icon size={14} className="shrink-0" />
              {item.label}
              <ChevronRight size={14} className="opacity-50" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
