"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  CalendarDays,
  Wallet,
  Users,
  Building2,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  BadgeDollarSign,
  ShieldCheck,
  Clock3,
  Star,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import OwnerNavbar from "@/components/OwnerNavbar";

export default function OwnerDashboardPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <main
      className="
        relative
        min-h-screen       

        bg-gradient-to-br
        from-slate-100
        via-white
        to-cyan-50

        text-gray-900

        dark:from-[#020617]
        dark:via-[#0b1120]
        dark:to-[#071329]

        dark:text-white

        transition-all
        duration-300
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          top-[-200px]
          left-[-200px]

          h-[500px]
          w-[500px]

          rounded-full

          bg-cyan-500/10

          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-200px]
          right-[-200px]

          h-[500px]
          w-[500px]

          rounded-full

          bg-purple-500/10

          blur-3xl
        "
      />

      {/* NAVBAR */}
      <OwnerNavbar active="dashboard" />

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <div
          className="
            relative
            overflow-hidden

            rounded-[32px]

            border
            border-gray-200
            dark:border-white/10

            bg-white/80
            dark:bg-white/5

            backdrop-blur-xl

            p-8
            md:p-10

            shadow-xl
            shadow-cyan-500/5
          "
        >
          {/* HERO GLOW */}
          <div
            className="
              absolute
              right-[-100px]
              top-[-100px]

              h-72
              w-72

              rounded-full

              bg-cyan-500/10

              blur-3xl
            "
          />

          <div className="relative z-10">
            <div
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-cyan-500/10

                px-4
                py-2

                text-sm
                font-medium
                text-cyan-500
              "
            >
              <ShieldCheck size={16} />
              OWNER PANEL
            </div>

            <h2
              className="
                mt-6

                max-w-3xl

                text-4xl
                font-bold
                tracking-tight

                md:text-5xl
              "
            >
              Kelola Bisnis Lapangan Anda Dengan Mudah
            </h2>

            <p
              className="
                mt-5
                max-w-2xl

                text-base
                leading-8

                text-gray-600
                dark:text-gray-300
              "
            >
              Monitor booking realtime, pendapatan, jadwal lapangan,
              transaksi pembayaran, serta aktivitas pelanggan dalam
              satu dashboard modern dan profesional.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="
                  rounded-2xl

                  bg-cyan-500

                  px-6
                  py-3

                  text-sm
                  font-semibold
                  text-white

                  shadow-lg
                  shadow-cyan-500/30

                  transition-all
                  duration-300

                  hover:scale-105
                  hover:bg-cyan-400
                "
              >
                Kelola Lapangan
              </button>

              <button
                className="
                  rounded-2xl

                  border
                  border-gray-300
                  dark:border-white/10

                  bg-white/80
                  dark:bg-white/5

                  backdrop-blur-xl

                  px-6
                  py-3

                  text-sm
                  font-semibold

                  transition-all
                  duration-300

                  hover:border-cyan-500
                  hover:scale-105
                "
              >
                Lihat Laporan
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
            mt-10

            grid
            gap-6

            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {[
            {
              title: "Total Booking",
              value: "245",
              icon: <CalendarDays className="text-cyan-500" />,
              color: "bg-cyan-500/10",
              info: "+18% bulan ini",
            },
            {
              title: "Pendapatan",
              value: "Rp 12.5jt",
              icon: <Wallet className="text-purple-500" />,
              color: "bg-purple-500/10",
              info: "Pendapatan meningkat",
            },
            {
              title: "Pelanggan",
              value: "89",
              icon: <Users className="text-pink-500" />,
              color: "bg-pink-500/10",
              info: "Rating sangat baik",
            },
            {
              title: "Lapangan Aktif",
              value: "6",
              icon: <Building2 className="text-orange-500" />,
              color: "bg-orange-500/10",
              info: "Jadwal padat hari ini",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="
                rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl

                p-6

                transition-all
                duration-300

                hover:-translate-y-2
                hover:shadow-2xl
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    ${card.color}
                  `}
                >
                  {card.icon}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-green-500">
                <TrendingUp size={16} />
                {card.info}
              </div>
            </div>
          ))}
        </div>

        {/* GRID */}
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">
            <div
              className="
                rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl

                p-6
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Booking Terbaru
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Aktivitas booking terbaru pelanggan.
                  </p>
                </div>

                <button
                  className="
                    flex
                    items-center
                    gap-2

                    text-sm
                    font-medium
                    text-cyan-500
                  "
                >
                  Lihat Semua
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      flex-col
                      justify-between
                      gap-4

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-white/50
                      dark:bg-white/[0.03]

                      p-4

                      backdrop-blur-xl

                      md:flex-row
                      md:items-center
                    "
                  >
                    <div>
                      <h4 className="font-semibold">
                        Booking Lapangan Futsal A
                      </h4>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ahmad • 19 Mei 2026 • 19:00 - 21:00
                      </p>
                    </div>

                    <span
                      className="
                        inline-flex
                        items-center

                        rounded-full

                        bg-green-500/10

                        px-4
                        py-2

                        text-sm
                        font-medium
                        text-green-500
                      "
                    >
                      Dibayar
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* REVENUE */}
            <div
              className="
                rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl

                p-6
              "
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Pendapatan Hari Ini
                </h3>

                <BadgeDollarSign className="text-green-500" />
              </div>

              <h2 className="mt-6 text-4xl font-bold">
                Rp 1.250.000
              </h2>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Total transaksi berhasil hari ini.
              </p>
            </div>

            {/* QUICK ACTION */}
            <div
              className="
                rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl

                p-6
              "
            >
              <h3 className="text-lg font-semibold">
                Quick Actions
              </h3>

              <div className="mt-5 space-y-4">
                {[
                  "Tambah Lapangan",
                  "Lihat Pesanan",
                  "Kelola Jadwal",
                ].map((item) => (
                  <button
                    key={item}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-white/50
                      dark:bg-white/[0.03]

                      px-4
                      py-4

                      backdrop-blur-xl

                      transition-all
                      duration-300

                      hover:border-cyan-500/30
                      hover:translate-x-1
                    "
                  >
                    <span>{item}</span>

                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}