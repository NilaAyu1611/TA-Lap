"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarDays,
  Download,
  FileBarChart2,
  Search,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const laporanData = [
  {
    id: 1,
    title: "Pendapatan Bulanan",
    date: "Mei 2026",
    amount: "Rp 24.500.000",
    growth: "+18%",
    status: "up",
  },
  {
    id: 2,
    title: "Total Booking",
    date: "Mei 2026",
    amount: "1.240 Booking",
    growth: "+11%",
    status: "up",
  },
  {
    id: 3,
    title: "Refund Transaksi",
    date: "Mei 2026",
    amount: "Rp 1.200.000",
    growth: "-4%",
    status: "down",
  },
];

export default function AdminLaporanPage() {
  return (
    <div>
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
            <FileBarChart2 size={16} />
            ADMIN LAPORAN
          </div>

          <h1
            className="
              mt-6

              text-4xl
              font-black
              tracking-tight

              md:text-5xl
            "
          >
            Monitoring Laporan Sistem
          </h1>

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
            Pantau seluruh laporan transaksi,
            pendapatan, booking, owner,
            dan performa platform secara realtime.
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
                Rp 124jt
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
                "
              >
                Total Booking
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                8.420
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
              <CalendarDays className="text-cyan-500" />
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
                "
              >
                User Aktif
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                1.240
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
              <Users className="text-purple-500" />
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
                "
              >
                Growth Platform
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                +24%
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

                bg-pink-500/10
              "
            >
              <TrendingUp className="text-pink-500" />
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
            placeholder="Cari laporan..."
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

      {/* LIST */}
      <div
        className="
          mt-8

          grid
          gap-6
        "
      >
        {laporanData.map((item) => (
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
                  <BadgeDollarSign className="text-cyan-500" />
                </div>

                {/* INFO */}
                <div>
                  <h3
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-1

                      text-sm

                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Periode: {item.date}
                  </p>

                  <div
                    className="
                      mt-5

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
                    <CalendarDays size={16} />
                    Monthly Report
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
                <div>
                  <h4
                    className="
                      text-3xl
                      font-black
                    "
                  >
                    {item.amount}
                  </h4>

                  <div
                    className={`
                      mt-2

                      inline-flex
                      items-center
                      gap-2

                      rounded-full

                      px-4
                      py-2

                      text-sm
                      font-semibold

                      ${
                        item.status === "up"
                          ? `
                            bg-green-500/10
                            text-green-500
                          `
                          : `
                            bg-red-500/10
                            text-red-500
                          `
                      }
                    `}
                  >
                    {item.status === "up" ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}

                    {item.growth}
                  </div>
                </div>

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
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}