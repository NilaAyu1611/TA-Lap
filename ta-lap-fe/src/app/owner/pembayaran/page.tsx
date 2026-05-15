"use client";

import Link from "next/link";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  LogOut,
  Menu,
  Search,
  Wallet,
  X,
  Clock3,
  BadgeDollarSign,
} from "lucide-react";

import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

const pembayaranData = [
  {
    id: 1,
    customer: "Ahmad Fauzi",
    lapangan: "Futsal Arena A",
    metode: "QRIS",
    tanggal: "19 Mei 2026",
    total: "Rp 250.000",
    status: "success",
  },
  {
    id: 2,
    customer: "Rizky Ramadhan",
    lapangan: "Badminton Court B",
    metode: "Transfer Bank",
    tanggal: "20 Mei 2026",
    total: "Rp 180.000",
    status: "pending",
  },
  {
    id: 3,
    customer: "Dimas Saputra",
    lapangan: "Mini Soccer Elite",
    metode: "Tunai",
    tanggal: "20 Mei 2026",
    total: "Rp 500.000",
    status: "success",
  },
];

export default function OwnerPembayaranPage() {
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
                  font-medium

                  text-gray-600
                  dark:text-gray-300

                  hover:text-cyan-500
                  transition
                "
              >
                Pesanan
              </Link>

              <Link
                href="/owner/pembayaran"
                className="
                  text-sm
                  font-semibold
                  text-cyan-500
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
              <Wallet size={16} />
              OWNER PEMBAYARAN
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
              Monitoring Pembayaran Booking
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
              Kelola transaksi pembayaran pelanggan,
              validasi pembayaran, dan pantau pemasukan
              venue secara realtime.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
            mt-10

            grid
            gap-6

            md:grid-cols-2
            xl:grid-cols-4
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
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Total Pendapatan
                </p>

                <h3
                  className="
                    mt-3
                    text-3xl
                    font-black
                  "
                >
                  Rp 12.5jt
                </h3>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-green-500/10
                "
              >
                <DollarSign className="text-green-500" />
              </div>
            </div>
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
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Pembayaran Pending
                </p>

                <h3
                  className="
                    mt-3
                    text-3xl
                    font-black
                  "
                >
                  8
                </h3>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-yellow-500/10
                "
              >
                <Clock3 className="text-yellow-500" />
              </div>
            </div>
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
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Pembayaran Berhasil
                </p>

                <h3
                  className="
                    mt-3
                    text-3xl
                    font-black
                  "
                >
                  142
                </h3>
              </div>

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
                <CheckCircle2 className="text-cyan-500" />
              </div>
            </div>
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
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Transaksi Hari Ini
                </p>

                <h3
                  className="
                    mt-3
                    text-3xl
                    font-black
                  "
                >
                  23
                </h3>
              </div>

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
                <BadgeDollarSign className="text-purple-500" />
              </div>
            </div>
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
              placeholder="Cari pembayaran..."
              className="
                w-full
                bg-transparent
                outline-none

                placeholder:text-gray-400
              "
            />
          </div>

          {/* EXPORT */}
          <button
            className="
              flex
              items-center
              gap-2

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
            <Download size={18} />
            Export Laporan
          </button>
        </div>

        {/* TABLE */}
        <div
          className="
            mt-8
            overflow-hidden

            rounded-[32px]

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead
                className="
                  border-b
                  border-gray-200
                  dark:border-white/10
                "
              >
                <tr>
                  {[
                    "Pelanggan",
                    "Lapangan",
                    "Metode",
                    "Tanggal",
                    "Total",
                    "Status",
                    "Aksi",
                  ].map((item) => (
                    <th
                      key={item}
                      className="
                        px-6
                        py-5
                        text-left

                        text-sm
                        font-semibold
                      "
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pembayaranData.map((item) => (
                  <tr
                    key={item.id}
                    className="
                      border-b
                      border-gray-200
                      dark:border-white/5

                      transition
                      hover:bg-gray-100/70
                      dark:hover:bg-white/[0.03]
                    "
                  >
                    <td className="px-6 py-5">
                      <div>
                        <h3 className="font-semibold">
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
                          Customer Booking
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {item.lapangan}
                    </td>

                    <td className="px-6 py-5">
                      <div
                        className="
                          inline-flex
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
                        {item.metode}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <CalendarDays size={16} />
                        {item.tanggal}
                      </div>
                    </td>

                    <td
                      className="
                        px-6
                        py-5

                        font-bold
                      "
                    >
                      {item.total}
                    </td>

                    <td className="px-6 py-5">
                      {item.status === "success" ? (
                        <div
                          className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            bg-green-500/10

                            px-4
                            py-2

                            text-sm
                            font-semibold
                            text-green-500
                          "
                        >
                          <CheckCircle2 size={16} />
                          Success
                        </div>
                      ) : (
                        <div
                          className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            bg-yellow-500/10

                            px-4
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
                    </td>

                    <td className="px-6 py-5">
                      <button
                        className="
                          rounded-2xl

                          border
                          border-gray-300
                          dark:border-white/10

                          px-4
                          py-2

                          text-sm
                          font-medium

                          transition

                          hover:border-cyan-500
                          hover:text-cyan-500
                        "
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}