"use client";

import Link from "next/link";
import { AlertCircle, FileBarChart2, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";

import LabaRugiStatement from "@/components/admin/laporan/LabaRugiStatement";
import LaporanBreakdownSection from "@/components/admin/laporan/LaporanBreakdown";
import LaporanBulananTable from "@/components/admin/laporan/LaporanBulananTable";
import LaporanExportBar from "@/components/admin/laporan/LaporanExportBar";
import LaporanOperasionalSection from "@/components/admin/laporan/LaporanOperasional";
import LaporanRingkasanSection from "@/components/admin/laporan/LaporanRingkasan";
import LaporanTransaksiDetail from "@/components/admin/laporan/LaporanTransaksiDetail";
import PengeluaranSection from "@/components/admin/laporan/PengeluaranSection";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { useLaporanKeuangan } from "@/hooks/useLaporanKeuangan";
import { useLaporanTransaksi } from "@/hooks/useLaporanTransaksi";
import { formatDate } from "@/lib/auth";
import { getLaporanTransaksi } from "@/services/laporan.service";

export default function AdminLaporanPage() {
  const { data, loading, error, reload, addPengeluaran, removePengeluaran } =
    useLaporanKeuangan();
  const {
    transaksi,
    loading: transaksiLoading,
    error: transaksiError,
    reload: reloadTransaksi,
  } = useLaporanTransaksi(!loading && !error && !!data);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const ensureTransaksi = useCallback(async () => {
    if (transaksi.length > 0) return transaksi;
    const result = await getLaporanTransaksi();
    return result.data;
  }, [transaksi]);

  const handleRefresh = () => {
    reload();
    reloadTransaksi();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Memuat laporan keuangan...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            Gagal memuat laporan
          </p>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            {error || "Terjadi kesalahan saat mengambil data dari server."}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
        >
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      </div>
    );
  }

  const generatedLabel = formatDate(data.generatedAt);

  return (
    <div className="laporan-print space-y-6">
      {toast && (
        <div
          className={`fixed right-6 top-24 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg print:hidden ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="hidden print:block print:mb-6">
        <h1 className="text-2xl font-bold">TA-Lap — Laporan Keuangan Platform</h1>
        <p className="text-sm text-gray-600">
          Dicetak: {generatedLabel} · Komisi platform {data.komisi_persen}%
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-emerald-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-emerald-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <FileBarChart2 size={14} />
              Laporan Keuangan & Audit
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Pemasukan, Pengeluaran & Laba Bersih
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Laporan lengkap untuk bisnis: laba rugi jelas, data operasional
              platform, detail transaksi, dan export backup. Kelola transaksi
              harian di{" "}
              <Link
                href="/admin/transaksi"
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-400 print:hidden"
              >
                Admin Transaksi
              </Link>
              .
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Data per: {generatedLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <LaporanExportBar
              data={data}
              transaksi={transaksi}
              transaksiLoading={transaksiLoading}
              ensureTransaksi={ensureTransaksi}
            />
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-emerald-200 dark:border-white/10 dark:bg-white/5"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <LaporanRingkasanSection
        ringkasan={data.ringkasan}
        komisiPersen={data.komisi_persen}
      />

      <LabaRugiStatement labaRugi={data.labaRugi} komisiPersen={data.komisi_persen} />

      <LaporanOperasionalSection data={data.operasional} />

      <div className="grid gap-4 lg:grid-cols-3 print:grid-cols-1">
        <LaporanBreakdownSection
          title="Pemasukan"
          items={data.breakdown.pemasukan}
          variant="income"
        />
        <LaporanBreakdownSection
          title="Pengeluaran"
          items={data.breakdown.pengeluaran}
          variant="expense"
        />
        <LaporanBreakdownSection
          title="Kewajiban & Payout"
          items={data.breakdown.kewajiban}
          variant="liability"
        />
      </div>

      <LaporanBulananTable data={data.bulanan} />

      {transaksiLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-200/80 bg-white py-16 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Loader2 className="animate-spin" size={18} />
            Memuat detail transaksi...
          </div>
        </div>
      ) : transaksiError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/5">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Gagal memuat detail transaksi
          </p>
          <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
            {transaksiError}
          </p>
          <button
            onClick={reloadTransaksi}
            className="mt-3 text-sm font-medium text-red-700 underline dark:text-red-300"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <LaporanTransaksiDetail transaksi={transaksi} />
      )}

      <PengeluaranSection
        items={data.pengeluaran}
        onAdd={async (form) => {
          try {
            await addPengeluaran(form);
            showToast("success", "Pengeluaran berhasil dicatat");
          } catch (err) {
            showToast("error", getApiErrorMessage(err));
            throw err;
          }
        }}
        onDelete={async (id) => {
          try {
            await removePengeluaran(id);
            showToast("success", "Pengeluaran dihapus");
          } catch (err) {
            showToast("error", getApiErrorMessage(err));
          }
        }}
      />
    </div>
  );
}
