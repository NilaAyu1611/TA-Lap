"use client";

import { formatRupiah } from "@/lib/auth";
import { LaporanBreakdownItem } from "@/types/laporan";

type Props = {
  title: string;
  items: LaporanBreakdownItem[];
  variant: "income" | "expense" | "liability";
};

const variantStyles = {
  income: "border-emerald-200 dark:border-emerald-500/20",
  expense: "border-red-200 dark:border-red-500/20",
  liability: "border-orange-200 dark:border-orange-500/20",
};

const amountStyles = {
  income: "text-emerald-600 dark:text-emerald-400",
  expense: "text-red-600 dark:text-red-400",
  liability: "text-orange-600 dark:text-orange-400",
};

export default function LaporanBreakdownSection({
  title,
  items,
  variant,
}: Props) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-white/[0.03] ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <span className={`text-sm font-bold ${amountStyles[variant]}`}>
          {formatRupiah(total)}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="font-medium tabular-nums">
              {formatRupiah(item.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
