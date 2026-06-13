"use client";

import Link from "next/link";

import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Receipt,
  Trophy,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import UserNavbar from "@/components/UserNavbar";

export default function UserDashboard() {
  return (
    <main
      className="
        min-h-screen

        bg-gray-50
        text-gray-900

        dark:bg-[#0b1120]
        dark:text-white

        transition-all
        duration-300
      "
    >
      {/* NAVBAR */}
      <UserNavbar active="dashboard" />

      {/* CONTENT */}
      <section
        className="
          mx-auto
          max-w-7xl

          px-6
          py-10
        "
      >
        {/* HERO */}
        <div
          className="
            relative
            overflow-hidden

            rounded-3xl

            border

            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-8

            shadow-sm
            dark:shadow-none
          "
        >
          {/* GLOW */}
          <div
            className="
              absolute
              right-[-100px]
              top-[-100px]

              h-64
              w-64

              rounded-full
              bg-cyan-500/10

              blur-3xl
            "
          />

          <div className="relative z-10">
            <p
              className="
                text-sm
                font-medium

                text-cyan-500
              "
            >
              USER DASHBOARD
            </p>

            <h2
              className="
                mt-3

                text-4xl
                font-bold
                tracking-tight
              "
            >
              Selamat Datang di TA-LAP
            </h2>

            <p
              className="
                mt-4
                max-w-2xl

                text-base
                leading-8

                text-gray-600
                dark:text-gray-300
              "
            >
              Kelola booking lapangan, pembayaran, dan aktivitas reservasi Anda
              secara realtime melalui dashboard modern yang cepat dan efisien.
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div
          className="
            mt-10

            grid
            gap-6

            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {/* CARD */}
          <div
            className="
              rounded-3xl
              border

              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              p-6

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-cyan-500/30
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-cyan-500/10
              "
            >
              <LayoutDashboard className="text-cyan-500" />
            </div>

            <h3
              className="
                mt-6

                text-xl
                font-semibold
              "
            >
              Dashboard Aktivitas
            </h3>

            <p
              className="
                mt-3

                text-sm
                leading-7

                text-gray-600
                dark:text-gray-400
              "
            >
              Lihat ringkasan aktivitas booking dan status reservasi Anda.
            </p>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-3xl
              border

              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              p-6

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-cyan-500/30
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-purple-500/10
              "
            >
              <CalendarDays className="text-purple-500" />
            </div>

            <h3
              className="
                mt-6

                text-xl
                font-semibold
              "
            >
              Booking Lapangan
            </h3>

            <p
              className="
                mt-3

                text-sm
                leading-7

                text-gray-600
                dark:text-gray-400
              "
            >
              Pesan lapangan futsal atau badminton dengan sistem realtime anti
              bentrok.
            </p>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-3xl
              border

              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              p-6

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-cyan-500/30
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-pink-500/10
              "
            >
              <CreditCard className="text-pink-500" />
            </div>

            <h3
              className="
                mt-6

                text-xl
                font-semibold
              "
            >
              Pembayaran
            </h3>

            <p
              className="
                mt-3

                text-sm
                leading-7

                text-gray-600
                dark:text-gray-400
              "
            >
              Kelola transaksi dan pembayaran booking secara aman dan cepat.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
