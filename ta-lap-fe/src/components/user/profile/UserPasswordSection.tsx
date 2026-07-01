"use client";

import { Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { UserPasswordFormData } from "@/types/userProfile";

type Props = {
  saving?: boolean;
  onChangePassword: (data: UserPasswordFormData) => Promise<string>;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-black/20 dark:text-white";

export default function UserPasswordSection({ saving, onChangePassword }: Props) {
  const [form, setForm] = useState<UserPasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (field: keyof UserPasswordFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setSubmitting(true);
    try {
      const message = await onChangePassword(form);
      setSuccess(message || "Password berhasil diubah");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Gagal mengubah password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
          <ShieldCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Keamanan Akun</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ubah password untuk menjaga keamanan akun Anda
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Lama
          </label>
          <div className="relative">
            <LockKeyhole
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => update("currentPassword", e.target.value)}
              required
              autoComplete="current-password"
              className={`${inputClass} pl-10 pr-12`}
            />
            <ToggleButton visible={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => update("newPassword", e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                className={`${inputClass} pr-12`}
              />
              <ToggleButton visible={showNew} onToggle={() => setShowNew(!showNew)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || saving}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 dark:border-white/10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Ubah Password
        </button>
      </form>
    </section>
  );
}

function ToggleButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
}
