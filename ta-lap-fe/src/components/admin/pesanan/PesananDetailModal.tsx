"use client";

import {
  CalendarDays,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatDisplayEmailOrDash } from "@/lib/customerEmail";
import {
  formatMetodePembayaran,
  formatStatusPembayaran,
  METODE_PEMBAYARAN_OPTIONS,
  MetodePembayaran,
  STATUS_PEMBAYARAN_OPTIONS,
  StatusPembayaran,
} from "@/lib/pembayaran";
import { Pesanan, PesananStatus } from "@/types/pesanan";
import PesananStatusBadge from "./PesananStatusBadge";

function estimateKomisi(total: number, persen = 5) {
  const amount = Number(total);
  const komisi = Math.round(amount * (persen / 100));
  return { komisi, pendapatan: amount - komisi, persen };
}

type Props = {
  open: boolean;
  pesanan: Pesanan | null;
  variant?: "admin" | "owner";
  onClose: () => void;
  onEdit?: (item: Pesanan) => void;
  onUpdateStatus: (id: string, status: PesananStatus) => Promise<void>;
  onUpdatePayment: (
    id: string,
    data: { metode: MetodePembayaran; status: StatusPembayaran }
  ) => Promise<void>;
};

const statusOptions: { value: PesananStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "dibayar", label: "Dibayar" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
  { value: "expired", label: "Expired" },
];

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
        <Icon size={15} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function PesananDetailModal({
  open,
  pesanan,
  variant = "admin",
  onClose,
  onEdit,
  onUpdateStatus,
  onUpdatePayment,
}: Props) {
  const isOwner = variant === "owner";
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [metode, setMetode] = useState<MetodePembayaran | "">("");
  const [pembayaranStatus, setPembayaranStatus] =
    useState<StatusPembayaran>("sukses");

  useEffect(() => {
    if (!pesanan) return;
    setMetode((pesanan.pembayaran?.metode as MetodePembayaran) || "");
    setPembayaranStatus(
      (pesanan.pembayaran?.status as StatusPembayaran) || "sukses"
    );
    setPaymentError("");
  }, [pesanan]);

  if (!open || !pesanan) return null;

  const totalHarga = Number(pesanan.total_harga);
  const savedKomisi =
    pesanan.pembayaran?.komisi_platform != null
      ? {
          komisi: Number(pesanan.pembayaran.komisi_platform),
          pendapatan: Number(pesanan.pembayaran.pendapatan_owner ?? 0),
          persen: Number(pesanan.pembayaran.komisi_persen ?? 5),
        }
      : null;
  const previewKomisi =
    pembayaranStatus === "sukses" && metode
      ? estimateKomisi(totalHarga)
      : null;
  const komisiDisplay = savedKomisi ?? previewKomisi;

  const handleStatusChange = async (status: PesananStatus) => {
    if (status === pesanan.status) return;
    setStatusError("");
    setStatusLoading(true);
    try {
      await onUpdateStatus(pesanan.id, status);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengubah status";
      setStatusError(message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSavePayment = async () => {
    if (!metode) {
      setPaymentError("Pilih metode pembayaran");
      return;
    }
    setPaymentError("");
    setPaymentLoading(true);
    try {
      await onUpdatePayment(pesanan.id, {
        metode,
        status: pembayaranStatus,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan pembayaran";
      setPaymentError(message);
    } finally {
      setPaymentLoading(false);
    }
  };

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
                Detail Pesanan
              </p>
              <h2 className="mt-1 font-mono text-xl font-semibold text-gray-900 dark:text-white">
                {pesanan.kode_booking}
              </h2>
              <div className="mt-2">
                <PesananStatusBadge status={pesanan.status} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-white dark:border-white/10 dark:hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Customer
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoRow icon={User2} label="Nama" value={pesanan.user_name || ""} />
              <InfoRow icon={Mail} label="Email" value={formatDisplayEmailOrDash(pesanan.user_email)} />
              <InfoRow icon={Phone} label="Telepon" value={pesanan.user_phone || ""} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Lapangan & Jadwal
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={MapPin}
                label="Lapangan"
                value={`${pesanan.lapangan_nama || "—"}${pesanan.lapangan_jenis ? ` (${pesanan.lapangan_jenis})` : ""}`}
              />
              {!isOwner && (
                <InfoRow icon={User2} label="Owner" value={pesanan.owner_name || ""} />
              )}
              <InfoRow
                icon={CalendarDays}
                label="Tanggal"
                value={formatDate(pesanan.tanggal_booking)}
              />
              <InfoRow
                icon={CalendarDays}
                label="Waktu"
                value={`${formatTime(pesanan.jam_mulai)} – ${formatTime(pesanan.jam_selesai)}`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pembayaran
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={CreditCard}
                label="Metode Saat Ini"
                value={formatMetodePembayaran(pesanan.pembayaran?.metode)}
              />
              <InfoRow
                icon={CreditCard}
                label="Status Pembayaran"
                value={formatStatusPembayaran(pesanan.pembayaran?.status)}
              />
              <InfoRow
                icon={CreditCard}
                label="Total"
                value={formatRupiah(pesanan.total_harga)}
              />
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-white/5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {isOwner ? "Konfirmasi Pembayaran" : "Catat / Ubah Pembayaran"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Metode
                  </label>
                  <select
                    value={metode}
                    onChange={(e) =>
                      setMetode(e.target.value as MetodePembayaran)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800 dark:[color-scheme:dark]"
                  >
                    <option value="">Pilih metode</option>
                    {METODE_PEMBAYARAN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    value={pembayaranStatus}
                    onChange={(e) =>
                      setPembayaranStatus(e.target.value as StatusPembayaran)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-gray-800 dark:[color-scheme:dark]"
                  >
                    {STATUS_PEMBAYARAN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {paymentError && (
                <p className="mt-2 text-xs text-red-500">{paymentError}</p>
              )}
              <button
                onClick={handleSavePayment}
                disabled={paymentLoading}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60"
              >
                {paymentLoading && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Simpan Pembayaran
              </button>
            </div>

            {komisiDisplay && (
              <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50/50 p-3 dark:border-violet-500/20 dark:bg-violet-500/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                  Rincian Komisi (Booking Ini)
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="text-[10px] uppercase text-gray-500">Total</p>
                    <p className="font-semibold">{formatRupiah(totalHarga)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-500">
                      Komisi ({komisiDisplay.persen}%)
                    </p>
                    <p className="font-semibold text-violet-600 dark:text-violet-400">
                      {formatRupiah(komisiDisplay.komisi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-500">
                      Pendapatan Anda
                    </p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(komisiDisplay.pendapatan)}
                    </p>
                  </div>
                </div>
                {!savedKomisi && previewKomisi && (
                  <p className="mt-2 text-[11px] text-gray-500">
                    Estimasi jika status sukses — tersimpan setelah klik Simpan.
                  </p>
                )}
              </div>
            )}

            {isOwner && (
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2.5 text-xs text-amber-900/90 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-200/90">
                Setiap booking = 1 transaksi terpisah. Lapangan sama di hari
                berbeda tetap kena komisi {komisiDisplay?.persen ?? 5}% masing-masing.
                {metode === "cash" && pembayaranStatus === "sukses" && (
                  <> Tunai → wajib setor komisi ke platform.</>
                )}
              </div>
            )}
          </div>

          {pesanan.catatan && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Catatan
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {pesanan.catatan}
              </p>
            </div>
          )}

          <div className="rounded-xl border border-gray-100 p-4 dark:border-white/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Ubah Status
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={statusLoading || pesanan.status === opt.value}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    pesanan.status === opt.value
                      ? "bg-cyan-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-gray-400"
                  } disabled:opacity-50`}
                >
                  {opt.label}
                </button>
              ))}
              {statusLoading && (
                <Loader2 size={16} className="animate-spin text-cyan-600" />
              )}
            </div>
            {statusError && (
              <p className="mt-2 text-xs text-red-500">{statusError}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/10">
          <button
            onClick={onClose}
            className={`rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 ${
              !onEdit ? "flex-1" : ""
            }`}
          >
            Tutup
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(pesanan);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500"
            >
              <Pencil size={15} />
              Edit Pesanan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
