"use client";

import Link from "next/link";

import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Download,
  FileSpreadsheet,
  Filter,
  LogOut,
  Menu,
  Moon,
  Printer,
  Search,
  Sun,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import OwnerNavbar from "@/components/OwnerNavbar";

export default function OwnerLaporanPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const laporanBulanan = [
    {
      bulan: "Januari",
      booking: 125,
      pendapatan: "Rp 12.500.000",
      pertumbuhan: "+12%",
      status: "up",
    },
    {
      bulan: "Februari",
      booking: 142,
      pendapatan: "Rp 14.200.000",
      pertumbuhan: "+18%",
      status: "up",
    },
    {
      bulan: "Maret",
      booking: 130,
      pendapatan: "Rp 13.100.000",
      pertumbuhan: "-5%",
      status: "down",
    },
    {
      bulan: "April",
      booking: 168,
      pendapatan: "Rp 16.800.000",
      pertumbuhan: "+24%",
      status: "up",
    },
  ];

  const topLapangan = [
    {
      nama: "Futsal Arena A",
      totalBooking: 84,
      pendapatan: "Rp 8.400.000",
    },
    {
      nama: "Badminton Court B",
      totalBooking: 73,
      pendapatan: "Rp 6.700.000",
    },
    {
      nama: "Mini Soccer Elite",
      totalBooking: 61,
      pendapatan: "Rp 9.300.000",
    },
  ];

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
      {/* BACKGROUND */}
      <div
        className="
          fixed
          inset-0
          -z-10

          bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_30%)]
        "
      />

      {/* NAVBAR */}
      <OwnerNavbar active="laporan" />

      {/* CONTENT */}
      <section 
      className="mx-auto max-w-7xl px-6 py-10">
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

            p-8
            md:p-10

            shadow-xl
            shadow-cyan-500/5

            backdrop-blur-xl
          "
        >
          <div
            className="
              absolute
              right-[-120px]
              top-[-120px]

              h-80
              w-80

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

                border
                border-cyan-500/20

                bg-cyan-500/10

                px-4
                py-2

                text-sm
                font-semibold
                text-cyan-500
              "
            >
              <BarChart3 size={16} />
              ANALYTICS REPORT
            </div>

            <h2
              className="
                mt-6

                max-w-3xl

                text-4xl
                font-black
                tracking-tight

                md:text-5xl
              "
            >
              Laporan Bisnis &
              <span
                className="
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  bg-clip-text
                  text-transparent
                "
              >
                {" "}
                Analitik Pendapatan
              </span>
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
              Pantau performa bisnis lapangan Anda melalui laporan
              booking, transaksi pembayaran, pertumbuhan pelanggan,
              dan statistik pendapatan realtime.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="
                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  bg-cyan-500

                  px-6
                  py-3

                  text-sm
                  font-semibold
                  text-white

                  transition-all
                  hover:scale-105
                  hover:bg-cyan-400
                "
              >
                <Download size={18} />
                Export PDF
              </button>

              <button
                className="
                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  border
                  border-gray-300
                  dark:border-white/10

                  px-6
                  py-3

                  text-sm
                  font-semibold

                  transition-all
                  hover:border-cyan-500
                "
              >
                <Printer size={18} />
                Print Laporan
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
          {/* CARD */}
          <div
            className="
              rounded-3xl
              border

              border-gray-200
              dark:border-white/10

              bg-white/80
              dark:bg-white/5

              p-6

              shadow-lg
              shadow-black/5

              backdrop-blur-xl

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-cyan-500/30
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Pendapatan
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Rp 56jt
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
                <Wallet className="text-green-500" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-green-500">
              <ArrowUpRight size={16} />
              +22% dari bulan lalu
            </div>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-3xl
              border
              border-gray-200
              dark:border-white/10

              bg-white/80
              dark:bg-white/5

              p-6

              shadow-lg
              shadow-black/5

              backdrop-blur-xl

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-purple-500/30
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Booking
                </p>

                <h3 className="mt-3 text-3xl font-black">565</h3>
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
                <CalendarDays className="text-purple-500" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-green-500">
              <TrendingUp size={16} />
              Booking meningkat
            </div>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-3xl
              border
              border-gray-200
              dark:border-white/10

              bg-white/80
              dark:bg-white/5

              p-6

              shadow-lg
              shadow-black/5

              backdrop-blur-xl

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-pink-500/30
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pembayaran
                </p>

                <h3 className="mt-3 text-3xl font-black">542</h3>
              </div>

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
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-red-500">
              <ArrowDownRight size={16} />
              12 transaksi pending
            </div>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-3xl
              border
              border-gray-200
              dark:border-white/10

              bg-white/80
              dark:bg-white/5

              p-6

              shadow-lg
              shadow-black/5

              backdrop-blur-xl

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-orange-500/30
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lapangan Aktif
                </p>

                <h3 className="mt-3 text-3xl font-black">8</h3>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center

                  rounded-2xl

                  bg-orange-500/10
                "
              >
                <Building2 className="text-orange-500" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-orange-500">
              <BadgeDollarSign size={16} />
              Operasional normal
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
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Cari laporan..."
              className="
                h-14
                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                pl-12
                pr-4

                outline-none

                backdrop-blur-xl

                focus:border-cyan-500
              "
            />
          </div>

          <div className="flex gap-3">
            <button
              className="
                flex
                items-center
                gap-2

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                px-5
                py-3

                text-sm
                font-medium

                backdrop-blur-xl
              "
            >
              <Filter size={18} />
              Filter
            </button>

            <button
              className="
                flex
                items-center
                gap-2

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                px-5
                py-3

                text-sm
                font-medium

                backdrop-blur-xl
              "
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">
            {/* TABLE */}
            <div
              className="
                overflow-hidden

                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                shadow-lg
                shadow-black/5

                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between

                  border-b
                  border-gray-200
                  dark:border-white/10

                  p-6
                "
              >
                <div>
                  <h3 className="text-xl font-bold">
                    Laporan Bulanan
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Statistik performa bisnis bulanan.
                  </p>
                </div>

                <button
                  className="
                    flex
                    items-center
                    gap-2

                    text-sm
                    font-semibold
                    text-cyan-500
                  "
                >
                  Detail
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr
                      className="
                        border-b
                        border-gray-200
                        dark:border-white/10
                      "
                    >
                      <th className="px-6 py-4 text-left text-sm">
                        Bulan
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Booking
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Pendapatan
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Pertumbuhan
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {laporanBulanan.map((item, index) => (
                      <tr
                        key={index}
                        className="
                          border-b
                          border-gray-100
                          dark:border-white/5

                          transition
                          hover:bg-cyan-500/5
                        "
                      >
                        <td className="px-6 py-5 font-semibold">
                          {item.bulan}
                        </td>

                        <td className="px-6 py-5">
                          {item.booking}
                        </td>

                        <td className="px-6 py-5 font-medium">
                          {item.pendapatan}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-4
                              py-2
                              text-sm
                              font-semibold

                              ${
                                item.status === "up"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }
                            `}
                          >
                            {item.pertumbuhan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* TOP LAPANGAN */}
            <div
              className="
                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                p-6

                shadow-lg
                shadow-black/5

                backdrop-blur-xl
              "
            >
              <h3 className="text-xl font-bold">
                Top Lapangan
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Lapangan dengan performa terbaik.
              </p>

              <div className="mt-6 space-y-4">
                {topLapangan.map((item, index) => (
                  <div
                    key={index}
                    className="
                      rounded-2xl
                      border

                      border-gray-200
                      dark:border-white/10

                      p-4
                    "
                  >
                    <h4 className="font-semibold">
                      {item.nama}
                    </h4>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Booking
                      </span>

                      <span className="font-semibold">
                        {item.totalBooking}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Pendapatan
                      </span>

                      <span className="font-semibold text-cyan-500">
                        {item.pendapatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div
              className="
                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-gradient-to-br
                from-cyan-500
                to-blue-600

                p-6

                text-white

                shadow-2xl
                shadow-cyan-500/20
              "
            >
              <p className="text-sm text-white/70">
                Total Revenue Tahun Ini
              </p>

              <h2 className="mt-4 text-4xl font-black">
                Rp 182jt
              </h2>

              <div className="mt-6 flex items-center gap-2 text-sm text-green-200">
                <TrendingUp size={16} />
                Pertumbuhan sangat baik
              </div>

              <button
                className="
                  mt-8

                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  bg-white/15

                  px-5
                  py-3

                  text-sm
                  font-semibold

                  backdrop-blur-xl

                  transition
                  hover:bg-white/20
                "
              >
                Lihat Detail
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}