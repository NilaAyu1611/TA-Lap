"use client";

import { StatusPayoutOwner } from "@/types/transaksi";

const config: Record<
  StatusPayoutOwner,
  { label: string; className: string }
> = {
  menunggu: {
    label: "Belum ditransfer",
    className:
      "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20",
  },
  dicairkan: {
    label: "Sudah ditransfer",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
};

export default function PayoutStatusBadge({
  status,
}: {
  status: StatusPayoutOwner | string;
}) {
  const item = config[status as StatusPayoutOwner] ?? config.menunggu;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}
