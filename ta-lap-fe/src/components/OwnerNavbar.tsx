"use client";

import Link from "next/link";

import {
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

type OwnerNavbarProps = {
  active?: string;
};

export default function OwnerNavbar({
  active,
}: OwnerNavbarProps) {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const menuClass = (menu: string) =>
    active === menu
      ? `
        text-sm
        font-semibold
        text-cyan-500
      `
      : `
        text-sm
        font-medium

        text-gray-600
        dark:text-gray-300

        hover:text-cyan-500
        transition
      `;

  return (
    <header
      className="
        sticky
        top-0
        z-50

        border-b
        border-gray-200/70
        dark:border-white/10

        bg-white/80
        dark:bg-[#020817]/80

        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between

          px-6
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-12">
          {/* LOGO */}
          <div>
            <h1
              className="
                bg-gradient-to-r
                from-cyan-500
                to-blue-500

                bg-clip-text
                text-2xl
                font-black
                tracking-tight
                text-transparent
              "
            >
              TA-LAP OWNER
            </h1>

            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Smart Venue Management
            </p>
          </div>

          {/* MENU */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/owner/dashboard"
              className={menuClass("dashboard")}
            >
              Dashboard
            </Link>

            <Link
              href="/owner/lapangan"
              className={menuClass("lapangan")}
            >
              Lapangan
            </Link>

            <Link
              href="/owner/pesanan"
              className={menuClass("pesanan")}
            >
              Pesanan
            </Link>

            <Link
              href="/owner/pembayaran"
              className={menuClass("pembayaran")}
            >
              Pembayaran
            </Link>

            <Link
              href="/owner/laporan"
              className={menuClass("laporan")}
            >
              Laporan
            </Link>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* NOTIF */}
          <button
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              transition
              hover:border-cyan-500/40
            "
          >
            <Bell size={18} />

            <span
              className="
                absolute
                right-2
                top-2

                h-2
                w-2

                rounded-full
                bg-red-500
              "
            />
          </button>

          {/* LOGOUT */}
          <button
            className="
              hidden
              md:flex

              items-center
              gap-2

              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              px-4
              py-2.5

              text-sm
              font-medium

              transition-all

              hover:border-red-500
              hover:text-red-500
            "
          >
            <LogOut size={18} />
            Logout
          </button>

          {/* MOBILE */}
          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="
              flex
              lg:hidden

              h-11
              w-11

              items-center
              justify-center

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10
            "
          >
            {mobileMenu ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div
          className="
            border-t
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#020817]

            px-6
            py-5

            lg:hidden
          "
        >
          <div className="flex flex-col gap-5">
            <Link href="/owner/dashboard">
              Dashboard
            </Link>

            <Link href="/owner/lapangan">
              Lapangan
            </Link>

            <Link href="/owner/pesanan">
              Pesanan
            </Link>

            <Link href="/owner/pembayaran">
              Pembayaran
            </Link>

            <Link href="/owner/laporan">
              Laporan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}