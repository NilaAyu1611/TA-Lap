"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  changeAdminPassword,
  createSystemBackup,
  getSettings,
  updateAdminProfile,
  updateSettings,
} from "@/services/settings.service";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import {
  PasswordFormData,
  PlatformSettings,
  ProfileFormData,
  SettingsFormData,
  SettingsResponse,
} from "@/types/settings";
import { storeUser, getStoredUser } from "@/lib/auth";

const REFRESH_MS = 30_000;

function toFormData(settings: PlatformSettings): SettingsFormData {
  return {
    app_name: settings.app_name,
    app_email: settings.app_email || "",
    app_phone: settings.app_phone || "",
    komisi_persen: settings.komisi_persen,
    batal_potongan_persen: settings.batal_potongan_persen ?? 25,
    timezone: settings.timezone,
    language: settings.language,
    maintenance_mode: settings.maintenance_mode,
    booking_notification: settings.booking_notification,
    owner_notification: settings.owner_notification,
    payment_notification: settings.payment_notification,
    backup_notification: settings.backup_notification,
    login_notification: settings.login_notification,
    auto_payout_enabled: settings.auto_payout_enabled ?? true,
    platform_bank_code: settings.platform_bank_code || "",
    platform_bank_account_number: settings.platform_bank_account_number || "",
    platform_bank_account_holder: settings.platform_bank_account_holder || "",
    platform_ewallet_note: settings.platform_ewallet_note || "",
  };
}

export function useSettings() {
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [form, setForm] = useState<SettingsFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savingRef = useRef(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);
    try {
      const result = await getSettings();
      setData(result);
      if (!savingRef.current) {
        setForm(toFormData(result.settings));
      }
    } catch (err) {
      if (!silent) {
        setData(null);
        setForm(null);
      }
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!savingRef.current) {
        load(true);
      }
    }, REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible" && !savingRef.current) {
        load(true);
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const updateForm = (patch: Partial<SettingsFormData>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const saveSettings = async () => {
    if (!form) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const result = await updateSettings(form);
      await load(true);
      return result.message;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const saveProfile = async (profileForm: ProfileFormData) => {
    savingRef.current = true;
    setSaving(true);
    try {
      const result = await updateAdminProfile(profileForm);
      const stored = getStoredUser();
      if (stored) {
        storeUser({ ...stored, ...result.profile });
        window.dispatchEvent(new CustomEvent("auth-user-updated"));
      }
      await load(true);
      return result.message;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const savePassword = async (passwordForm: PasswordFormData) => {
    savingRef.current = true;
    setSaving(true);
    try {
      const result = await changeAdminPassword(passwordForm);
      await load(true);
      return result.message;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const runBackup = async () => {
    setBackingUp(true);
    try {
      const result = await createSystemBackup();

      const blob = new Blob([JSON.stringify(result.download, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.fileName;
      link.click();
      URL.revokeObjectURL(url);

      await load(true);
      return result.message;
    } finally {
      setBackingUp(false);
    }
  };

  return {
    data,
    form,
    loading,
    refreshing,
    saving,
    backingUp,
    error,
    reload: () => load(),
    updateForm,
    saveSettings,
    saveProfile,
    savePassword,
    runBackup,
  };
}
