"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

import ThemeInit from "@/components/admin/ThemeInit";
import ThemeToggle from "@/components/ThemeToggle";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(null);
    setDevLink(null);

    try {
      const result = await forgotPassword(email.trim());
      setMessage(result.message);
      if (result.devResetUrl) {
        setDevLink(result.devResetUrl);
      }
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Gagal mengirim permintaan reset";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/50 to-violet-50/40 px-4 dark:from-[#060b14] dark:via-[#060b14] dark:to-[#0a1628]">
      <ThemeInit />
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-cyan-100/80 bg-white/90 p-8 shadow-xl dark:border-white/10 dark:bg-white/[0.04]">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-600 dark:text-gray-400"
        >
          <ArrowLeft size={16} />
          Kembali ke login
        </Link>

        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Lupa password?
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Masukkan email akun TA-LAP. Kami akan kirim link reset password (berlaku
          1 jam).
        </p>

        {message && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {message}
            {devLink && (
              <p className="mt-3 break-all text-xs">
                <span className="font-semibold">Mode dev (SMTP belum aktif):</span>
                <br />
                <a href={devLink} className="text-cyan-600 underline">
                  {devLink}
                </a>
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/70"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-cyan-100 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim link reset"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
