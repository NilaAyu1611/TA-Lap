"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/auth";
import { OwnerLaporanBulanan } from "@/types/ownerLaporan";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

type Props = {
  data: OwnerLaporanBulanan[];
};

export default function OwnerLaporanBulananTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-500">Belum ada data bulanan.</p>
    );
  }

  const maxPendapatan = Math.max(...data.map((d) => d.pendapatanOwner), 1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
        <h3 className="text-sm font-semibold">Trend Pendapatan Bulanan</h3>
        <p className="text-xs text-gray-500">Volume & pendapatan bersih per bulan</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs uppercase text-gray-500 dark:border-white/5 dark:bg-white/[0.04]">
              <th className="px-4 py-3">Bulan</th>
              <th className="px-4 py-3">Transaksi</th>
              <th className="px-4 py-3">Volume</th>
              <th className="px-4 py-3">Pendapatan Anda</th>
              <th className="px-4 py-3">Komisi Platform</th>
              <th className="px-4 py-3 w-36">Grafik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {data.map((row) => (
              <tr key={`${row.year}-${row.month}`}>
                <td className="px-4 py-3 font-medium">
                  {monthNames[row.month - 1]} {row.year}
                </td>
                <td className="px-4 py-3">{row.transaksi}</td>
                <td className="px-4 py-3">{formatRupiah(row.volume)}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(row.pendapatanOwner)}
                </td>
                <td className="px-4 py-3 text-violet-600 dark:text-violet-400">
                  {formatRupiah(row.komisiPlatform)}
                </td>
                <td className="px-4 py-3">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.round((row.pendapatanOwner / maxPendapatan) * 100)}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-100 px-4 py-3 dark:border-white/5">
        <Link
          href="/owner/pembayaran"
          className="text-xs font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Lihat detail pembayaran →
        </Link>
      </div>
    </div>
  );
}
