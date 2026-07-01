"use client";

import { TransaksiStatus } from "@/types/transaksi";

const config: Record<
  TransaksiStatus,
  { label: string; className: string }
> = {
  menunggu: {
    label: "Menunggu",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },
  sukses: {
    label: "Sukses",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
  gagal: {
    label: "Gagal",
    className:
      "bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  },
  refund: {
    label: "Refund",
    className:
      "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/10 dark:text-gray-400 dark:ring-white/10",
  },
};

export default function TransaksiStatusBadge({
  status,
}: {
  status: TransaksiStatus | string;
}) {
  const item = config[status as TransaksiStatus] ?? config.menunggu;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}
