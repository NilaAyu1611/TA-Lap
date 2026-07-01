"use client";

import { useCallback, useEffect, useState } from "react";
import { BellRing, BellOff, Loader2 } from "lucide-react";

import {
  getNotificationPermission,
  isPushSupported,
  subscribeBrowserPush,
  unsubscribeBrowserPush,
} from "@/lib/pushNotifications";
import {
  getPushConfig,
  getPushStatus,
  subscribePushSubscription,
  unsubscribePushSubscription,
} from "@/services/notification.service";

type Props = {
  compact?: boolean;
};

export default function PushNotificationToggle({ compact = false }: Props) {
  const [supported, setSupported] = useState(false);
  const [enabledOnServer, setEnabledOnServer] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isPushSupported()) {
      setSupported(false);
      setLoading(false);
      return;
    }

    setSupported(true);

    try {
      const [config, status] = await Promise.all([
        getPushConfig(),
        getPushStatus(),
      ]);
      setEnabledOnServer(config.enabled && Boolean(config.publicKey));
      setSubscribed(status.subscribed);
    } catch {
      setEnabledOnServer(false);
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleEnable = async () => {
    setWorking(true);
    setMessage(null);

    try {
      const config = await getPushConfig();
      if (!config.enabled || !config.publicKey) {
        setMessage("Push belum aktif di server.");
        return;
      }

      const subscription = await subscribeBrowserPush(config.publicKey);
      await subscribePushSubscription(subscription);
      setSubscribed(true);
      setMessage("Notifikasi push aktif di perangkat ini.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal mengaktifkan push."
      );
    } finally {
      setWorking(false);
    }
  };

  const handleDisable = async () => {
    setWorking(true);
    setMessage(null);

    try {
      const endpoint = await unsubscribeBrowserPush();
      await unsubscribePushSubscription(endpoint || undefined);
      setSubscribed(false);
      setMessage("Notifikasi push dinonaktifkan.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal menonaktifkan push."
      );
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return compact ? null : (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Loader2 size={14} className="animate-spin" />
        Memuat push...
      </div>
    );
  }

  if (!supported) {
    return compact ? null : (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Browser ini belum mendukung notifikasi push.
      </p>
    );
  }

  if (!enabledOnServer) {
    return compact ? null : (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Push notification belum dikonfigurasi di server.
      </p>
    );
  }

  const permission = getNotificationPermission();

  if (compact) {
    return (
      <button
        type="button"
        onClick={subscribed ? handleDisable : handleEnable}
        disabled={working || permission === "denied"}
        title={
          permission === "denied"
            ? "Izin notifikasi diblokir di browser"
            : subscribed
              ? "Nonaktifkan popup notifikasi"
              : "Aktifkan popup notifikasi"
        }
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/5"
      >
        {working ? (
          <Loader2 size={14} className="animate-spin" />
        ) : subscribed ? (
          <BellOff size={14} />
        ) : (
          <BellRing size={14} />
        )}
        {subscribed ? "Matikan popup notifikasi" : "Aktifkan popup notifikasi"}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Popup notifikasi
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Dapat pengingat langsung di layar meski tab TA-LAP ditutup.
          </p>
        </div>
        {working && <Loader2 size={16} className="animate-spin text-cyan-500" />}
      </div>

      <button
        type="button"
        onClick={subscribed ? handleDisable : handleEnable}
        disabled={working || permission === "denied"}
        className="mt-3 w-full rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-400"
      >
        {permission === "denied"
          ? "Izin diblokir di browser"
          : subscribed
            ? "Nonaktifkan popup"
            : "Aktifkan popup notifikasi"}
      </button>

      {message && (
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}
