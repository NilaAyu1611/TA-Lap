"use client";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/auth";
import { hitungRefundPreview, isPaidForCancellation } from "@/lib/refund";
import { getKebijakanBatal } from "@/services/pesanan.service";
import { PesananStatus } from "@/types/pesanan";

type Props = {
  open: boolean;
  totalHarga: number;
  totalBayar?: number | null;
  pesananStatus?: PesananStatus | string;
  pembayaranStatus?: string | null;
  kodeBooking?: string;
  onClose: () => void;
  onConfirm: (alasan?: string) => Promise<void>;
};

export default function CancelPesananDialog({
  open,
  totalHarga,
  totalBayar,
  pesananStatus,
  pembayaranStatus,
  kodeBooking,
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [policyLoading, setPolicyLoading] = useState(true);
  const [potonganPersen, setPotonganPersen] = useState(25);
  const [policyDesc, setPolicyDesc] = useState("");
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setAlasan("");
    setError("");
    setPolicyLoading(true);
    getKebijakanBatal()
      .then((res) => {
        setPotonganPersen(res.data.potongan_persen);
        setPolicyDesc(res.data.deskripsi);
      })
      .catch(() => setPotonganPersen(25))
      .finally(() => setPolicyLoading(false));
  }, [open]);

  if (!open) return null;

  const sudahBayar = isPaidForCancellation({
    status: pesananStatus || "pending",
    pembayaran: pembayaranStatus ? { status: pembayaranStatus } : null,
  });

  const basisRefund = Number(totalBayar ?? totalHarga);
  const preview = sudahBayar
    ? hitungRefundPreview(basisRefund, potonganPersen)
    : null;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm(alasan.trim() || undefined);
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal membatalkan pesanan";
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

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-white/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Batalkan Pesanan
            </p>
            {kodeBooking && (
              <p className="mt-1 font-mono text-sm text-gray-500">{kodeBooking}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {policyLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" />
              Memuat kebijakan...
            </div>
          ) : sudahBayar && preview ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-500/25 dark:bg-amber-500/5">
              <div className="flex gap-3">
                <AlertTriangle className="shrink-0 text-amber-600" size={18} />
                <div className="text-sm text-amber-900 dark:text-amber-200">
                  <p className="font-semibold">
                    Potongan pembatalan {preview.potongan_persen}%
                  </p>
                  <p className="mt-1 text-amber-800/90 dark:text-amber-400/90">
                    Pesanan <strong>sudah dibayar</strong>. Uang tidak dikembalikan
                    100%. Dari <strong>{formatRupiah(basisRefund)}</strong>:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>
                      Refund ke Anda:{" "}
                      <strong>{formatRupiah(preview.jumlah_refund)}</strong> (
                      {preview.refund_persen}%)
                    </li>
                    <li>
                      Potongan (tidak kembali):{" "}
                      <strong>{formatRupiah(preview.jumlah_potongan)}</strong> (
                      {preview.potongan_persen}%)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-500/25 dark:bg-emerald-500/5">
              <div className="flex gap-3">
                <CheckCircle2 className="shrink-0 text-emerald-600" size={18} />
                <div className="text-sm text-emerald-900 dark:text-emerald-200">
                  <p className="font-semibold">Pembatalan gratis — tanpa potongan</p>
                  <p className="mt-1 text-emerald-800/90 dark:text-emerald-400/90">
                    Pesanan belum dibayar (atau pembayaran belum sukses). Anda bisa
                    batalkan tanpa dikenakan potongan 25%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!policyLoading && policyDesc && (
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {policyDesc}
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Alasan pembatalan (opsional)
            </label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows={2}
              placeholder="Contoh: jadwal bentrok, cuaca buruk..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
          >
            Kembali
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || policyLoading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
