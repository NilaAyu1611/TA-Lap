"use client";

import { Landmark, RefreshCw } from "lucide-react";
import { useState } from "react";

import OwnerNavbar from "@/components/OwnerNavbar";
import OwnerSetoranTunaiSection from "@/components/owner/setoran/OwnerSetoranTunaiSection";

export default function OwnerSetoranTunaiPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#020617] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <OwnerNavbar active="setoran-tunai" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6">
        {toast && (
          <div className="fixed right-6 top-24 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
            {toast}
          </div>
        )}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-amber-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-amber-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Landmark size={14} />
                Keuangan · Komisi Tunai
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Setoran Bulanan
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                Halaman ini khusus untuk melihat kewajiban setoran komisi{" "}
                <strong>5%</strong> dari pembayaran tunai — dikumpulkan{" "}
                <strong>sekali per bulan</strong>, bukan per transaksi ke admin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-amber-200 dark:border-white/10 dark:bg-white/5"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <OwnerSetoranTunaiSection
          key={refreshKey}
          variant="full"
          onSubmitted={() => {
            setToast(
              "Pengajuan setoran terkirim — admin akan verifikasi bukti transfer Anda"
            );
            setTimeout(() => setToast(null), 4000);
          }}
        />
      </section>
    </main>
  );
}
