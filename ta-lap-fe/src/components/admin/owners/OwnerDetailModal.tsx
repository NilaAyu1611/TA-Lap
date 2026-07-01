"use client";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Store,
  TrendingUp,
  User2,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Owner } from "@/types/owner";
import UserStatusBadge from "@/components/admin/users/UserStatusBadge";
import { formatRupiah } from "@/lib/auth";

type Props = {
  open: boolean;
  owner: Owner | null;
  reviewLoading?: boolean;
  onClose: () => void;
  onEdit: (owner: Owner) => void;
  onAddLapangan: (owner: Owner) => void;
  onApprove: (owner: Owner) => Promise<void>;
  onReject: (owner: Owner, notes: string) => Promise<void>;
};

const verificationLabels = {
  pending: {
    label: "Pending Review",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },
  approved: {
    label: "Terverifikasi",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  },
  rejected: {
    label: "Ditolak",
    className:
      "bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  },
};

export default function OwnerDetailModal({
  open,
  owner,
  reviewLoading,
  onClose,
  onEdit,
  onAddLapangan,
  onApprove,
  onReject,
}: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectError, setRejectError] = useState("");

  if (!open || !owner) return null;

  const verification = owner.verificationStatus
    ? verificationLabels[owner.verificationStatus]
    : null;

  const awaitingReview =
    owner.status === "pending" || owner.verificationStatus === "pending";
  const inconsistentApproved =
    owner.verificationStatus === "approved" && owner.status === "pending";
  const isRejected = owner.verificationStatus === "rejected";

  const handleRejectSubmit = async () => {
    if (!rejectNotes.trim()) {
      setRejectError("Catatan penolakan wajib diisi");
      return;
    }
    setRejectError("");
    try {
      await onReject(owner, rejectNotes.trim());
      setRejectOpen(false);
      setRejectNotes("");
    } catch {
      // toast handled by parent
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
                Detail Owner
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {owner.name}
              </h2>
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
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-lg font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
              {owner.avatar ? (
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                owner.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase() || <User2 size={28} />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <UserStatusBadge status={owner.status} size="sm" />
                {verification && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ${verification.className}`}
                  >
                    <ShieldCheck size={12} />
                    {verification.label}
                  </span>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <InfoItem icon={Mail} label="Email" value={owner.email} />
                <InfoItem
                  icon={Phone}
                  label="Telepon"
                  value={owner.phone || "—"}
                />
                <InfoItem icon={MapPin} label="Kota" value={owner.city || "—"} />
                <InfoItem
                  icon={CalendarDays}
                  label="Bergabung"
                  value={new Date(owner.joined).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
              </div>
            </div>
          </div>

          {(awaitingReview || inconsistentApproved) && !isRejected && (
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/30 dark:bg-violet-500/10">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-violet-600 p-2 text-white">
                  <ShieldAlert size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                    {inconsistentApproved
                      ? "Verifikasi sudah disetujui, tapi akun belum aktif"
                      : "Pendaftaran menunggu keputusan admin"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-violet-800 dark:text-violet-200">
                    {inconsistentApproved
                      ? "Owner belum bisa login. Klik Setujui Owner untuk mengaktifkan akun sekaligus."
                      : "Setujui = verifikasi disetujui + status akun aktif (owner bisa login). Tolak = verifikasi ditolak + akun diblokir."}
                  </p>
                  {!rejectOpen ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={reviewLoading}
                        onClick={() => onApprove(owner)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
                      >
                        {reviewLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        Setujui Owner
                      </button>
                      <button
                        type="button"
                        disabled={reviewLoading}
                        onClick={() => {
                          setRejectOpen(true);
                          setRejectError("");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:bg-transparent dark:hover:bg-red-500/10"
                      >
                        <XCircle size={14} />
                        Tolak Pendaftaran
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        rows={3}
                        placeholder="Alasan penolakan (wajib) — akan tersimpan sebagai catatan verifikasi"
                        className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400 dark:border-red-500/30 dark:bg-gray-900"
                      />
                      {rejectError && (
                        <p className="text-xs text-red-600">{rejectError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={reviewLoading}
                          onClick={handleRejectSubmit}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
                        >
                          {reviewLoading && (
                            <Loader2 size={14} className="animate-spin" />
                          )}
                          Konfirmasi Tolak
                        </button>
                        <button
                          type="button"
                          disabled={reviewLoading}
                          onClick={() => {
                            setRejectOpen(false);
                            setRejectNotes("");
                            setRejectError("");
                          }}
                          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 dark:border-white/10"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              Pendaftaran owner ini <strong>ditolak</strong> dan akun diblokir.
              Owner tidak bisa login ke platform.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox
              icon={Store}
              label="Total Lapangan"
              value={owner.totalLapangan}
              accent="cyan"
            />
            <StatBox
              icon={Building2}
              label="Lapangan Aktif"
              value={owner.lapanganAktif}
              accent="emerald"
            />
            <StatBox
              icon={TrendingUp}
              label="Transaksi Sukses"
              value={owner.transaksiSukses}
              accent={owner.transaksiSukses > 0 ? "emerald" : "amber"}
            />
            <StatBox
              icon={TrendingUp}
              label="Volume Transaksi"
              value={formatRupiah(owner.volumeTransaksi)}
              accent="violet"
              isText
            />
          </div>

          {owner.totalLapangan > 0 && owner.transaksiSukses === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              Owner ini punya lapangan tapi{" "}
              <strong>belum ada transaksi sukses</strong>
              {owner.totalBooking > 0
                ? ` (${owner.totalBooking} booking ada, belum lunas/dikonfirmasi).`
                : " sama sekali."}
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Daftar Lapangan
              </h3>
              <button
                onClick={() => onAddLapangan(owner)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-500"
              >
                <Plus size={14} />
                Tambah Lapangan
              </button>
            </div>

            {owner.lapangans.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <Store
                  size={28}
                  className="mx-auto text-gray-300 dark:text-gray-600"
                />
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Belum ada lapangan
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Admin atau owner dapat menambahkan venue setelah akun dibuat.
                </p>
                <button
                  onClick={() => onAddLapangan(owner)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400"
                >
                  <Plus size={14} />
                  Tambah Lapangan Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {owner.lapangans.map((lapangan) => (
                  <div
                    key={lapangan.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {lapangan.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lapangan.kota || "Kota belum diisi"}
                        {(lapangan.transaksiSukses ?? 0) > 0
                          ? ` · ${lapangan.transaksiSukses} transaksi`
                          : (lapangan.totalBooking ?? 0) > 0
                            ? ` · ${lapangan.totalBooking} booking, belum laku`
                            : " · belum ada booking"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${
                          lapangan.status
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-500 dark:bg-white/10"
                        }`}
                      >
                        {lapangan.status ? "Aktif" : "Nonaktif"}
                      </span>
                      {(lapangan.transaksiSukses ?? 0) === 0 &&
                        (lapangan.totalBooking ?? 0) === 0 && (
                          <span className="text-[10px] font-medium text-amber-600">
                            Belum laku
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 dark:border-blue-500/20 dark:bg-blue-500/10">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
              <strong>Status vs Verifikasi:</strong> Verifikasi = keputusan review
              admin. Status akun = apakah owner bisa login. Keduanya otomatis
              disinkronkan saat Setujui/Tolak atau saat simpan di form Edit.
            </p>
          </div>

          {owner.verificationNotes && (
            <div className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/5">
              <p className="text-xs text-gray-500">Catatan Verifikasi</p>
              <p className="mt-1 text-sm font-medium">{owner.verificationNotes}</p>
            </div>
          )}

          <div className="flex gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(owner);
              }}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
            >
              Edit Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Icon size={13} />
        {label}
      </div>
      <p className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  accent,
  isText,
}: {
  icon: typeof Store;
  label: string;
  value: number | string;
  accent: "cyan" | "emerald" | "amber" | "violet";
  isText?: boolean;
}) {
  const colorMap = {
    cyan: "border-cyan-100 bg-cyan-50/50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-400",
    emerald:
      "border-emerald-100 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    amber:
      "border-amber-100 bg-amber-50/50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    violet:
      "border-violet-100 bg-violet-50/50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${colorMap[accent]}`}>
      <div className="flex items-center gap-2 text-xs font-medium opacity-80">
        <Icon size={14} />
        {label}
      </div>
      <p
        className={`mt-1 font-semibold tabular-nums ${
          isText ? "text-base" : "text-2xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
