"use client";

import { AlertCircle, Loader2, RefreshCw, Settings2 } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import UserPasswordSection from "@/components/user/profile/UserPasswordSection";
import UserProfileForm from "@/components/user/profile/UserProfileForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";

export default function UserProfilePage() {
  const { profile, loading, saving, error, reload, saveProfile, savePassword } =
    useUserProfile();

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b1120] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <UserNavbar active="profile" />

      <section className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              <Settings2 size={14} />
              Pengaturan Akun
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Kelola data pribadi, nomor telepon, kota, dan password akun pemain
              Anda.
            </p>
          </div>

          <button
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat profil...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-8 dark:border-red-500/30 dark:bg-red-500/5">
            <AlertCircle className="text-red-500" size={32} />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={reload}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white"
            >
              Coba Lagi
            </button>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <UserProfileForm
              profile={profile}
              saving={saving}
              onSave={async (form) => {
                try {
                  return await saveProfile(form);
                } catch (err) {
                  throw new Error(getApiErrorMessage(err, "Gagal menyimpan profil"));
                }
              }}
            />
            <UserPasswordSection
              saving={saving}
              onChangePassword={savePassword}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
