"use client";

import { AlertCircle, BarChart3, Loader2, RefreshCw } from "lucide-react";
import { useCallback } from "react";

import LabaRugiStatement from "@/components/admin/laporan/LabaRugiStatement";
import LaporanBreakdownSection from "@/components/admin/laporan/LaporanBreakdown";
import LaporanTransaksiDetail from "@/components/admin/laporan/LaporanTransaksiDetail";
import OwnerLaporanBulananTable from "@/components/owner/laporan/OwnerLaporanBulananTable";
import {
  OwnerPerJenisSection,
  OwnerPerMetodeSection,
  OwnerTopLapanganSection,
} from "@/components/owner/laporan/OwnerLaporanAnalytics";
import OwnerLaporanExportBar from "@/components/owner/laporan/OwnerLaporanExportBar";
import OwnerLaporanOperasionalSection from "@/components/owner/laporan/OwnerLaporanOperasional";
import OwnerLaporanRingkasanSection from "@/components/owner/laporan/OwnerLaporanRingkasan";
import OwnerNavbar from "@/components/OwnerNavbar";
import { useOwnerLaporan } from "@/hooks/useOwnerLaporan";
import { useOwnerLaporanTransaksi } from "@/hooks/useOwnerLaporanTransaksi";
import { formatDate } from "@/lib/auth";
import { getOwnerLaporanTransaksi } from "@/services/laporan.service";

export default function OwnerLaporanPage() {
  const { data, loading, error, reload } = useOwnerLaporan();
  const {
    transaksi,
    loading: transaksiLoading,
    error: transaksiError,
    reload: reloadTransaksi,
  } = useOwnerLaporanTransaksi(!loading && !error && !!data);

  const ensureTransaksi = useCallback(async () => {
    if (transaksi.length > 0) return transaksi;
    const result = await getOwnerLaporanTransaksi();
    return result.data;
  }, [transaksi]);

  const handleRefresh = () => {
    reload();
    reloadTransaksi();
  };

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#020617] dark:text-white">
      <div data-print-hide className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <OwnerNavbar active="laporan" />

      <section className="owner-laporan-print relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat laporan bisnis Anda...</span>
            </div>
          </div>
        ) : error || !data ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <p className="font-semibold">Gagal memuat laporan</p>
              <p className="mt-1 max-w-md text-sm text-gray-500">
                {error || "Terjadi kesalahan saat mengambil data."}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <RefreshCw size={16} />
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="hidden print:block print:mb-6">
              <h1 className="text-2xl font-bold">
                Laporan Keuangan — {data.owner.name}
              </h1>
              <p className="text-sm text-gray-600">
                {data.owner.email} · Dicetak: {formatDate(data.generatedAt)}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <BarChart3 size={14} />
                    Laporan Bisnis Owner
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Analitik & Arsip Keuangan Venue
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                    Laporan lengkap venue: pendapatan bersih, komisi platform per
                    booking, payout, refund, performa lapangan, dan arsip transaksi.
                    Komisi <strong>{data.komisi_persen}%</strong> per booking sukses
                    (lapangan sama, hari berbeda = terpisah) · Potongan batal{" "}
                    <strong>{data.batal_potongan_persen}%</strong>.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {data.owner.name} ({data.owner.email}) · Data per:{" "}
                    {formatDate(data.generatedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <OwnerLaporanExportBar
                    data={data}
                    transaksi={transaksi}
                    transaksiLoading={transaksiLoading}
                    ensureTransaksi={ensureTransaksi}
                  />
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <OwnerLaporanRingkasanSection
              ringkasan={data.ringkasan}
              komisiPersen={data.komisi_persen}
            />

            <LabaRugiStatement
              labaRugi={data.labaRugi}
              komisiPersen={data.komisi_persen}
              title="Laporan Laba Rugi Venue"
              subtitle={`Pendapatan bersih per booking sukses setelah komisi ${data.komisi_persen}%. Lapangan sama di hari berbeda = komisi terpisah.`}
            />

            <OwnerLaporanOperasionalSection data={data.operasional} />

            <div className="grid gap-4 lg:grid-cols-3 print:grid-cols-1">
              <LaporanBreakdownSection
                title="Pemasukan"
                items={data.breakdown.pemasukan}
                variant="income"
              />
              <LaporanBreakdownSection
                title="Pengeluaran & Potongan"
                items={data.breakdown.pengeluaran}
                variant="expense"
              />
              <LaporanBreakdownSection
                title="Kewajiban & Payout"
                items={data.breakdown.kewajiban}
                variant="liability"
              />
            </div>

            <OwnerLaporanBulananTable data={data.bulanan} />

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OwnerTopLapanganSection data={data.topLapangan} />
              </div>
              <div className="space-y-4">
                <OwnerPerMetodeSection data={data.perMetode} />
                <OwnerPerJenisSection data={data.perJenis} />
              </div>
            </div>

            {transaksiLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-gray-200/80 bg-white py-16 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Loader2 className="animate-spin" size={18} />
                  Memuat arsip transaksi...
                </div>
              </div>
            ) : transaksiError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/5">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Gagal memuat arsip transaksi
                </p>
                <button
                  onClick={reloadTransaksi}
                  className="mt-3 text-sm font-medium text-red-700 underline dark:text-red-300"
                >
                  Coba lagi
                </button>
              </div>
            ) : (
              <LaporanTransaksiDetail transaksi={transaksi} variant="owner" />
            )}
          </div>
        )}
      </section>
    </main>
  );
}
