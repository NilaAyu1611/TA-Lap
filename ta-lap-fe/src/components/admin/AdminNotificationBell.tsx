"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";
import { AppNotification } from "@/types/notification";
import PushNotificationToggle from "@/components/notifications/PushNotificationToggle";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Baru saja";
  if (min < 60) return `${min} mnt lalu`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} jam lalu`;
  const day = Math.floor(hour / 24);
  return `${day} hari lalu`;
}

export default function AdminNotificationBell() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getMyNotifications(25);
      setItems(result.data);
      setUnreadCount(result.unreadCount);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleOpenItem = async (item: AppNotification) => {
    if (!item.is_read) {
      try {
        await markNotificationRead(item.id);
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        /* continue */
      }
    }
    setOpen(false);
    if (item.link) router.push(item.link);
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        aria-label="Notifikasi"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
            <p className="font-semibold text-gray-900 dark:text-white">
              Notifikasi
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
              >
                <CheckCheck size={14} />
                Tandai dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                Memuat...
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                Belum ada notifikasi
              </p>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className={`w-full border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5 ${
                    !item.is_read ? "bg-cyan-50/50 dark:bg-cyan-500/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!item.is_read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                    )}
                    <div className={!item.is_read ? "" : "pl-4"}>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                        {item.message}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {formatRelativeTime(item.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-2 dark:border-white/10">
            <PushNotificationToggle compact />
            <Link
              href="/admin/owners?review=pending"
              onClick={() => setOpen(false)}
              className="block py-2 text-center text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
            >
              Owner menunggu verifikasi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
