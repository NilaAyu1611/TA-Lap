"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Receipt,
  ScrollText,
  Settings2,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import UserNotificationBell from "@/components/user/UserNotificationBell";
import { getStoredUser, handleLogout } from "@/lib/auth";

type UserNavbarProps = {
  active?: string;
};

const NAV_ITEMS = [
  { id: "dashboard", href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "lapangan", href: "/user/lapangan", label: "Lapangan", icon: MapPinned },
  { id: "pesanan", href: "/user/pesanan", label: "Pesanan", icon: CalendarDays },
  { id: "pembayaran", href: "/user/pembayaran", label: "Bayar", icon: Receipt },
  { id: "transaksi", href: "/user/transaksi", label: "Transaksi", icon: ScrollText },
] as const;

export default function UserNavbar({ active }: UserNavbarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getStoredUser();
    setUserName(user?.name ?? null);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const menuClass = (menu: string) =>
    active === menu
      ? "flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20"
      : "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-cyan-500/10 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400";

  const initial = (userName || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1120]/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-8">
          <BrandLogo
            href="/user/dashboard"
            subtitle="Booking Lapangan"
            accent="cyan"
          />

          <nav className="hidden min-w-0 items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ id, href, label, icon: Icon }) => (
              <Link key={id} href={href} className={menuClass(id)}>
                <Icon size={17} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <UserNotificationBell />

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm font-medium transition ${
                profileOpen || active === "profile"
                  ? "border-cyan-400 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                  : "border-gray-200 bg-white text-gray-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
              }`}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-bold text-cyan-700 dark:text-cyan-300">
                {initial}
              </span>
              <span className="hidden max-w-[100px] truncate sm:inline">
                {userName || "Akun"}
              </span>
              <ChevronDown
                size={16}
                className={`hidden text-gray-400 transition sm:block ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-[#0f172a]">
                <div className="border-b border-gray-100 px-4 py-3 dark:border-white/10">
                  <p className="truncate text-sm font-semibold">{userName || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Akun pemain</p>
                </div>
                <Link
                  href="/user/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                >
                  <Settings2 size={16} />
                  Profil & Pengaturan
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 md:hidden dark:border-white/5">
        {NAV_ITEMS.map(({ id, href, label, icon: Icon }) => (
          <Link key={id} href={href} className={`shrink-0 ${menuClass(id)}`}>
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
