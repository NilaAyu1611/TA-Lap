/* =========================================================
   FILE:
   app/admin/transaksi/page.tsx
   ========================================================= */

"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Eye,
  MoreHorizontal,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";

const transaksiData = [
  {
    id: 1,
    kode: "TRX-2026-001",
    customer: "Ahmad Fauzi",
    owner: "Futsal Arena Elite",
    metode: "QRIS",
    tanggal: "19 Mei 2026",
    total: "Rp 250.000",
    status: "success",
  },
  {
    id: 2,
    kode: "TRX-2026-002",
    customer: "Rizky Ramadhan",
    owner: "Badminton Pro Center",
    metode: "Transfer Bank",
    tanggal: "20 Mei 2026",
    total: "Rp 500.000",
    status: "pending",
  },
  {
    id: 3,
    kode: "TRX-2026-003",
    customer: "Dimas Saputra",
    owner: "Mini Soccer Arena",
    metode: "E-Wallet",
    tanggal: "21 Mei 2026",
    total: "Rp 1.200.000",
    status: "failed",
  },
];

export default function AdminTransaksiPage() {
  return (
    <div className="space-y-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div
        className="
          flex
          flex-col
          gap-5

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.2em]

              text-cyan-500
            "
          >
            Admin Transaksi
          </p>

          <h1
            className="
              mt-2

              text-4xl
              font-black
              tracking-tight
            "
          >
            Monitoring Transaksi
          </h1>

          <p
            className="
              mt-3
              max-w-3xl

              text-base
              leading-8

              text-gray-600
              dark:text-gray-400
            "
          >
            Monitoring seluruh pembayaran booking,
            transaksi owner, dan aktivitas keuangan
            platform TA-LAP secara realtime.
          </p>
        </div>

        {/* ACTION */}
        <button
          className="
            inline-flex
            items-center
            gap-3

            rounded-2xl

            bg-cyan-500

            px-6
            py-4

            text-sm
            font-semibold
            text-white

            shadow-lg
            shadow-cyan-500/20

            transition-all
            duration-300

            hover:scale-[1.02]
            hover:bg-cyan-400
          "
        >
          <Download size={18} />
          Export Laporan
        </button>
      </div>

      {/* =========================================================
          STATS
      ========================================================= */}
      <div
        className="
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

            shadow-sm
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
                Total Transaksi
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                12.842
              </h3>
            </div>

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
              <CreditCard className="text-cyan-500" />
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

            shadow-sm
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
                Pendapatan
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                Rp 248jt
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
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

            shadow-sm
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
                Pending
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                28
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
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

            shadow-sm
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
                Success Rate
              </p>

              <h3
                className="
                  mt-3

                  text-4xl
                  font-black
                "
              >
                98%
              </h3>
            </div>

            <div
              className="
                flex
                h-16
                w-16
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

      {/* =========================================================
          FILTER
      ========================================================= */}
      <div
        className="
          flex
          flex-col
          gap-4

          xl:flex-row
          xl:items-center
          xl:justify-between
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

            px-5
            py-4

            xl:w-[420px]
          "
        >
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari transaksi..."
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
            Success
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
            Failed
          </button>
        </div>
      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}
      <div
        className="
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
          <table className="w-full min-w-[1200px]">
            <thead
              className="
                border-b
                border-gray-200
                dark:border-white/10

                bg-gray-50
                dark:bg-white/[0.03]
              "
            >
              <tr>
                {[
                  "Kode",
                  "Customer",
                  "Owner",
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
              {transaksiData.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-b
                    border-gray-200
                    dark:border-white/5

                    transition-all
                    duration-300

                    hover:bg-gray-50
                    dark:hover:bg-white/[0.03]
                  "
                >
                  {/* KODE */}
                  <td className="px-6 py-5">
                    <div>
                      <h3 className="font-bold">
                        {item.kode}
                      </h3>

                      <p
                        className="
                          mt-1

                          text-sm
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Transaction ID
                      </p>
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-5">
                    {item.customer}
                  </td>

                  {/* OWNER */}
                  <td className="px-6 py-5">
                    {item.owner}
                  </td>

                  {/* METODE */}
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

                  {/* TANGGAL */}
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

                  {/* TOTAL */}
                  <td
                    className="
                      px-6
                      py-5

                      font-black
                    "
                  >
                    {item.total}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    {item.status === "success" && (
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
                    )}

                    {item.status === "pending" && (
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

                    {item.status === "failed" && (
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2

                          rounded-full

                          bg-red-500/10

                          px-4
                          py-2

                          text-sm
                          font-semibold
                          text-red-500
                        "
                      >
                        <XCircle size={16} />
                        Failed
                      </div>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        className="
                          inline-flex
                          items-center
                          gap-2

                          rounded-2xl

                          border
                          border-gray-300
                          dark:border-white/10

                          px-4
                          py-2

                          text-sm
                          font-medium

                          transition-all
                          duration-300

                          hover:border-cyan-500
                          hover:text-cyan-500
                        "
                      >
                        <Eye size={16} />
                        Detail
                      </button>

                      <button
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center

                          rounded-2xl

                          border
                          border-gray-300
                          dark:border-white/10

                          transition-all
                          duration-300

                          hover:border-cyan-500
                        "
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARD
      ========================================================= */}
      <div
        className="
          grid
          gap-6

          xl:grid-cols-2
        "
      >
        {/* INCOME */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-8
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
                Total Pemasukan Bulan Ini
              </p>

              <h2
                className="
                  mt-4

                  text-5xl
                  font-black
                "
              >
                Rp 48.250.000
              </h2>
            </div>

            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center

                rounded-3xl

                bg-green-500/10
              "
            >
              <ArrowUpRight
                size={40}
                className="text-green-500"
              />
            </div>
          </div>
        </div>

        {/* OUTCOME */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-8
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
                Refund / Gagal Bulan Ini
              </p>

              <h2
                className="
                  mt-4

                  text-5xl
                  font-black
                "
              >
                Rp 2.100.000
              </h2>
            </div>

            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center

                rounded-3xl

                bg-red-500/10
              "
            >
              <ArrowDownRight
                size={40}
                className="text-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}