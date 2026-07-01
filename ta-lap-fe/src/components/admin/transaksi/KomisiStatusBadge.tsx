"use client";

import { StatusKomisi } from "@/types/transaksi";

const config: Record<
  StatusKomisi,
  { label: string; className: string }
> = {
  terpotong: {
    label: "Terpotong",
    className:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20",
  },
  belum_lunas: {
    label: "Belum Lunas",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },
  lunas: {
    label: "Lunas",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
};

export default function KomisiStatusBadge({
  status,
}: {
  status: StatusKomisi | string;
}) {
  const item = config[status as StatusKomisi] ?? config.terpotong;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}
