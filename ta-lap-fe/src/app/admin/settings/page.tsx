"use client";

import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  Settings2,
} from "lucide-react";
import { useState } from "react";

import SettingsAppearanceSection from "@/components/admin/settings/SettingsAppearanceSection";
import SettingsBackupSection from "@/components/admin/settings/SettingsBackupSection";
import SettingsBusinessSection from "@/components/admin/settings/SettingsBusinessSection";
import SettingsGeneralSection from "@/components/admin/settings/SettingsGeneralSection";
import SettingsNotificationsSection from "@/components/admin/settings/SettingsNotificationsSection";
import SettingsProfileCard from "@/components/admin/settings/SettingsProfileCard";
import SettingsSecuritySection from "@/components/admin/settings/SettingsSecuritySection";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { useSettings } from "@/hooks/useSettings";
import { formatDate, formatTime } from "@/lib/auth";

export default function AdminSettingsPage() {
  const {
    data,
    form,
    loading,
    refreshing,
    saving,
    backingUp,
    error,
    reload,
    updateForm,
    saveSettings,
    saveProfile,
    savePassword,
    runBackup,
  } = useSettings();

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveSettings = async () => {
    try {
      const message = await saveSettings();
      showToast("success", message || "Pengaturan berhasil disimpan");
    } catch (err) {
      showToast("error", getApiErrorMessage(err));
    }
  };

  const handleSaveProfile = async (
    profileForm: Parameters<typeof saveProfile>[0]
  ) => {
    try {
      const message = await saveProfile(profileForm);
      showToast("success", message || "Profil berhasil diperbarui");
      return message;
    } catch (err) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  const handleChangePassword = async (
    passwordForm: Parameters<typeof savePassword>[0]
  ) => {
    try {
      const message = await savePassword(passwordForm);
      showToast("success", message || "Password berhasil diubah");
      return message;
    } catch (err) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  const handleBackup = async () => {
    try {
      const message = await runBackup();
      showToast("success", message || "Backup berhasil dibuat");
      return message;
    } catch (err) {
      showToast("error", getApiErrorMessage(err));
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Memuat pengaturan sistem...</span>
        </div>
      </div>
    );
  }

  if (error || !data || !form) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
        </div>
        <div>
          <p className="font-semibold">Gagal memuat pengaturan</p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={reload}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
        >
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed right-6 top-24 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              <Settings2 size={14} />
              Admin Settings
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Pengaturan Sistem
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Kelola konfigurasi platform, komisi bisnis, keamanan admin,
              notifikasi, dan backup data. Semua data live dari database.
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  refreshing ? "animate-pulse bg-cyan-400" : "bg-emerald-500"
                }`}
              />
              {refreshing ? "Memperbarui..." : "Live"}
              {data.fetchedAt && (
                <>
                  {" · "}
                  Diperbarui {formatDate(data.fetchedAt)},{" "}
                  {formatTime(data.fetchedAt)}
                </>
              )}
            </p>
          </div>
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SettingsGeneralSection form={form} onChange={updateForm} />
          <SettingsBusinessSection form={form} onChange={updateForm} />
          <SettingsSecuritySection
            form={form}
            onChange={updateForm}
            onChangePassword={handleChangePassword}
            saving={saving}
          />
          <SettingsAppearanceSection form={form} onChange={updateForm} />
        </div>

        <div className="space-y-6">
          <SettingsProfileCard
            profile={data.profile}
            sessionStartedAt={data.sessionStartedAt}
            currentIp={data.currentIp}
            lastLogin={data.lastLogin}
            previousLogin={data.previousLogin}
            onSaveProfile={handleSaveProfile}
            saving={saving}
          />
          <SettingsNotificationsSection form={form} onChange={updateForm} />
          <SettingsBackupSection
            backups={data.backups}
            onBackup={handleBackup}
            backingUp={backingUp}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-white/10">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Simpan Pengaturan Platform
        </button>
      </div>
    </div>
  );
}
