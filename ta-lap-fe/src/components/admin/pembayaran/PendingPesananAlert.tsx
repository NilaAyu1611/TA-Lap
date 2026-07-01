"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Pesanan } from "@/types/pesanan";

type Props = {
  pesanan: Pesanan[];
};

export default function PendingPesananAlert({ pesanan }: Props) {
  if (pesanan.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/25 dark:bg-amber-500/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/15">
            <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />
          </div>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              {pesanan.length} pesanan belum memiliki pembayaran
            </p>
            <p className="mt-0.5 text-sm text-amber-800/90 dark:text-amber-400/90">
              Booking pending perlu dicatat pembayarannya di halaman Pesanan
              sebelum muncul di riwayat transaksi.
            </p>
          </div>
        </div>
        <Link
          href="/owner/pesanan"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500"
        >
          Kelola di Pesanan
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
