"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Lapangan } from "@/types/lapangan";

type Props = {
  open: boolean;
  lapangan: Lapangan | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteLapanganDialog({
  open,
  lapangan,
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !lapangan) return null;

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus lapangan";
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

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="text-red-500" size={26} />
        </div>

        <h3 className="mt-4 text-center text-xl font-semibold">Hapus Lapangan?</h3>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Anda akan menghapus{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {lapangan.nama}
          </span>
          . Data booking terkait juga akan dihapus.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-center text-sm text-red-600 dark:bg-red-500/10">
            {error}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
