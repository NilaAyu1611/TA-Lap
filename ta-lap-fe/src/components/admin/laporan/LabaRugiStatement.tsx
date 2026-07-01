"use client";

import { formatRupiah } from "@/lib/auth";
import { LabaRugi } from "@/types/laporan";

type Props = {
  labaRugi: LabaRugi;
  komisiPersen: number;
  title?: string;
  subtitle?: string;
};

function AmountCell({
  amount,
  variant = "default",
}: {
  amount: number;
  variant?: "default" | "income" | "expense" | "total" | "muted";
}) {
  const colorClass =
    variant === "income"
      ? "text-emerald-600 dark:text-emerald-400"
      : variant === "expense"
        ? "text-red-600 dark:text-red-400"
        : variant === "total"
          ? "font-bold text-gray-900 dark:text-white"
          : variant === "muted"
            ? "text-amber-600 dark:text-amber-400"
            : "text-gray-900 dark:text-gray-100";

  const weight = variant === "total" ? "font-bold" : "font-medium tabular-nums";

  return (
    <td className={`px-4 py-2.5 text-right ${weight} ${colorClass}`}>
      {formatRupiah(amount)}
    </td>
  );
}

export default function LabaRugiStatement({
  labaRugi,
  komisiPersen,
  title = "Laporan Laba Rugi Platform",
  subtitle,
}: Props) {
  const labaPositive = labaRugi.labaBersih >= 0;
  const defaultSubtitle = `Model bisnis: komisi ${komisiPersen}% per booking sukses. Laba bersih = pendapatan komisi terkumpul − (refund + operasional).`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-white/5">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{subtitle ?? defaultSubtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            <tr className="bg-emerald-50/50 dark:bg-emerald-500/5">
              <td colSpan={2} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Pendapatan
              </td>
            </tr>
            {labaRugi.pendapatan.map((line) => (
              <tr key={line.label}>
                <td className="px-4 py-2.5">
                  <p className={line.isReceivable ? "text-amber-800 dark:text-amber-300" : ""}>
                    {line.label}
                  </p>
                  {line.note && (
                    <p className="mt-0.5 text-[11px] text-gray-500">{line.note}</p>
                  )}
                </td>
                <AmountCell
                  amount={line.amount}
                  variant={line.isReceivable ? "muted" : "income"}
                />
              </tr>
            ))}
            <tr className="bg-gray-50/80 dark:bg-white/[0.04]">
              <td className="px-4 py-2.5 font-semibold">
                Total Pendapatan Realisasi (masuk laba)
              </td>
              <AmountCell amount={labaRugi.totalPendapatanRealisasi} variant="income" />
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-gray-500">
                Total Pendapatan Potensial (+ piutang)
              </td>
              <AmountCell amount={labaRugi.totalPendapatanPotensial} variant="muted" />
            </tr>

            <tr className="bg-red-50/50 dark:bg-red-500/5">
              <td colSpan={2} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                Pengeluaran
              </td>
            </tr>
            {labaRugi.pengeluaran.map((line) => (
              <tr key={line.label}>
                <td className="px-4 py-2.5">{line.label}</td>
                <AmountCell amount={line.amount} variant="expense" />
              </tr>
            ))}
            <tr className="bg-gray-50/80 dark:bg-white/[0.04]">
              <td className="px-4 py-2.5 font-semibold">Total Pengeluaran</td>
              <AmountCell amount={labaRugi.totalPengeluaran} variant="expense" />
            </tr>

            <tr
              className={`${
                labaPositive
                  ? "bg-emerald-100/60 dark:bg-emerald-500/10"
                  : "bg-red-100/60 dark:bg-red-500/10"
              }`}
            >
              <td className="px-4 py-3 text-base font-bold">Laba Bersih Platform</td>
              <td
                className={`px-4 py-3 text-right text-base font-bold tabular-nums ${
                  labaPositive
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {formatRupiah(labaRugi.labaBersih)}
              </td>
            </tr>

            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
              <td colSpan={2} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Posisi Keuangan (di luar laba rugi)
              </td>
            </tr>
            {labaRugi.posisiKeuangan.map((line) => (
              <tr key={line.label}>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                  {line.label}
                </td>
                <AmountCell amount={line.amount} variant="default" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
