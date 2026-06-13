"use client";

import Link from "next/link";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Receipt,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import { handleLogout } from "@/lib/auth";

type UserNavbarProps = {
  active?: string;
};

export default function UserNavbar({
  active,
}: UserNavbarProps) {
  const menuClass = (menu: string) =>
    active === menu
      ? `
        flex
        items-center
        gap-2

        rounded-xl

        bg-cyan-500

        px-4
        py-2

        text-sm
        font-medium
        text-white

        shadow-lg
        shadow-cyan-500/20
      `
      : `
        flex
        items-center
        gap-2

        rounded-xl

        px-4
        py-2

        text-sm
        font-medium

        text-gray-600
        dark:text-gray-300

        transition-all
        duration-300

        hover:bg-cyan-500/10
        hover:text-cyan-600

        dark:hover:text-cyan-400
      `;

  return (
    <header
      className="
        sticky
        top-0
        z-50

        border-b

        border-gray-200
        dark:border-white/10

        bg-white/80
        dark:bg-[#0b1120]/70

        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between

          px-6
          py-4
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* LOGO */}
          <Link
            href="/user/dashboard"
            className="
              text-2xl
              font-bold
              tracking-tight

              text-cyan-600
              dark:text-cyan-400
            "
          >
            TA-LAP
          </Link>

          {/* MENU */}
          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/user/dashboard"
              className={menuClass("dashboard")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/user/lapangan"
              className={menuClass("lapangan")}
            >
              <MapPinned size={18} />
              Lapangan
            </Link>

            <Link
              href="/user/pesanan"
              className={menuClass("pesanan")}
            >
              <CalendarDays size={18} />
              Pesanan
            </Link>

            <Link
              href="/user/pembayaran"
              className={menuClass("pembayaran")}
            >
              <Receipt size={18} />
              Pembayaran
            </Link>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-2

              rounded-xl

              border
              border-gray-300
              dark:border-white/10

              bg-white
              dark:bg-white/5

              px-4
              py-2

              text-sm
              font-medium

              text-gray-700
              dark:text-gray-200

              transition-all
              duration-300

              hover:border-red-400
              hover:text-red-500
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}