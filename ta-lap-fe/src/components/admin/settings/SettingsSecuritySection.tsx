"use client";

import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { formInputClass, formLabelClass } from "@/components/admin/lapangan/formStyles";
import SettingsToggle from "@/components/admin/settings/SettingsToggle";
import { PasswordFormData, SettingsFormData } from "@/types/settings";

type Props = {
  form: SettingsFormData;
  onChange: (patch: Partial<SettingsFormData>) => void;
  onChangePassword: (data: PasswordFormData) => Promise<string>;
  saving?: boolean;
};

export default function SettingsSecuritySection({
  form,
  onChange,
  onChangePassword,
  saving,
}: Props) {
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const message = await onChangePassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      return message;
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
          <ShieldCheck size={20} className="text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Keamanan</h2>
          <p className="text-xs text-gray-500">Password admin dan notifikasi login</p>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
        <div>
          <label className={formLabelClass}>Password Lama</label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
              }
              className={formInputClass + " pl-10"}
              autoComplete="current-password"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={formLabelClass}>Password Baru</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
              }
              className={formInputClass}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={formLabelClass}>Konfirmasi Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              className={formInputClass}
              autoComplete="new-password"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={changingPassword || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-gray-900"
        >
          {changingPassword && <Loader2 size={16} className="animate-spin" />}
          Ubah Password
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-white/10">
        <div>
          <h4 className="text-sm font-semibold">Notifikasi Login Admin</h4>
          <p className="text-xs text-gray-500">
            Catat aktivitas login ke log sistem
          </p>
        </div>
        <SettingsToggle
          enabled={form.login_notification}
          onChange={(login_notification) => onChange({ login_notification })}
        />
      </div>
    </section>
  );
}
