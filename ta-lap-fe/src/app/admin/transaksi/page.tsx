"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import TransaksiDetailModal from "@/components/admin/transaksi/TransaksiDetailModal";
import SetoranKomisiTunaiPanel from "@/components/admin/transaksi/SetoranKomisiTunaiPanel";
import AdminSetoranPengajuanPanel from "@/components/admin/transaksi/AdminSetoranPengajuanPanel";
import TransaksiFilters from "@/components/admin/transaksi/TransaksiFilters";
import TransaksiStatsSection from "@/components/admin/transaksi/TransaksiStats";
import TransaksiTable from "@/components/admin/transaksi/TransaksiTable";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { useTransaksi } from "@/hooks/useTransaksi";
import {
  Transaksi,
  TransaksiKomisiFilter,
  TransaksiPayoutFilter,
  TransaksiStatusFilter,
} from "@/types/transaksi";

function AdminTransaksiPageContent() {
  const searchParams = useSearchParams();
  const {
    transaksi,
    stats,
    loading,
    reload,
    updateTransaksi,
    markKomisiLunas,
    markPayoutDicairkan,
  } = useTransaksi();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransaksiStatusFilter>("all");
  const [komisi, setKomisi] = useState<TransaksiKomisiFilter>("all");
  const [payout, setPayout] = useState<TransaksiPayoutFilter>("all");
  const [setoranTab, setSetoranTab] = useState<"pengajuan" | "rekap">("pengajuan");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);

    const st = searchParams.get("status");
    if (st === "menunggu" || st === "sukses" || st === "gagal") {
      setStatus(st);
    }

    const km = searchParams.get("komisi");
    if (
      km === "belum_lunas" ||
      km === "terpotong" ||
      km === "lunas"
    ) {
      setKomisi(km);
    }

    const po = searchParams.get("payout");
    if (po === "menunggu" || po === "dicairkan") {
      setPayout(po);
    }

    const setoran = searchParams.get("setoran");
    if (setoran === "menunggu" || setoran === "pengajuan") {
      setSetoranTab("pengajuan");
    }
  }, [searchParams]);
  const [selected, setSelected] = useState<Transaksi | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filtered = useMemo(() => {
    return transaksi.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.kode_transaksi.toLowerCase().includes(q) ||
        (item.kode_booking || "").toLowerCase().includes(q) ||
        (item.user_name || "").toLowerCase().includes(q) ||
        (item.owner_name || "").toLowerCase().includes(q) ||
        (item.lapangan_nama || "").toLowerCase().includes(q);

      const matchStatus =
        status === "all" ||
        item.status === status ||
        (status === "gagal" && (item.status === "gagal" || item.status === "refund"));

      const matchKomisi =
        komisi === "all" || item.status_komisi === komisi;

      const matchPayout =
        payout === "all" || item.status_payout_owner === payout;

      return matchSearch && matchStatus && matchKomisi && matchPayout;
    });
  }, [transaksi, search, status, komisi, payout]);

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

  const handleUpdate = async (
    id: string,
    data: Parameters<typeof updateTransaksi>[1]
  ) => {
    try {
      await updateTransaksi(id, data);
      showToast("success", "Transaksi berhasil diperbarui");
    } catch (err: unknown) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  const handleMarkKomisiLunas = async (id: string) => {
    try {
      await markKomisiLunas(id);
      showToast("success", "Komisi owner ditandai lunas");
    } catch (err: unknown) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  const handleMarkPayout = async (id: string) => {
    try {
      await markPayoutDicairkan(id);
      showToast("success", "Pendapatan owner ditandai dicairkan");
    } catch (err: unknown) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Memuat data transaksi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-violet-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-violet-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Keuangan Platform
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Monitoring Transaksi
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Owner daftar gratis. Setiap booking sukses ={" "}
              <strong>1 transaksi terpisah</strong> dengan komisi{" "}
              <strong>5%</strong>. Pembayaran tunai diterima owner — komisi
              dikumpulkan per bulan lalu admin setorkan ke pihak terkait.
            </p>
          </div>
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <TransaksiStatsSection stats={stats} />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSetoranTab("pengajuan")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            setoranTab === "pengajuan"
              ? "bg-violet-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
          }`}
        >
          Pengajuan Setoran Owner
        </button>
        <button
          type="button"
          onClick={() => setSetoranTab("rekap")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            setoranTab === "rekap"
              ? "bg-amber-600 text-white"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
          }`}
        >
          Rekap Bulanan Platform
        </button>
      </div>

      {setoranTab === "pengajuan" ? (
        <AdminSetoranPengajuanPanel onUpdated={reload} />
      ) : (
        <SetoranKomisiTunaiPanel onSettled={reload} />
      )}

      <TransaksiFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        komisi={komisi}
        setKomisi={setKomisi}
        payout={payout}
        setPayout={setPayout}
        totalCount={filtered.length}
      />

      <TransaksiTable
        transaksi={filtered}
        emptyMessage={
          search || status !== "all" || komisi !== "all" || payout !== "all"
            ? "Tidak ada transaksi yang cocok dengan filter"
            : "Belum ada data transaksi"
        }
        onDetail={openDetail}
      />

      <TransaksiDetailModal
        open={detailOpen}
        transaksi={selected}
        onClose={() => setDetailOpen(false)}
        onUpdate={handleUpdate}
        onMarkKomisiLunas={handleMarkKomisiLunas}
        onMarkPayout={handleMarkPayout}
      />
    </div>
  );
}

export default function AdminTransaksiPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-sm text-gray-500">
          Memuat transaksi...
        </div>
      }
    >
      <AdminTransaksiPageContent />
    </Suspense>
  );
}
