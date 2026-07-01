"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import KomisiStatusBadge from "@/components/admin/transaksi/KomisiStatusBadge";
import TransaksiStatusBadge from "@/components/admin/transaksi/TransaksiStatusBadge";
import { formatDisplayEmailOrDash } from "@/lib/customerEmail";
import { formatDate, formatRupiah } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { KOMISI_STATUS_OPTIONS } from "@/lib/transaksi";
import { Transaksi, TransaksiStatus } from "@/types/transaksi";
import PayoutStatusBadge from "./PayoutStatusBadge";

type Props = {
  open: boolean;
  pembayaran: Transaksi | null;
  onClose: () => void;
  onVerify: (id: string, status: TransaksiStatus) => Promise<void>;
};

export default function PembayaranDetailModal({
  open,
  pembayaran,
  onClose,
  onVerify,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [pembayaran]);

  if (!open || !pembayaran) return null;

  const handleVerify = async (status: TransaksiStatus) => {
    if (status === pembayaran.status) return;
    setLoading(true);
    setError("");
    try {
      await onVerify(pembayaran.id, status);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memverifikasi pembayaran";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const komisiInfo = KOMISI_STATUS_OPTIONS.find(
    (item) => item.value === pembayaran.status_komisi
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-5 dark:border-white/10 dark:from-cyan-950/30 dark:to-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Detail Pembayaran
              </p>
              <h2 className="mt-1 font-mono text-xl font-semibold">
                {pembayaran.kode_transaksi}
              </h2>
              <p className="mt-1 font-mono text-sm text-gray-500">
                Booking: {pembayaran.kode_booking || "—"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <TransaksiStatusBadge status={pembayaran.status} />
                <KomisiStatusBadge status={pembayaran.status_komisi} />
                <PayoutStatusBadge status={pembayaran.status_payout_owner} />
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
              Rincian Keuangan
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">Total Dibayar Customer</p>
                <p className="text-lg font-semibold">
                  {formatRupiah(pembayaran.total_bayar)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Komisi Platform ({pembayaran.komisi_persen}%)
                </p>
                <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">
                  {formatRupiah(pembayaran.komisi_platform)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pendapatan Anda</p>
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(pembayaran.pendapatan_owner)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Customer" value={pembayaran.user_name || "—"} />
            <Info label="Email" value={formatDisplayEmailOrDash(pembayaran.user_email)} />
            <Info label="Lapangan" value={pembayaran.lapangan_nama || "—"} />
            <Info
              label="Tanggal Main"
              value={
                pembayaran.tanggal_booking
                  ? formatDate(pembayaran.tanggal_booking)
                  : "—"
              }
            />
            <Info
              label="Metode"
              value={formatMetodePembayaran(pembayaran.metode)}
            />
            <Info
              label="Tanggal Bayar"
              value={
                pembayaran.tanggal_bayar
                  ? formatDate(pembayaran.tanggal_bayar)
                  : "—"
              }
            />
            <Info
              label="Status Pesanan"
              value={pembayaran.pesanan_status || "—"}
            />
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
              Integrasi dengan Pesanan
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Transaksi ini untuk booking{" "}
              <strong>{pembayaran.kode_booking}</strong>
              {pembayaran.tanggal_booking && (
                <>
                  {" "}
                  ({formatDate(pembayaran.tanggal_booking)})
                </>
              )}
              . Setiap booking = komisi {pembayaran.komisi_persen}% terpisah.
              Saat Anda verifikasi sukses, status pesanan otomatis{" "}
              <strong>dibayar</strong> dan komisi dihitung untuk transaksi ini.
            </p>
            <Link
              href="/owner/pesanan"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline dark:text-cyan-400"
            >
              <ExternalLink size={14} />
              Buka halaman Pesanan
            </Link>
          </div>

          {pembayaran.status === "refund" && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                Refund Pembatalan
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Dikembalikan ke Customer</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {formatRupiah(pembayaran.jumlah_refund ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Potongan Batal</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatRupiah(pembayaran.jumlah_potongan ?? 0)}
                  </p>
                </div>
              </div>
              {pembayaran.refund_reason && (
                <p className="mt-2 text-xs text-gray-500">
                  {pembayaran.refund_reason}
                </p>
              )}
            </div>
          )}

          {pembayaran.status_komisi === "belum_lunas" && pembayaran.status !== "refund" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/25 dark:bg-amber-500/5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={18} />
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    Komisi tunai belum disetor
                  </p>
                  <p className="mt-1 text-sm text-amber-700/90 dark:text-amber-400/90">
                    Pembayaran <strong>Tunai</strong> — setorkan komisi{" "}
                    {formatRupiah(pembayaran.komisi_platform)} ke platform.
                    Admin akan menandai lunas setelah transfer diterima.
                  </p>
                </div>
              </div>
            </div>
          )}

          {komisiInfo && pembayaran.status_komisi !== "belum_lunas" && (
            <div className="rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-white/5 dark:text-gray-400">
              <CreditCard size={14} className="mb-1 inline text-gray-400" />{" "}
              {komisiInfo.description}
            </div>
          )}

          {pembayaran.status === "menunggu" && (
            <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Verifikasi Pembayaran
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Konfirmasi apakah pembayaran dari customer sudah valid.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleVerify("sukses")}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  Terima — Sukses
                </button>
                <button
                  onClick={() => handleVerify("gagal")}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <XCircle size={14} />
                  Tolak — Gagal
                </button>
              </div>
            </div>
          )}

          {pembayaran.status_payout_owner === "menunggu" &&
            pembayaran.status === "sukses" && (
              <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-500/20 dark:bg-sky-500/5">
                <CalendarDays className="shrink-0 text-sky-600" size={18} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pendapatan{" "}
                  <strong>{formatRupiah(pembayaran.pendapatan_owner)}</strong>{" "}
                  menunggu pencairan dari admin platform ke rekening Anda.
                </p>
              </div>
            )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10"
          >
            Tutup
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
