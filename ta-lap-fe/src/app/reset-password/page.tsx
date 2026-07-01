"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";

import ThemeInit from "@/components/admin/ThemeInit";
import ThemeToggle from "@/components/ThemeToggle";
import { resetPassword, verifyResetToken } from "@/services/auth.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setChecking(false);
      setTokenError("Token reset tidak ditemukan.");
      return;
    }

    verifyResetToken(token)
      .then((result) => {
        setValidToken(result.valid);
        if (!result.valid) {
          setTokenError(result.message || "Link reset tidak valid");
        }
      })
      .catch(() => {
        setTokenError("Link reset tidak valid atau sudah kadaluarsa");
      })
      .finally(() => setChecking(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      router.push("/login?reset=success");
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
          : "Gagal reset password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Loader2 size={20} className="animate-spin text-cyan-500" />
        Memverifikasi link...
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-600 dark:text-red-300">{tokenError}</p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-sm font-semibold text-cyan-600"
        >
          Minta link reset baru
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Password baru
        </label>
        <div className="relative">
          <LockKeyhole
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/70"
          />
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-cyan-100 bg-white py-3 pl-11 pr-12 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Konfirmasi password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-cyan-100 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan password baru"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/50 to-violet-50/40 px-4 dark:from-[#060b14] dark:via-[#060b14] dark:to-[#0a1628]">
      <ThemeInit />
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-cyan-100/80 bg-white/90 p-8 shadow-xl dark:border-white/10 dark:bg-white/[0.04]">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-600"
        >
          <ArrowLeft size={16} />
          Kembali ke login
        </Link>

        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Buat password baru untuk akun TA-LAP Anda.
        </p>

        <div className="mt-6">
          <Suspense
            fallback={
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Loader2 size={20} className="animate-spin text-cyan-500" />
                Memuat...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
