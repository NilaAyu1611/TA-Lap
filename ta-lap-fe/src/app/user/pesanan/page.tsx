"use client";

import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";

import {
  LayoutDashboard,
  MapPinned,
  CalendarDays,
  Receipt,
  LogOut,
  Clock3,
  Calendar,
  Wallet,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";

export default function PesananPage() {
  const pesanans = [
    {
      id: 1,
      lapangan: "Futsal Arena Elite",
      jenis: "Futsal",
      tanggal: "12 Mei 2026",
      jam: "19:00 - 21:00",
      status: "pending",
      total: "Rp240.000",
    },
    {
      id: 2,
      lapangan: "Badminton Pro Court",
      jenis: "Badminton",
      tanggal: "15 Mei 2026",
      jam: "15:00 - 17:00",
      status: "dibayar",
      total: "Rp160.000",
    },
    {
      id: 3,
      lapangan: "Cyber Sport Center",
      jenis: "Futsal",
      tanggal: "20 Mei 2026",
      jam: "20:00 - 22:00",
      status: "selesai",
      total: "Rp300.000",
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
        {/* HEADER */}
        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
            "
          >
            Riwayat Pesanan
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
            Kelola dan pantau seluruh riwayat booking
            lapangan Anda secara realtime dan modern.
          </p>
        </div>

        {/* CARD LIST */}
        <div className="mt-10 space-y-6">
          {pesanans.map((item) => (
            <div
              key={item.id}
              className="
                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                p-7

                shadow-lg
                backdrop-blur-xl

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

                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                {/* LEFT */}
                <div className="flex-1">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    <h2
                      className="
                        text-2xl
                        font-semibold
                        tracking-tight
                      "
                    >
                      {item.lapangan}
                    </h2>

                    <span
                      className="
                        rounded-full

                        bg-cyan-100
                        px-3
                        py-1

                        text-xs
                        font-semibold

                        text-cyan-600

                        dark:bg-cyan-500/10
                        dark:text-cyan-400
                      "
                    >
                      {item.jenis}
                    </span>
                  </div>

                  {/* INFO */}
                  <div
                    className="
                      mt-6
                      grid
                      gap-4

                      sm:grid-cols-2
                      lg:grid-cols-3
                    "
                  >
                    {/* TANGGAL */}
                    <div
                      className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div
                        className="
                          rounded-xl

                          bg-cyan-500/10

                          p-2
                        "
                      >
                        <Calendar
                          size={20}
                          className="
                            text-cyan-500
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Tanggal
                        </p>

                        <h4 className="mt-1 font-medium">
                          {item.tanggal}
                        </h4>
                      </div>
                    </div>

                    {/* JAM */}
                    <div
                      className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div
                        className="
                          rounded-xl

                          bg-blue-500/10

                          p-2
                        "
                      >
                        <Clock3
                          size={20}
                          className="
                            text-blue-500
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Jam Booking
                        </p>

                        <h4 className="mt-1 font-medium">
                          {item.jam}
                        </h4>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div
                      className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div
                        className="
                          rounded-xl

                          bg-green-500/10

                          p-2
                        "
                      >
                        <Wallet
                          size={20}
                          className="
                            text-green-500
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Total Pembayaran
                        </p>

                        <h4
                          className="
                            mt-1
                            font-semibold

                            text-green-600
                            dark:text-green-400
                          "
                        >
                          {item.total}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div>
                  {item.status === "pending" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-yellow-100
                        dark:bg-yellow-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-yellow-700
                        dark:text-yellow-400
                      "
                    >
                      <AlertCircle size={18} />
                      Belum Dibayar
                    </div>
                  )}

                  {item.status === "dibayar" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-cyan-100
                        dark:bg-cyan-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-cyan-700
                        dark:text-cyan-400
                      "
                    >
                      <CheckCircle2 size={18} />
                      Dibayar
                    </div>
                  )}

                  {item.status === "selesai" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-green-100
                        dark:bg-green-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-green-700
                        dark:text-green-400
                      "
                    >
                      <BadgeCheck size={18} />
                      Selesai
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {pesanans.length === 0 && (
          <div
            className="
              mt-10
              rounded-3xl
              border

              border-dashed
              border-gray-300
              dark:border-white/10

              bg-white/70
              dark:bg-white/5

              py-20
              text-center

              backdrop-blur-xl
            "
          >
            <h3
              className="
                text-2xl
                font-semibold
              "
            >
              Belum Ada Pesanan
            </h3>

            <p
              className="
                mt-3

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Anda belum memiliki riwayat booking
              lapangan.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}