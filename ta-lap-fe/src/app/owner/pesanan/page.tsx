"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  LogOut,
  Menu,
  Search,
  User2,
  X,
  XCircle,
} from "lucide-react";

import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

const pesananData = [
  {
    id: 1,
    customer: "Ahmad Fauzi",
    lapangan: "Futsal Arena A",
    tanggal: "19 Mei 2026",
    jam: "19:00 - 21:00",
    pembayaran: "QRIS",
    total: "Rp 250.000",
    status: "dibayar",
  },
  {
    id: 2,
    customer: "Rizky Ramadhan",
    lapangan: "Badminton Court B",
    tanggal: "20 Mei 2026",
    jam: "13:00 - 15:00",
    pembayaran: "Transfer",
    total: "Rp 180.000",
    status: "pending",
  },
  {
    id: 3,
    customer: "Dimas Saputra",
    lapangan: "Mini Soccer Elite",
    tanggal: "20 Mei 2026",
    jam: "20:00 - 22:00",
    pembayaran: "Tunai",
    total: "Rp 500.000",
    status: "selesai",
  },
];

export default function OwnerPesananPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        text-gray-900

        dark:bg-[#020817]
        dark:text-white

        transition-all
        duration-300
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          fixed
          inset-0
          -z-10

          bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_25%)]
        "
      />

      {/* NAVBAR */}
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
                className="
                  text-sm
                  font-medium

                  text-gray-600
                  dark:text-gray-300

                  hover:text-cyan-500
                  transition
                "
              >
                Dashboard
              </Link>

              <Link
                href="/owner/lapangan"
                className="
                  text-sm
                  font-medium

                  text-gray-600
                  dark:text-gray-300

                  hover:text-cyan-500
                  transition
                "
              >
                Lapangan
              </Link>

              <Link
                href="/owner/pesanan"
                className="
                  text-sm
                  font-semibold
                  text-cyan-500
                "
              >
                Pesanan
              </Link>

              <Link
                href="/owner/pembayaran"
                className="
                  text-sm
                  font-medium

                  text-gray-600
                  dark:text-gray-300

                  hover:text-cyan-500
                  transition
                "
              >
                Pembayaran
              </Link>

              <Link
                href="/owner/laporan"
                className="
                  text-sm
                  font-medium

                  text-gray-600
                  dark:text-gray-300

                  hover:text-cyan-500
                  transition
                "
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
              onClick={() => setMobileMenu(!mobileMenu)}
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
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
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
              <Link href="/owner/dashboard">Dashboard</Link>
              <Link href="/owner/lapangan">Lapangan</Link>
              <Link href="/owner/pesanan">Pesanan</Link>
              <Link href="/owner/pembayaran">Pembayaran</Link>
              <Link href="/owner/laporan">Laporan</Link>
            </div>
          </div>
        )}
      </header>

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

            rounded-[32px]

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-8
            md:p-10

            shadow-sm
          "
        >
          {/* GLOW */}
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
                font-semibold
                text-cyan-500
              "
            >
              <CalendarDays size={16} />
              OWNER PESANAN
            </div>

            <h2
              className="
                mt-6

                text-4xl
                font-black
                tracking-tight

                md:text-5xl
              "
            >
              Kelola Semua Pesanan Pelanggan
            </h2>

            <p
              className="
                mt-5
                max-w-3xl

                text-base
                leading-8

                text-gray-600
                dark:text-gray-300
              "
            >
              Monitor seluruh aktivitas booking, status pembayaran,
              dan jadwal lapangan secara realtime melalui panel owner.
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div
          className="
            mt-10

            flex
            flex-col
            gap-4

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* SEARCH */}
          <div
            className="
              flex
              items-center
              gap-3

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              px-4
              py-3

              lg:w-[350px]
            "
          >
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari pesanan..."
              className="
                w-full
                bg-transparent
                outline-none

                placeholder:text-gray-400
              "
            />
          </div>

          {/* FILTER BUTTON */}
          <div className="flex flex-wrap gap-3">
            <button
              className="
                rounded-2xl
                bg-cyan-500
                px-5
                py-3
                text-sm
                font-semibold
                text-white
              "
            >
              Semua
            </button>

            <button
              className="
                rounded-2xl
                border
                border-gray-300
                dark:border-white/10

                px-5
                py-3

                text-sm
                font-medium
              "
            >
              Pending
            </button>

            <button
              className="
                rounded-2xl
                border
                border-gray-300
                dark:border-white/10

                px-5
                py-3

                text-sm
                font-medium
              "
            >
              Dibayar
            </button>

            <button
              className="
                rounded-2xl
                border
                border-gray-300
                dark:border-white/10

                px-5
                py-3

                text-sm
                font-medium
              "
            >
              Selesai
            </button>
          </div>
        </div>

        {/* LIST PESANAN */}
        <div
          className="
            mt-8

            grid
            gap-6
          "
        >
          {pesananData.map((item) => (
            <div
              key={item.id}
              className="
                rounded-[28px]

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
                  flex-col
                  gap-6

                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >
                {/* LEFT */}
                <div className="flex gap-5">
                  {/* ICON */}
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center

                      rounded-2xl

                      bg-cyan-500/10
                    "
                  >
                    <User2 className="text-cyan-500" />
                  </div>

                  {/* INFO */}
                  <div>
                    <h3
                      className="
                        text-2xl
                        font-bold
                      "
                    >
                      {item.customer}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm

                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {item.lapangan}
                    </p>

                    <div
                      className="
                        mt-5

                        flex
                        flex-wrap
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2

                          rounded-xl

                          bg-gray-100
                          dark:bg-white/5

                          px-4
                          py-2

                          text-sm
                        "
                      >
                        <CalendarDays size={16} />
                        {item.tanggal}
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2

                          rounded-xl

                          bg-gray-100
                          dark:bg-white/5

                          px-4
                          py-2

                          text-sm
                        "
                      >
                        <Clock3 size={16} />
                        {item.jam}
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2

                          rounded-xl

                          bg-gray-100
                          dark:bg-white/5

                          px-4
                          py-2

                          text-sm
                        "
                      >
                        <CreditCard size={16} />
                        {item.pembayaran}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  className="
                    flex
                    flex-col
                    items-start
                    gap-4

                    xl:items-end
                  "
                >
                  <h4
                    className="
                      text-3xl
                      font-black
                    "
                  >
                    {item.total}
                  </h4>

                  {/* STATUS */}
                  {item.status === "dibayar" && (
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        bg-green-500/10

                        px-5
                        py-2

                        text-sm
                        font-semibold
                        text-green-500
                      "
                    >
                      <CheckCircle2 size={16} />
                      Dibayar
                    </div>
                  )}

                  {item.status === "pending" && (
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        bg-yellow-500/10

                        px-5
                        py-2

                        text-sm
                        font-semibold
                        text-yellow-500
                      "
                    >
                      <Clock3 size={16} />
                      Pending
                    </div>
                  )}

                  {item.status === "selesai" && (
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        bg-red-500/10

                        px-5
                        py-2

                        text-sm
                        font-semibold
                        text-red-500
                      "
                    >
                      <XCircle size={16} />
                      Selesai
                    </div>
                  )}

                  {/* BUTTON */}
                  <div className="flex gap-3">
                    <button
                      className="
                        rounded-2xl

                        border
                        border-gray-300
                        dark:border-white/10

                        px-5
                        py-3

                        text-sm
                        font-medium

                        transition

                        hover:border-cyan-500
                      "
                    >
                      Detail
                    </button>

                    <button
                      className="
                        rounded-2xl

                        bg-cyan-500

                        px-5
                        py-3

                        text-sm
                        font-semibold
                        text-white

                        transition

                        hover:bg-cyan-400
                      "
                    >
                      Kelola
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}