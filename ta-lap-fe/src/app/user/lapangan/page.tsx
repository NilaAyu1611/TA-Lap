"use client";

import Link from "next/link";
import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

import {
  LayoutDashboard,
  CalendarDays,
  Receipt,
  LogOut,
  MapPinned,
  Search,
  Filter,
  Star,
} from "lucide-react";

export default function LapanganPage() {
  const [search, setSearch] = useState("");

  const lapangans = [
    {
      id: 1,
      nama: "Futsal Arena Elite",
      jenis: "Futsal",
      harga: "Rp120.000 / jam",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      nama: "Badminton Pro Court",
      jenis: "Badminton",
      harga: "Rp80.000 / jam",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      nama: "Cyber Sport Center",
      jenis: "Futsal",
      harga: "Rp150.000 / jam",
      status: "Tidak Tersedia",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <main
      className="
        min-h-screen

        bg-gray-50
        text-gray-900

        transition-all
        duration-300

        dark:bg-[#0b1120]
        dark:text-white
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]

            h-80
            w-80

            rounded-full
            bg-cyan-500/10

            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]

            h-80
            w-80

            rounded-full
            bg-blue-500/10

            blur-3xl
          "
        />
      </div>

      {/* NAVBAR */}
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
            <Link
              href="/dashboard"
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
                className="
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
                "
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                href="/user/lapangan"
                className="
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
                "
              >
                <MapPinned size={18} />
                Lapangan
              </Link>

              <Link
                href="/user/pesanan"
                className="
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
                "
              >
                <CalendarDays size={18} />
                Pesanan
              </Link>

              <Link
                href="/user/pembayaran"
                className="
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
                "
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

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* TOP */}
        <div
          className="
            flex
            flex-col
            gap-6

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
              "
            >
              Daftar Lapangan
            </h1>

            <p
              className="
                mt-3
                max-w-2xl

                text-sm
                leading-7

                text-gray-500
                dark:text-gray-400
              "
            >
              Pilih lapangan favorit Anda untuk booking
              realtime dengan sistem modern dan cepat.
            </p>
          </div>

          {/* SEARCH */}
          <div
            className="
              flex
              w-full
              flex-col
              gap-3

              sm:flex-row
              lg:w-auto
            "
          >
            <div className="relative">
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
                placeholder="Cari lapangan..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border

                  border-gray-300
                  dark:border-white/10

                  bg-white
                  dark:bg-white/5

                  py-3
                  pl-11
                  pr-4

                  text-sm

                  outline-none

                  transition-all
                  duration-300

                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                "
              />
            </div>

            <button
              className="
                flex
                items-center
                justify-center
                gap-2

                rounded-2xl
                border

                border-gray-300
                dark:border-white/10

                bg-white
                dark:bg-white/5

                px-5
                py-3

                text-sm
                font-medium

                transition-all
                duration-300

                hover:border-cyan-500
                hover:text-cyan-500
              "
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* GRID */}
        <div
          className="
            mt-10
            grid
            gap-7

            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {lapangans.map((item) => (
            <div
              key={item.id}
              className="
                overflow-hidden
                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                shadow-lg
                backdrop-blur-xl

                transition-all
                duration-300

                hover:-translate-y-2
                hover:border-cyan-500/40
                hover:shadow-cyan-500/10
              "
            >
              {/* IMAGE */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nama}
                  className="
                    h-full
                    w-full
                    object-cover

                    transition-transform
                    duration-500

                    hover:scale-110
                  "
                />

                <div
                  className="
                    absolute
                    left-4
                    top-4

                    flex
                    items-center
                    gap-1

                    rounded-full

                    bg-white/90
                    dark:bg-black/60

                    px-3
                    py-1

                    text-xs
                    font-semibold
                  "
                >
                  <Star
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  Premium
                </div>
              </div>

              {/* BODY */}
              <div className="p-6">
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <h3
                      className="
                        text-xl
                        font-semibold
                        tracking-tight
                      "
                    >
                      {item.nama}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm

                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {item.jenis}
                    </p>
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold

                      ${
                        item.status === "Tersedia"
                          ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide

                        text-gray-400
                      "
                    >
                      Harga
                    </p>

                    <h4
                      className="
                        mt-1
                        text-lg
                        font-bold

                        text-cyan-600
                        dark:text-cyan-400
                      "
                    >
                      {item.harga}
                    </h4>
                  </div>

                  <button
                    disabled={
                      item.status !== "Tersedia"
                    }
                    className={`
                      rounded-2xl
                      px-5
                      py-3

                      text-sm
                      font-semibold

                      transition-all
                      duration-300

                      ${
                        item.status === "Tersedia"
                          ? `
                            bg-cyan-500
                            text-white

                            hover:bg-cyan-400
                            hover:shadow-lg
                            hover:shadow-cyan-500/20
                          `
                          : `
                            cursor-not-allowed
                            bg-gray-300
                            text-gray-500

                            dark:bg-white/10
                            dark:text-gray-500
                          `
                      }
                    `}
                  >
                    Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}