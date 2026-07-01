"use client";

import { useState } from "react";
import { Printer, X } from "lucide-react";
import UserTransaksiReceiptContent from "@/components/user/transaksi/UserTransaksiReceiptContent";
import { printTransaksiReceipt } from "@/lib/transaksiReceiptPrint";
import { Transaksi } from "@/types/transaksi";

type Props = {
  open: boolean;
  transaksi: Transaksi | null;
  onClose: () => void;
};

export default function UserTransaksiReceiptModal({
  open,
  transaksi,
  onClose,
}: Props) {
  const [printError, setPrintError] = useState("");

  if (!open || !transaksi) return null;

  const handlePrint = () => {
    setPrintError("");
    const ok = printTransaksiReceipt(transaksi);
    if (!ok) {
      setPrintError("Gagal membuka dialog cetak. Coba lagi.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold">Struk Pembayaran</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {transaksi.kode_transaksi}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <UserTransaksiReceiptContent transaksi={transaksi} />

        {printError && (
          <p className="px-6 pb-2 text-sm text-red-600 dark:text-red-400">
            {printError}
          </p>
        )}

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            <Printer size={16} />
            Cetak Struk
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium dark:border-white/10"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
