"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  LogOut,
  Menu,
  Settings2,
  User2,
  X,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import OwnerNotificationBell from "@/components/owner/OwnerNotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import { getStoredUser, handleLogout } from "@/lib/auth";

type OwnerNavbarProps = {
  active?: string;
};

export default function OwnerNavbar({ active }: OwnerNavbarProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    setUserName(user?.name ?? null);
  }, []);

  const menuClass = (menu: string) =>
    active === menu
      ? "text-sm font-semibold text-violet-600 dark:text-violet-400"
      : "text-sm font-medium text-gray-600 transition hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400";

  const navLinks = [
    { href: "/owner/dashboard", key: "dashboard", label: "Dashboard" },
    { href: "/owner/lapangan", key: "lapangan", label: "Lapangan" },
    { href: "/owner/pesanan", key: "pesanan", label: "Pesanan" },
    { href: "/owner/pembayaran", key: "pembayaran", label: "Pembayaran" },
    {
      href: "/owner/setoran-tunai",
      key: "setoran-tunai",
      label: "Setoran Bulanan",
    },
    { href: "/owner/laporan", key: "laporan", label: "Laporan" },
  ];

  return (
    <header data-print-hide className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#020817]/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <BrandLogo
            href="/owner/dashboard"
            subtitle="Owner · Venue Management"
            accent="violet"
          />

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={menuClass(item.key)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <OwnerNotificationBell />

          <Link
            href="/owner/profile"
            className={`hidden items-center gap-2 rounded-2xl border px-3 py-2 transition md:flex ${
              active === "profile"
                ? "border-violet-300 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10"
                : "border-gray-200 bg-white hover:border-violet-200 dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <User2 size={16} />
            </div>
            <div className="max-w-[120px] truncate text-left">
              <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                {userName || "Owner"}
              </p>
              <p className="text-[10px] text-gray-500">Profil & Bisnis</p>
            </div>
          </Link>

          <Link
            href="/owner/profile"
            className={`hidden rounded-2xl p-2.5 md:hidden ${
              active === "profile" ? "text-violet-600" : "text-gray-500"
            }`}
            aria-label="Profil"
          >
            <Settings2 size={20} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition-all hover:border-red-500 hover:text-red-500 dark:border-white/10 md:flex"
          >
            <LogOut size={18} />
            Logout
          </button>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 lg:hidden"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white px-6 py-5 dark:border-white/10 dark:bg-[#020817] lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={menuClass(item.key)}
                onClick={() => setMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/owner/profile"
              className={`inline-flex items-center gap-2 ${menuClass("profile")}`}
              onClick={() => setMobileMenu(false)}
            >
              <Settings2 size={16} />
              Profil & Bisnis
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-left text-sm font-medium text-red-500"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
