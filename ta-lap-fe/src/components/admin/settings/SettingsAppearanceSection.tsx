"use client";

import { Moon, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { formLabelClass, formSelectClass } from "@/components/admin/lapangan/formStyles";
import SettingsToggle from "@/components/admin/settings/SettingsToggle";
import { applyTheme, getStoredTheme, type ThemeMode } from "@/lib/theme";
import { SettingsFormData } from "@/types/settings";

type Props = {
  form: SettingsFormData;
  onChange: (patch: Partial<SettingsFormData>) => void;
};

export default function SettingsAppearanceSection({ form, onChange }: Props) {
  const [darkMode, setDarkMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    setDarkMode(getStoredTheme());
  }, []);

  const handleThemeToggle = (enabled: boolean) => {
    const mode: ThemeMode = enabled ? "dark" : "light";
    applyTheme(mode);
    setDarkMode(mode);
  };

  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
          <Palette size={20} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Tampilan</h2>
          <p className="text-xs text-gray-500">Tema dashboard dan bahasa sistem</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-cyan-500" />
            <div>
              <h4 className="text-sm font-semibold">Dark Mode</h4>
              <p className="text-xs text-gray-500">Tema gelap panel admin (perangkat ini)</p>
            </div>
          </div>
          <SettingsToggle
            enabled={darkMode === "dark"}
            onChange={handleThemeToggle}
          />
        </div>

        <div>
          <label className={formLabelClass}>Bahasa Sistem</label>
          <select
            value={form.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className={formSelectClass}
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </section>
  );
}
