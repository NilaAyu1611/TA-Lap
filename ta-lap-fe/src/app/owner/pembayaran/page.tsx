"use client";

import { Loader2, RefreshCw, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PembayaranDetailModal from "@/components/admin/pembayaran/PembayaranDetailModal";
import PembayaranFilters from "@/components/admin/pembayaran/PembayaranFilters";
import PembayaranStatsSection from "@/components/admin/pembayaran/PembayaranStats";
import PembayaranTable from "@/components/admin/pembayaran/PembayaranTable";
import OwnerSetoranTunaiSection from "@/components/owner/setoran/OwnerSetoranTunaiSection";
import PendingPesananAlert from "@/components/admin/pembayaran/PendingPesananAlert";
import OwnerNavbar from "@/components/OwnerNavbar";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { usePesanan } from "@/hooks/usePesanan";
import { useTransaksi } from "@/hooks/useTransaksi";
import {
  Transaksi,
  TransaksiKomisiFilter,
  TransaksiStatus,
  TransaksiStatusFilter,
} from "@/types/transaksi";

export default function OwnerPembayaranPage() {
  const { transaksi, stats, loading, reload, updateTransaksi } = useTransaksi();
  const { pesanan, loading: pesananLoading, reload: reloadPesanan } = usePesanan();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransaksiStatusFilter>("all");
  const [komisi, setKomisi] = useState<TransaksiKomisiFilter>("all");
  const [selected, setSelected] = useState<Transaksi | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const pendingTanpaPembayaran = useMemo(
    () =>
      pesanan.filter(
        (item) => item.status === "pending" && !item.pembayaran?.metode
      ),
    [pesanan]
  );

  const filtered = useMemo(() => {
    return transaksi.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.kode_transaksi.toLowerCase().includes(q) ||
        (item.kode_booking || "").toLowerCase().includes(q) ||
        (item.user_name || "").toLowerCase().includes(q) ||
        (item.lapangan_nama || "").toLowerCase().includes(q);

      const matchStatus =
        status === "all" ||
        item.status === status ||
        (status === "gagal" && (item.status === "gagal" || item.status === "refund"));

      const matchKomisi =
        komisi === "all" || item.status_komisi === komisi;

      return matchSearch && matchStatus && matchKomisi;
    });
  }, [transaksi, search, status, komisi]);

  useEffect(() => {
    if (!selected) return;
    const updated = transaksi.find((item) => item.id === selected.id);
    if (updated) setSelected(updated);
  }, [transaksi, selected?.id]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const openDetail = (item: Transaksi) => {
    setSelected(item);
    setDetailOpen(true);
  };

  const handleRefresh = async () => {
    await Promise.all([reload(), reloadPesanan()]);
  };

  const handleVerify = async (id: string, newStatus: TransaksiStatus) => {
    try {
      await updateTransaksi(id, { status: newStatus });
      await reloadPesanan();
      showToast(
        "success",
        newStatus === "sukses"
          ? "Pembayaran diverifikasi — pesanan diperbarui"
          : "Pembayaran ditandai gagal"
      );
    } catch (err: unknown) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  const isLoading = loading || pesananLoading;

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#020617] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <OwnerNavbar active="pembayaran" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6">
        {toast && (
          <div
            className={`fixed right-6 top-24 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat data pembayaran...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <Wallet size={14} />
                    Keuangan Venue
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Monitoring Pembayaran
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                    Setiap booking sukses = 1 transaksi. Pembayaran tunai
                    diterima langsung di venue — pisahkan 5% komisi platform
                    per transaksi untuk disetor bulanan.
                  </p>
                </div>

                <button
                  onClick={handleRefresh}
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            <PendingPesananAlert pesanan={pendingTanpaPembayaran} />

            <PembayaranStatsSection stats={stats} />

            <OwnerSetoranTunaiSection variant="compact" />

            <div className="rounded-xl border border-gray-200/80 bg-white p-4 text-sm text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">Alur terintegrasi:</strong>{" "}
              Customer booking (1 booking = 1 komisi) → Owner catat/konfirmasi di{" "}
              <span className="font-medium text-cyan-700 dark:text-cyan-400">Pesanan</span>{" "}
              → Transaksi muncul di sini dengan rincian komisi → Admin cairkan
              pendapatan ke rekening owner.
            </div>

            <PembayaranFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              komisi={komisi}
              setKomisi={setKomisi}
              totalCount={filtered.length}
            />

            <PembayaranTable
              pembayaran={filtered}
              emptyMessage={
                search || status !== "all" || komisi !== "all"
                  ? "Tidak ada pembayaran yang cocok dengan filter"
                  : "Belum ada transaksi pembayaran — catat pembayaran dari halaman Pesanan"
              }
              onDetail={openDetail}
            />
          </div>
        )}
      </section>

      <PembayaranDetailModal
        open={detailOpen}
        pembayaran={selected}
        onClose={() => setDetailOpen(false)}
        onVerify={handleVerify}
      />
    </main>
  );
}
