"use client";

import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate, formatRupiah } from "@/lib/auth";
import { UserProfile, UserProfileFormData } from "@/types/userProfile";

type Props = {
  profile: UserProfile;
  saving?: boolean;
  onSave: (data: UserProfileFormData) => Promise<string>;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-black/20 dark:text-white";

export default function UserProfileForm({ profile, saving, onSave }: Props) {
  const [form, setForm] = useState<UserProfileFormData>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || "",
    city: profile.city || "",
    avatar: profile.avatar || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || "",
      city: profile.city || "",
      avatar: profile.avatar || "",
    });
  }, [profile]);

  const update = (field: keyof UserProfileFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const message = await onSave(form);
      setSuccess(message || "Profil berhasil diperbarui");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil");
    } finally {
      setSubmitting(false);
    }
  };

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            {form.avatar || profile.avatar ? (
              <img
                src={form.avatar || profile.avatar || ""}
                alt={profile.name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-cyan-500/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={12} />
                {profile.status}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                Member sejak {formatDate(profile.joined)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:text-right">
            <div className="rounded-xl bg-cyan-50 px-4 py-3 dark:bg-cyan-500/10">
              <p className="text-xs text-gray-500">Total Booking</p>
              <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                {profile.totalBooking}
              </p>
            </div>
            <div className="rounded-xl bg-violet-50 px-4 py-3 dark:bg-violet-500/10">
              <p className="text-xs text-gray-500">Total Pengeluaran</p>
              <p className="text-sm font-bold text-violet-700 dark:text-violet-400">
                {formatRupiah(profile.totalSpending)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Informasi Profil</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lengkapi nomor telepon dan kota agar proses booking & kontak venue lebih
            mudah.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {success}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama Lengkap" icon={User} required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Nama lengkap Anda"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Email" icon={Mail} required>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@example.com"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Nomor Telepon" icon={Phone} required hint="Wajib untuk konfirmasi booking">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Kota" icon={MapPin}>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Contoh: Bandung"
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="URL Foto Profil (opsional)" icon={User}>
              <input
                type="url"
                value={form.avatar}
                onChange={(e) => update("avatar", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>
            <p className="mt-1.5 text-xs text-gray-500">
              Kosongkan jika ingin menggunakan inisial nama otomatis.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-5 dark:border-white/10">
          <button
            type="submit"
            disabled={submitting || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
          >
            {(submitting || saving) && <Loader2 size={16} className="animate-spin" />}
            <Save size={16} />
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Account info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="text-lg font-semibold">Informasi Akun</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">ID Akun</dt>
            <dd className="font-mono font-medium">#{String(profile.id).padStart(4, "0")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Email terverifikasi</dt>
            <dd className="font-medium">{profile.email_verified ? "Ya" : "Belum"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="flex items-center gap-1.5 text-gray-500">
              <CalendarDays size={14} />
              Terakhir login
            </dt>
            <dd className="text-right font-medium">
              {profile.lastLogin
                ? formatDate(profile.lastLogin.created_at)
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Terakhir diperbarui</dt>
            <dd className="font-medium">{formatDate(profile.updated_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  hint,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {hint && (
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <div className="[&_input]:pl-10">{children}</div>
      </div>
    </div>
  );
}
