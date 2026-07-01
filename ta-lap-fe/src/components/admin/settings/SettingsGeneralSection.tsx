"use client";

import { Globe } from "lucide-react";
import {
  formInputClass,
  formLabelClass,
  formSelectClass,
} from "@/components/admin/lapangan/formStyles";
import { SettingsFormData } from "@/types/settings";

const timezones = [
  { value: "Asia/Jakarta", label: "WIB — Asia/Jakarta" },
  { value: "Asia/Makassar", label: "WITA — Asia/Makassar" },
  { value: "Asia/Jayapura", label: "WIT — Asia/Jayapura" },
];

type Props = {
  form: SettingsFormData;
  onChange: (patch: Partial<SettingsFormData>) => void;
};

export default function SettingsGeneralSection({ form, onChange }: Props) {
  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
          <Globe size={20} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Pengaturan Umum</h2>
          <p className="text-xs text-gray-500">Identitas dan kontak platform</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={formLabelClass}>Nama Platform</label>
          <input
            type="text"
            value={form.app_name}
            onChange={(e) => onChange({ app_name: e.target.value })}
            className={formInputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Email Sistem</label>
          <input
            type="email"
            value={form.app_email}
            onChange={(e) => onChange({ app_email: e.target.value })}
            className={formInputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Nomor Admin / Support</label>
          <input
            type="text"
            value={form.app_phone}
            onChange={(e) => onChange({ app_phone: e.target.value })}
            className={formInputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Zona Waktu</label>
          <select
            value={form.timezone}
            onChange={(e) => onChange({ timezone: e.target.value })}
            className={formSelectClass}
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
