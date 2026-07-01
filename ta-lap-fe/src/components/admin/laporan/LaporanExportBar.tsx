"use client";

import {
  Download,
  FileJson,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LaporanExportData, LaporanKeuangan } from "@/types/laporan";
import { Transaksi } from "@/types/transaksi";
import {
  exportLaporanCsvBulanan,
  exportLaporanCsvPengeluaran,
  exportLaporanCsvRingkasan,
  exportLaporanCsvTransaksi,
  exportLaporanJson,
  printLaporan,
} from "@/lib/laporanExport";

type Props = {
  data: LaporanKeuangan;
  transaksi: Transaksi[];
  transaksiLoading?: boolean;
  ensureTransaksi: () => Promise<Transaksi[]>;
};

export default function LaporanExportBar({
  data,
  transaksi,
  transaksiLoading,
  ensureTransaksi,
}: Props) {
  const [csvOpen, setCsvOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setCsvOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const buildExportData = async (): Promise<LaporanExportData> => {
    const rows = transaksi.length > 0 ? transaksi : await ensureTransaksi();
    return { ...data, transaksi: rows };
  };

  const runExportKeuangan = async (action: (payload: LaporanKeuangan) => void) => {
    setExporting(true);
    try {
      action(data);
    } finally {
      setExporting(false);
      setCsvOpen(false);
    }
  };

  const runExportWithTransaksi = async (
    action: (payload: LaporanExportData) => void
  ) => {
    setExporting(true);
    try {
      action(await buildExportData());
    } finally {
      setExporting(false);
      setCsvOpen(false);
    }
  };

  const csvOptions = [
    {
      label: "Ringkasan Keuangan",
      action: () => runExportKeuangan(exportLaporanCsvRingkasan),
    },
    {
      label: "Semua Transaksi",
      action: () => runExportWithTransaksi(exportLaporanCsvTransaksi),
    },
    {
      label: "Trend Bulanan",
      action: () => runExportKeuangan(exportLaporanCsvBulanan),
    },
    {
      label: "Pengeluaran Operasional",
      action: () => runExportKeuangan(exportLaporanCsvPengeluaran),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        disabled={exporting}
        onClick={() => runExportWithTransaksi(exportLaporanJson)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500/30 dark:hover:text-emerald-400"
        title="Backup lengkap semua data laporan"
      >
        {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileJson size={16} />}
        Backup JSON
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          disabled={exporting}
          onClick={() => setCsvOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium shadow-sm transition hover:border-cyan-200 hover:text-cyan-700 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500/30 dark:hover:text-cyan-400"
        >
          <FileSpreadsheet size={16} />
          Export CSV
          <ChevronDown size={14} className={csvOpen ? "rotate-180 transition" : "transition"} />
        </button>
        {csvOpen && (
          <div className="absolute right-0 z-20 mt-1 min-w-[220px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-gray-900">
            {csvOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                disabled={exporting}
                onClick={opt.action}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-gray-50 disabled:opacity-60 dark:hover:bg-white/5"
              >
                <Download size={14} className="text-gray-400" />
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={printLaporan}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium shadow-sm transition hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-500/30 dark:hover:text-violet-400"
      >
        <Printer size={16} />
        Cetak
      </button>

      {transaksiLoading && (
        <span className="text-xs text-gray-500">Memuat detail transaksi...</span>
      )}
    </div>
  );
}
