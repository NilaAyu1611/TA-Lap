"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Menu, Search, Settings } from "lucide-react";

import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { AuthUser, getStoredUser } from "@/lib/auth";

interface AdminNavbarProps {
  setMobileOpen: (value: boolean) => void;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "A";
}

export default function AdminNavbar({ setMobileOpen }: AdminNavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [admin, setAdmin] = useState<AuthUser | null>(null);

  useEffect(() => {
    const sync = () => setAdmin(getStoredUser());
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("auth-user-updated", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("auth-user-updated", sync);
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    const keyword = q.toLowerCase();
    const navShortcuts: Record<string, string> = {
      owner: "/admin/owners",
      owners: "/admin/owners",
      user: "/admin/users",
      users: "/admin/users",
      pesanan: "/admin/pesanan",
      booking: "/admin/pesanan",
      lapangan: "/admin/lapangan",
      transaksi: "/admin/transaksi",
      laporan: "/admin/laporan",
      settings: "/admin/settings",
      pengaturan: "/admin/settings",
    };

    setSearchQuery("");

    if (navShortcuts[keyword]) {
      router.push(navShortcuts[keyword]);
      return;
    }

    if (/^BK-/i.test(q)) {
      router.push(`/admin/pesanan?q=${encodeURIComponent(q)}`);
      return;
    }

    if (q.includes("@")) {
      router.push(`/admin/owners?q=${encodeURIComponent(q)}`);
      return;
    }

    router.push(`/admin/pesanan?q=${encodeURIComponent(q)}`);
  };

  const displayName = admin?.name || "Admin";

  return (
    <header data-print-hide className="sticky top-0 z-30 border-b border-slate-200/90 bg-white shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-[#020817]/95 dark:shadow-none">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>

          <BrandLogo
            href="/admin/dashboard"
            subtitle="Management System"
            accent="cyan"
            className="lg:hidden"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <form
            onSubmit={handleSearch}
            className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500/15 xl:flex xl:w-[320px] dark:border-white/10 dark:bg-white/5 dark:focus-within:border-cyan-500/50"
          >
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode booking, nama, email..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-gray-500"
              aria-label="Cari data admin"
            />
          </form>

          <ThemeToggle />

          <Link
            href="/admin/settings"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label="Pengaturan"
          >
            <Settings size={20} />
          </Link>

          <AdminNotificationBell />

          <Link
            href="/admin/settings"
            className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-cyan-200 hover:bg-white lg:flex dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-bold text-cyan-500">
              {initials(displayName)}
            </div>
            <div className="text-left">
              <p className="max-w-[140px] truncate text-sm font-semibold">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
