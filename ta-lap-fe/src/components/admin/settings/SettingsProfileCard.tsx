"use client";

import { Loader2, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formInputClass,
  formLabelClass,
} from "@/components/admin/lapangan/formStyles";
import { formatDate, formatTime } from "@/lib/auth";
import {
  ActivityLogEntry,
  AdminProfile,
  ProfileFormData,
} from "@/types/settings";

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

type Props = {
  profile: AdminProfile;
  sessionStartedAt: string | null;
  currentIp: string | null;
  lastLogin: ActivityLogEntry | null;
  previousLogin: ActivityLogEntry | null;
  onSaveProfile: (data: ProfileFormData) => Promise<string>;
  saving?: boolean;
};

export default function SettingsProfileCard({
  profile,
  sessionStartedAt,
  currentIp,
  lastLogin,
  previousLogin,
  onSaveProfile,
  saving,
}: Props) {
  const [form, setForm] = useState<ProfileFormData>({
    name: profile.name,
    phone: profile.phone || "",
    city: profile.city || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setForm({
      name: profile.name,
      phone: profile.phone || "",
      city: profile.city || "",
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await onSaveProfile(form);
    } finally {
      setSavingProfile(false);
    }
  };

  const sessionIsToday =
    sessionStartedAt && isSameDay(sessionStartedAt, new Date().toISOString());

  const showRecordedLogin =
    lastLogin &&
    sessionStartedAt &&
    !isSameDay(lastLogin.created_at, sessionStartedAt) &&
    new Date(lastLogin.created_at).getTime() <
      new Date(sessionStartedAt).getTime() - 60_000;

  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
          <UserCog size={28} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold capitalize text-cyan-700 dark:text-cyan-300">
          {profile.role}
        </span>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-700 dark:text-emerald-300">
          {profile.status}
        </span>
        {sessionIsToday && (
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            Sesi aktif
          </span>
        )}
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Sesi masuk (token aktif)</dt>
          <dd className="text-right font-medium">
            {formatDateTime(sessionStartedAt)}
          </dd>
        </div>
        {currentIp && (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">IP sekarang</dt>
            <dd className="font-mono text-xs">{String(currentIp)}</dd>
          </div>
        )}
        {lastLogin && (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Login tercatat di log</dt>
            <dd className="text-right font-medium">
              {formatDateTime(lastLogin.created_at)}
            </dd>
          </div>
        )}
        {lastLogin?.ip_address && (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">IP saat login tercatat</dt>
            <dd className="font-mono text-xs">{lastLogin.ip_address}</dd>
          </div>
        )}
        {showRecordedLogin && previousLogin && (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Login sebelumnya</dt>
            <dd className="text-right text-gray-600 dark:text-gray-400">
              {formatDateTime(previousLogin.created_at)}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-4 text-[11px] text-gray-500">
        Belum update? Logout → login ulang supaya log sistem ikut tercatat hari ini.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-3 border-t border-gray-100 pt-5 dark:border-white/5"
      >
        <div>
          <label className={formLabelClass}>Nama</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={formInputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Telepon</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className={formInputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Kota</label>
          <input
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            className={formInputClass}
          />
        </div>
        <button
          type="submit"
          disabled={savingProfile || saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium hover:border-cyan-200 dark:border-white/10"
        >
          {savingProfile && <Loader2 size={16} className="animate-spin" />}
          Simpan Profil
        </button>
      </form>
    </section>
  );
}
