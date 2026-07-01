"use client";

import { CheckCircle2, Loader2, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate, formatRupiah } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import {
  KOMISI_STATUS_OPTIONS,
  PAYOUT_STATUS_OPTIONS,
  TRANSAKSI_STATUS_OPTIONS,
} from "@/lib/transaksi";
import {
  StatusKomisi,
  StatusPayoutOwner,
  Transaksi,
  TransaksiStatus,
} from "@/types/transaksi";
import KomisiStatusBadge from "./KomisiStatusBadge";
import TransaksiStatusBadge from "./TransaksiStatusBadge";

type Props = {
  open: boolean;
  transaksi: Transaksi | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    data: {
      status?: TransaksiStatus;
      status_komisi?: StatusKomisi;
      status_payout_owner?: StatusPayoutOwner;
      catatan_settlement?: string;
    }
  ) => Promise<void>;
  onMarkKomisiLunas: (id: string) => Promise<void>;
  onMarkPayout: (id: string) => Promise<void>;
};

export default function TransaksiDetailModal({
  open,
  transaksi,
  onClose,
  onUpdate,
  onMarkKomisiLunas,
  onMarkPayout,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<TransaksiStatus>("menunggu");
  const [statusKomisi, setStatusKomisi] = useState<StatusKomisi>("terpotong");
  const [statusPayout, setStatusPayout] =
    useState<StatusPayoutOwner>("menunggu");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (!transaksi) return;
    setStatus(transaksi.status);
    setStatusKomisi(transaksi.status_komisi);
    setStatusPayout(transaksi.status_payout_owner);
    setCatatan(transaksi.catatan_settlement || "");
    setError("");
  }, [transaksi]);

  if (!open || !transaksi) return null;

  const isCash = transaksi.metode === "cash";

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await onUpdate(transaksi.id, {
        status,
        status_komisi: statusKomisi,
        status_payout_owner: statusPayout,
        catatan_settlement: catatan,
      });
      setError("");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKomisiLunas = async () => {
    setLoading(true);
    setError("");
    try {
      await onMarkKomisiLunas(transaksi.id);
      setStatusKomisi("lunas");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menandai lunas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    setLoading(true);
    setError("");
    try {
      await onMarkPayout(transaksi.id);
      setStatusPayout("dicairkan");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mencairkan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white px-6 py-5 dark:border-white/10 dark:from-violet-950/30 dark:to-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Detail Transaksi
              </p>
              <h2 className="mt-1 font-mono text-xl font-semibold">
                {transaksi.kode_transaksi}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <TransaksiStatusBadge status={transaksi.status} />
                <KomisiStatusBadge status={transaksi.status_komisi} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-white dark:border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Ringkasan Keuangan
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">Total Bayar User</p>
                <p className="text-lg font-semibold">
                  {formatRupiah(transaksi.total_bayar)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Komisi Platform ({transaksi.komisi_persen}%)
                </p>
                <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">
                  {formatRupiah(transaksi.komisi_platform)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pendapatan Owner</p>
                <p className="text-lg font-semibold">
                  {formatRupiah(transaksi.pendapatan_owner)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Booking" value={transaksi.kode_booking || "—"} />
            <Info
              label="Tanggal Main"
              value={
                transaksi.tanggal_booking
                  ? formatDate(transaksi.tanggal_booking)
                  : "—"
              }
            />
            <Info label="Customer" value={transaksi.user_name || "—"} />
            <Info label="Owner" value={transaksi.owner_name || "—"} />
            <Info label="Lapangan" value={transaksi.lapangan_nama || "—"} />
            <Info
              label="Metode"
              value={formatMetodePembayaran(transaksi.metode)}
            />
            <Info
              label="Tanggal Bayar"
              value={
                transaksi.tanggal_bayar
                  ? formatDate(transaksi.tanggal_bayar)
                  : "—"
              }
            />
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Model Bisnis TA-LAP
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Owner daftar <strong>gratis</strong>. Setiap booking sukses ={" "}
              <strong>1 transaksi</strong> dengan komisi{" "}
              <strong>{transaksi.komisi_persen}%</strong> terpisah — lapangan
              sama di hari berbeda tetap dihitung masing-masing. Pembayaran{" "}
              <strong>Tunai</strong> → owner wajib setor komisi (status{" "}
              <em>Belum Lunas</em>). QRIS/Transfer → komisi otomatis terpotong;
              admin transfer manual bagian owner lalu tandai di Transaksi.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Status Pembayaran
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransaksiStatus)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-800 dark:[color-scheme:dark]"
              >
                {TRANSAKSI_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Status Komisi Owner
              </label>
              <select
                value={statusKomisi}
                onChange={(e) =>
                  setStatusKomisi(e.target.value as StatusKomisi)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-800 dark:[color-scheme:dark]"
              >
                {KOMISI_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Transfer ke Owner
              </label>
              <select
                value={statusPayout}
                onChange={(e) =>
                  setStatusPayout(e.target.value as StatusPayoutOwner)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-800 dark:[color-scheme:dark]"
              >
                {PAYOUT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Catatan Settlement
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={2}
              placeholder="Catatan transfer komisi / payout..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-800"
            />
          </div>

          {transaksi.status_komisi === "belum_lunas" && (
            <button
              onClick={handleKomisiLunas}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Tandai Komisi Owner Sudah Lunas
            </button>
          )}

          {isCash && transaksi.status === "sukses" && (
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              Pembayaran tunai — owner menerima langsung di venue. Tidak perlu
              transfer dari platform.
            </p>
          )}

          {statusPayout === "menunggu" && status === "sukses" && !isCash && (
              <button
                onClick={handlePayout}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Wallet size={16} />
                )}
                Tandai Sudah Transfer ke Owner
              </button>
            )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10"
          >
            Tutup
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 dark:border-white/5">
      <p className="text-[11px] uppercase text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
