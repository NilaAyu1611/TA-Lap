"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Owner } from "@/types/owner";

type Props = {
  open: boolean;
  owner: Owner | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteOwnerDialog({
  open,
  owner,
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !owner) return null;

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus owner";
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

      <div className="relative w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="text-red-500" size={28} />
        </div>

        <h3 className="mt-5 text-center text-2xl font-black">Hapus Owner?</h3>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          Anda akan menghapus akun owner{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {owner.name}
          </span>
          . Lapangan milik owner akan dilepas dari akun ini.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 dark:border-white/10"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
