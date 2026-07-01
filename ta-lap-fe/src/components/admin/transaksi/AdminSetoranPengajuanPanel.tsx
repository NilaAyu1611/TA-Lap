"use client";

import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatDate, formatRupiah } from "@/lib/auth";
import { apiAssetUrl } from "@/lib/apiAsset";
import {
  approveSetoranPengajuan,
  getSetoranPengajuan,
  rejectSetoranPengajuan,
} from "@/services/transaksi.service";
import { SetoranPengajuan } from "@/types/setoranTunai";

type Props = { onUpdated?: () => void };

function StatusBadge({ status }: { status: SetoranPengajuan["status"] }) {
  const map = {
    menunggu_verifikasi:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    disetujui:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    ditolak: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  };
  const labels = {
    menunggu_verifikasi: "Menunggu Verifikasi",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function AdminSetoranPengajuanPanel({ onUpdated }: Props) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("menunggu_verifikasi");
  const [menunggu, setMenunggu] = useState(0);
  const [rows, setRows] = useState<SetoranPengajuan[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSetoranPengajuan(filter);
      setMenunggu(res.menunggu);
      setRows(res.data);
    } catch {
      setError("Gagal memuat pengajuan setoran owner");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    setError("");
    try {
      await approveSetoranPengajuan(id);
      await load();
      onUpdated?.();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyetujui"
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    setProcessing(rejectId);
    setError("");
    try {
      await rejectSetoranPengajuan(rejectId, rejectReason.trim());
      setRejectId(null);
      setRejectReason("");
      await load();
      onUpdated?.();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menolak"
      );
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-200/80 bg-white shadow-sm dark:border-violet-500/20 dark:bg-gray-900/40">
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/80 to-white px-6 py-5 dark:border-violet-500/10 dark:from-violet-950/40 dark:to-gray-900/60">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
              Pengajuan Setoran Owner
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              Verifikasi Bukti Transfer
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Notifikasi masuk saat owner kirim bukti — setujui setelah cek mutasi.
            </p>
          </div>
          {menunggu > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
              {menunggu} menunggu
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { value: "menunggu_verifikasi", label: "Menunggu" },
            { value: "disetujui", label: "Disetujui" },
            { value: "ditolak", label: "Ditolak" },
            { value: "all", label: "Semua" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === opt.value
                  ? "bg-violet-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center gap-2 py-12 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin" size={18} />
          Memuat...
        </div>
      ) : rows.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Tidak ada pengajuan untuk filter ini.
        </p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-white/10">
          {rows.map((row) => (
            <div key={row.id} className="px-6 py-5">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {row.owner_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {row.owner_phone || row.owner_email}
                  </p>
                  <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                    <strong>{row.label}</strong> · {row.jumlah_transaksi} transaksi
                  </p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                    {formatRupiah(row.total_komisi)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {row.metode === "transfer" ? "Transfer Bank" : "E-Wallet"} ·{" "}
                    {formatDate(row.tanggal_bayar)}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={row.status} />
                  {row.bukti_pembayaran && (
                    <>
                      <a
                        href={apiAssetUrl(row.bukti_pembayaran)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:underline dark:text-cyan-400"
                      >
                        Lihat bukti <ExternalLink size={12} />
                      </a>
                      <img
                        src={apiAssetUrl(row.bukti_pembayaran)}
                        alt="Bukti"
                        className="mt-2 max-h-24 rounded border border-gray-200 dark:border-white/10"
                      />
                    </>
                  )}
                </div>
              </div>
              {row.status === "menunggu_verifikasi" && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={processing === row.id}
                    onClick={() => handleApprove(row.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                  >
                    <CheckCircle2 size={14} />
                    Setujui
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectId(row.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                  >
                    <XCircle size={14} />
                    Tolak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRejectId(null)} />
          <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Tolak Pengajuan
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 dark:border-white/10 dark:bg-gray-950 dark:text-white"
              placeholder="Alasan penolakan..."
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRejectId(null)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm text-white"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
