"use client";

import Link from "next/link";
import { LogIn, UserPlus, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
};

export default function LandingAuthModal({
  open,
  onClose,
  title = "Masuk atau daftar untuk melanjutkan",
  description = "Booking lapangan dan melihat daftar venue lengkap hanya tersedia setelah Anda memiliki akun pemain.",
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="landing-auth-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Tutup"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0b1120]">
        <div className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-violet-50 px-6 py-5 dark:border-white/10 dark:from-cyan-950/40 dark:to-violet-950/30">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 hover:bg-white/80 dark:hover:bg-white/10"
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
          <h2
            id="landing-auth-title"
            className="pr-8 text-lg font-bold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="space-y-3 p-6">
          <Link
            href="/register"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            <UserPlus size={18} />
            Daftar akun pemain
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            <LogIn size={18} />
            Saya sudah punya akun
          </Link>
          <p className="pt-1 text-center text-xs text-gray-500 dark:text-gray-400">
            Pemilik venue?{" "}
            <Link
              href="/register/owner"
              onClick={onClose}
              className="font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              Daftar mitra venue
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
