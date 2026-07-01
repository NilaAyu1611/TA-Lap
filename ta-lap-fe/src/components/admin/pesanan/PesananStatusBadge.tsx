"use client";

import { PesananStatus } from "@/types/pesanan";

const config: Record<
  PesananStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },
  dibayar: {
    label: "Dibayar",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
  selesai: {
    label: "Selesai",
    className:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  },
  dibatalkan: {
    label: "Dibatalkan",
    className:
      "bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  },
  expired: {
    label: "Expired",
    className:
      "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/10 dark:text-gray-400 dark:ring-white/10",
  },
};

export default function PesananStatusBadge({
  status,
  size = "md",
}: {
  status: PesananStatus | string;
  size?: "sm" | "md";
}) {
  const item = config[status as PesananStatus] ?? config.pending;
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ring-1 ${item.className} ${
        isSmall ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      {item.label}
    </span>
  );
}
