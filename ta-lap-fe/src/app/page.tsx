"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

import {
  CalendarDays,
  ShieldCheck,
  Trophy,
  Clock3,
} from "lucide-react";

export default function Home() {
  return (
    <main
      className="
        min-h-screen
        transition-all
        duration-300

        bg-gray-50
        text-gray-900

        dark:bg-gradient-to-br
        dark:from-[#0b1120]
        dark:via-[#111827]
        dark:to-[#0f172a]

        dark:text-white
      "
    >
      {/* NAVBAR */}
      <nav
        className="
          sticky
          top-0
          z-50

          border-b

          border-gray-200
          dark:border-white/10

          bg-white/70
          dark:bg-black/10

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
            py-5
          "
        >
          {/* LOGO */}
          <div>
            <h1
              className="
                text-2xl
                font-semibold
                tracking-tight

                text-cyan-600
                dark:text-cyan-400
              "
            >
              TA-LAP
            </h1>

            <p
              className="
                mt-1
                text-sm
                font-medium

                text-gray-500
                dark:text-gray-400
              "
            >
              Technology Assisted Lapangan Platform
            </p>
          </div>

          {/* ACTION */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Link
              href="/login"
              className="
                rounded-xl
                border

                border-gray-300
                dark:border-white/10

                px-5
                py-2.5

                text-sm
                font-medium

                text-gray-700
                dark:text-gray-300

                transition-all
                duration-300

                hover:border-cyan-400
                hover:text-cyan-500
              "
            >
              Login
            </Link>

            <Link
              href="/register"
              className="
                rounded-xl

                bg-cyan-500

                px-5
                py-2.5

                text-sm
                font-medium
                text-white

                transition-all
                duration-300

                hover:bg-cyan-400
              "
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="
          relative
          overflow-hidden
        "
      >
        {/* BACKGROUND GLOW */}
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]

            h-72
            w-72

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

            h-72
            w-72

            rounded-full
            bg-blue-500/10

            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10

            mx-auto
            flex
            max-w-6xl
            flex-col
            items-center

            px-6
            py-28

            text-center
          "
        >
          {/* BADGE */}
          <div
            className="
              mb-8
              rounded-full

              border

              border-cyan-200
              dark:border-cyan-400/20

              bg-cyan-50
              dark:bg-cyan-400/10

              px-4
              py-2

              text-sm
              font-medium

              text-cyan-700
              dark:text-cyan-300
            "
          >
            Smart Booking Platform
          </div>

          {/* TITLE */}
          <h2
            className="
              max-w-5xl

              text-5xl
              font-semibold
              leading-[1.1]
              tracking-tight

              lg:text-6xl
            "
          >
            Booking Lapangan
            <span
              className="
                block

                bg-gradient-to-r
                from-cyan-500
                to-blue-500

                bg-clip-text
                text-transparent
              "
            >
              Lebih Modern & Profesional
            </span>
          </h2>

          {/* DESC */}
          <p
            className="
              mt-8
              max-w-2xl

              text-base
              leading-7

              text-gray-600
              dark:text-gray-300
            "
          >
            Platform booking lapangan futsal dan badminton
            dengan validasi jadwal realtime, dashboard
            multi-role, dan sistem modern yang cepat,
            aman, dan efisien.
          </p>

          {/* BUTTON */}
          <div
            className="
              mt-12
              flex
              flex-wrap
              items-center
              justify-center
              gap-4
            "
          >
            <Link
              href="/register"
              className="
                rounded-2xl

                bg-cyan-500

                px-8
                py-4

                text-base
                font-medium
                text-white

                transition-all
                duration-300

                hover:bg-cyan-400
              "
            >
              Mulai Booking
            </Link>

            <Link
              href="/login"
              className="
                rounded-2xl
                border

                border-gray-300
                dark:border-white/10

                px-8
                py-4

                text-base
                font-medium

                text-gray-700
                dark:text-gray-300

                transition-all
                duration-300

                hover:border-cyan-400
                hover:text-cyan-500
              "
            >
              Masuk Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-28">
        <div
          className="
            mx-auto
            grid
            max-w-6xl
            gap-6

            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {[
            {
              title: "Smart Booking",
              icon: (
                <CalendarDays
                  className="
                    h-10
                    w-10
                    text-cyan-500
                  "
                />
              ),
              desc: "Booking lapangan realtime dan cepat.",
            },

            {
              title: "Anti Bentrok",
              icon: (
                <Clock3
                  className="
                    h-10
                    w-10
                    text-pink-500
                  "
                />
              ),
              desc: "Deteksi otomatis jadwal bentrok.",
            },

            {
              title: "Multi Role",
              icon: (
                <ShieldCheck
                  className="
                    h-10
                    w-10
                    text-purple-500
                  "
                />
              ),
              desc: "Admin, owner, dan user berbeda akses.",
            },

            {
              title: "Modern UI",
              icon: (
                <Trophy
                  className="
                    h-10
                    w-10
                    text-green-500
                  "
                />
              ),
              desc: "Interface modern dan profesional.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border

                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-white/5

                p-8

                shadow-sm
                dark:shadow-none

                backdrop-blur-lg

                transition-all
                duration-300

                hover:-translate-y-1
              "
            >
              <div className="mb-5">
                {item.icon}
              </div>

              <h3
                className="
                  mb-3

                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  text-sm
                  leading-7

                  text-gray-600
                  dark:text-gray-300
                "
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="
          border-t

          border-gray-200
          dark:border-white/10

          py-6

          text-center
          text-sm
          font-medium

          text-gray-500
          dark:text-gray-400
        "
      >
        © 2026 TA-LAP — Smart Booking Sport Arena
      </footer>
    </main>
  );
}