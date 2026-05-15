"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Plus,
  Search,
  MapPin,
  CircleDollarSign,
  Pencil,
  Trash2,
  Eye,
  Building2,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

export default function OwnerLapanganPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const lapangans = [
    {
      id: 1,
      nama: "Lapangan Futsal A",
      jenis: "Futsal",
      harga: "120.000",
      lokasi: "Depok",
      status: "Aktif",
      image:
        "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=1200",
    },
    {
      id: 2,
      nama: "Lapangan Badminton B",
      jenis: "Badminton",
      harga: "80.000",
      lokasi: "Jakarta",
      status: "Maintenance",
      image:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200",
    },
    {
      id: 3,
      nama: "Lapangan Mini Soccer",
      jenis: "Mini Soccer",
      harga: "250.000",
      lokasi: "Bogor",
      status: "Aktif",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200",
    },
  ];

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden

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
      {/* GLOW */}
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
      <header
        className="
          sticky
          top-0
          z-50

          border-b
          border-gray-200
          dark:border-white/10

          bg-white/70
          dark:bg-[#020617]/70

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
              <h1 className="text-2xl font-bold text-cyan-500">
                TA-LAP OWNER
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Venue Management System
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
                  relative
                  text-sm
                  font-semibold
                  text-cyan-500

                  after:absolute
                  after:-bottom-2
                  after:left-0
                  after:h-[2px]
                  after:w-full
                  after:bg-cyan-500
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

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl
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

            <button
              className="
                hidden
                md:flex

                h-11
                w-11

                items-center
                justify-center

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl
              "
            >
              <Settings size={18} />
            </button>

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

                bg-white/80
                dark:bg-white/5

                px-4
                py-2.5

                text-sm
                font-medium

                backdrop-blur-xl

                hover:border-red-500
                hover:text-red-500

                transition-all
              "
            >
              <LogOut size={18} />
              Logout
            </button>

            {/* MOBILE BUTTON */}
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

                bg-white/80
                dark:bg-white/5
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

              bg-white/90
              dark:bg-[#020617]/90

              backdrop-blur-xl

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
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
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
              <Building2 size={16} />
              KELOLA LAPANGAN
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Daftar Lapangan Owner
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Kelola semua lapangan, harga, status,
              dan informasi venue Anda.
            </p>
          </div>

          {/* ACTION */}
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

              shadow-lg
              shadow-cyan-500/30

              transition-all
              duration-300

              hover:scale-105
              hover:bg-cyan-400
            "
          >
            <Plus size={18} />
            Tambah Lapangan
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="
            mt-8

            flex
            items-center
            gap-3

            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white/80
            dark:bg-white/5

            p-4

            backdrop-blur-xl
          "
        >
          <Search className="text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Cari lapangan..."
            className="
              w-full
              bg-transparent
              outline-none

              placeholder:text-gray-400
            "
          />
        </div>

        {/* GRID */}
        <div
          className="
            mt-10

            grid
            gap-6

            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {lapangans.map((lapangan) => (
            <div
              key={lapangan.id}
              className="
                overflow-hidden

                rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                backdrop-blur-xl

                transition-all
                duration-300

                hover:-translate-y-2
                hover:shadow-2xl
              "
            >
              {/* IMAGE */}
              <div className="relative h-60 w-full">
                <Image
                  src={lapangan.image}
                  alt={lapangan.nama}
                  fill
                  className="object-cover"
                />

                <div
                  className="
                    absolute
                    left-4
                    top-4

                    rounded-full

                    bg-black/60

                    px-3
                    py-1

                    text-xs
                    font-medium
                    text-white

                    backdrop-blur-xl
                  "
                >
                  {lapangan.jenis}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {lapangan.nama}
                    </h2>

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      <MapPin size={16} />
                      {lapangan.lokasi}
                    </div>

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      <CircleDollarSign size={16} />
                      Rp {lapangan.harga} / jam
                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1

                      text-xs
                      font-semibold

                      ${
                        lapangan.status === "Aktif"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }
                    `}
                  >
                    {lapangan.status}
                  </span>
                </div>

                {/* ACTION BUTTON */}
                <div className="mt-8 flex items-center gap-3">
                  <button
                    className="
                      flex
                      flex-1
                      items-center
                      justify-center
                      gap-2

                      rounded-2xl

                      bg-cyan-500

                      px-4
                      py-3

                      text-sm
                      font-semibold
                      text-white

                      transition-all
                      duration-300

                      hover:scale-[1.02]
                      hover:bg-cyan-400
                    "
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      hover:border-cyan-500

                      transition-all
                    "
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      hover:border-red-500
                      hover:text-red-500

                      transition-all
                    "
                  >
                    <Trash2 size={18} />
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