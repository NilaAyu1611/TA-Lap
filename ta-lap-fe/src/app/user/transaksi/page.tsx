"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Printer,
  Receipt,
  RefreshCw,
  XCircle,
} from "lucide-react";

import UserNavbar from "@/components/UserNavbar";
import TransaksiStatusBadge from "@/components/admin/transaksi/TransaksiStatusBadge";
import UserTransaksiReceiptModal from "@/components/user/transaksi/UserTransaksiReceiptModal";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { printTransaksiReceipt } from "@/lib/transaksiReceiptPrint";
import { getMyTransaksi } from "@/services/transaksi.service";
import { Transaksi } from "@/types/transaksi";

type StatusFilter = "all" | "sukses" | "menunggu" | "gagal";

export default function UserTransaksiPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
          <UserNavbar active="transaksi" />
          <p className="p-10 text-center text-gray-500">Memuat transaksi...</p>
        </main>
      }
    >
      <UserTransaksiContent />
    </Suspense>
  );
}

function UserTransaksiContent() {
  const searchParams = useSearchParams();
  const strukId = searchParams.get("struk");

  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Transaksi | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const [printError, setPrintError] = useState("");

  const loadData = useCallback(async () => {
    setLoadError("");
    try {
      const result = await getMyTransaksi();
      setTransaksi(result.data || []);
    } catch (error) {
      console.error(error);
      setLoadError("Gagal memuat riwayat transaksi. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!strukId || transaksi.length === 0) return;
    const item = transaksi.find((t) => t.id === strukId);
    if (item) {
      setSelected(item);
      setReceiptOpen(true);
    }
  }, [strukId, transaksi]);

  const filtered = useMemo(() => {
    if (filter === "all") return transaksi;
    if (filter === "gagal") {
      return transaksi.filter((t) => t.status === "gagal" || t.status === "refund");
    }
    return transaksi.filter((t) => t.status === filter);
  }, [transaksi, filter]);

  const stats = useMemo(
    () => ({
      sukses: transaksi.filter((t) => t.status === "sukses").length,
      menunggu: transaksi.filter((t) => t.status === "menunggu").length,
      gagal: transaksi.filter(
        (t) => t.status === "gagal" || t.status === "refund"
      ).length,
    }),
    [transaksi]
  );

  const openReceipt = (item: Transaksi) => {
    setPrintError("");
    setSelected(item);
    setReceiptOpen(true);
  };

  const handlePrintReceipt = (item: Transaksi) => {
    setPrintError("");
    const ok = printTransaksiReceipt(item);
    if (!ok) {
      setPrintError("Gagal membuka dialog cetak. Coba lagi.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b1120] dark:text-white">
      <UserNavbar active="transaksi" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Riwayat Transaksi
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
              Semua pembayaran booking tercatat di sini. Setelah bayar sukses,
              Anda bisa lihat dan cetak struk kapan saja.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium dark:border-white/10"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={CheckCircle2}
            label="Sukses"
            value={stats.sukses}
            tone="emerald"
          />
          <StatCard
            icon={Clock3}
            label="Menunggu"
            value={stats.menunggu}
            tone="amber"
          />
          <StatCard
            icon={XCircle}
            label="Gagal / Refund"
            value={stats.gagal}
            tone="red"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["all", "Semua"],
              ["sukses", "Sukses"],
              ["menunggu", "Menunggu"],
              ["gagal", "Gagal"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                filter === id
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loadError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {loadError}
          </div>
        )}

        {printError && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {printError}
          </div>
        )}

        {loading ? (
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={20} />
            Memuat riwayat transaksi...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-gray-200 p-12 text-center dark:border-white/10">
            <Receipt className="mx-auto text-gray-300 dark:text-gray-600" size={48} />
            <p className="mt-4 font-medium">Belum ada transaksi</p>
            <p className="mt-1 text-sm text-gray-500">
              Transaksi muncul otomatis setelah Anda melakukan pembayaran booking.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                        {item.kode_transaksi}
                      </p>
                      <TransaksiStatusBadge status={item.status} />
                    </div>
                    <h2 className="mt-2 text-xl font-semibold">
                      {item.lapangan_nama || "Lapangan"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Booking {item.kode_booking} ·{" "}
                      {formatMetodePembayaran(item.metode)}
                    </p>
                    {item.tanggal_booking && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.tanggal_booking)} ·{" "}
                        {formatTime(item.jam_mulai)} -{" "}
                        {formatTime(item.jam_selesai)}
                      </p>
                    )}
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(item.total_bayar)}
                    </p>
                    {item.tanggal_bayar && (
                      <p className="mt-1 text-xs text-gray-500">
                        Dibayar {formatDate(item.tanggal_bayar)}
                      </p>
                    )}
                  </div>
                </div>

                {item.status === "sukses" && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openReceipt(item)}
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-5 py-2.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:border-cyan-500/30 dark:bg-white/5 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                    >
                      <FileText size={16} />
                      Lihat Struk
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrintReceipt(item)}
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
                    >
                      <Printer size={16} />
                      Cetak Struk
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <UserTransaksiReceiptModal
        open={receiptOpen}
        transaksi={selected}
        onClose={() => setReceiptOpen(false)}
      />
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red";
}) {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    red: "text-red-600 dark:text-red-400 bg-red-500/10",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className={`inline-flex rounded-xl p-2 ${colors[tone]}`}>
        <Icon size={20} />
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
