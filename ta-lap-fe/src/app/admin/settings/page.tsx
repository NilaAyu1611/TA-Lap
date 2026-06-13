/* =========================================================
   FILE:
   app/admin/settings/page.tsx
   ========================================================= */

"use client";

import {
  Bell,
  Database,
  Globe,
  KeyRound,
  Lock,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <p className="text-sm font-medium text-cyan-500">
          ADMIN SETTINGS
        </p>

        <h1
          className="
            mt-2
            text-4xl
            font-black
            tracking-tight
          "
        >
          Pengaturan Sistem
        </h1>

        <p
          className="
            mt-3
            max-w-3xl
            text-gray-500
            dark:text-gray-400
          "
        >
          Kelola konfigurasi aplikasi, keamanan sistem,
          notifikasi, dan pengaturan panel admin TA-LAP.
        </p>
      </div>

      {/* GRID */}
      <div
        className="
          grid
          gap-6

          xl:grid-cols-3
        "
      >
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          {/* GENERAL */}
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
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-cyan-500/10
                "
              >
                <Globe className="text-cyan-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Pengaturan Umum
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Konfigurasi identitas platform.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {/* INPUT */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nama Platform
                </label>

                <input
                  type="text"
                  defaultValue="TA-LAP"
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-white/5

                    px-4
                    py-3

                    outline-none
                  "
                />
              </div>

              {/* INPUT */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Sistem
                </label>

                <input
                  type="email"
                  defaultValue="admin@talap.com"
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-white/5

                    px-4
                    py-3

                    outline-none
                  "
                />
              </div>

              {/* INPUT */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nomor Admin
                </label>

                <input
                  type="text"
                  defaultValue="+62 812-3456-7890"
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-white/5

                    px-4
                    py-3

                    outline-none
                  "
                />
              </div>

              {/* INPUT */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Zona Waktu
                </label>

                <select
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-white/5

                    px-4
                    py-3

                    outline-none
                  "
                >
                  <option>Asia/Jakarta</option>
                  <option>Asia/Makassar</option>
                  <option>Asia/Jayapura</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECURITY */}
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
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-red-500/10
                "
              >
                <ShieldCheck className="text-red-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Keamanan Sistem
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Pengaturan keamanan akun admin.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password Baru
                </label>

                <div className="relative">
                  <Lock
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
                    type="password"
                    placeholder="••••••••"
                    className="
                      w-full

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-gray-50
                      dark:bg-white/5

                      py-3
                      pl-12
                      pr-4

                      outline-none
                    "
                  />
                </div>
              </div>

              {/* API KEY */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  API Secret Key
                </label>

                <div className="relative">
                  <KeyRound
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
                    defaultValue="sk_live_xxxxxxxxx"
                    className="
                      w-full

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-gray-50
                      dark:bg-white/5

                      py-3
                      pl-12
                      pr-4

                      outline-none
                    "
                  />
                </div>
              </div>

              {/* SWITCHES */}
              <div className="space-y-4">
                {/* 2FA */}
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    p-4
                  "
                >
                  <div>
                    <h4 className="font-semibold">
                      Two Factor Authentication
                    </h4>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Aktifkan verifikasi 2 langkah.
                    </p>
                  </div>

                  <button
                    className="
                      rounded-full
                      bg-green-500

                      px-4
                      py-2

                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Aktif
                  </button>
                </div>

                {/* LOGIN ALERT */}
                <div
                  className="
                    flex
                    items-center
                    justify-between

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    p-4
                  "
                >
                  <div>
                    <h4 className="font-semibold">
                      Login Notification
                    </h4>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Kirim notifikasi login admin.
                    </p>
                  </div>

                  <button
                    className="
                      rounded-full
                      bg-cyan-500

                      px-4
                      py-2

                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Enabled
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* APPEARANCE */}
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
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-purple-500/10
                "
              >
                <Palette className="text-purple-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Tampilan Dashboard
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Kustomisasi tampilan panel admin.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {/* DARK MODE */}
              <div
                className="
                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/10

                  p-4
                "
              >
                <div className="flex items-center gap-3">
                  <Moon className="text-cyan-500" />

                  <div>
                    <h4 className="font-semibold">
                      Dark Mode
                    </h4>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Aktifkan tema gelap dashboard.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`
                    relative
                    h-7
                    w-14
                    rounded-full
                    transition-all

                    ${
                      darkMode
                        ? "bg-cyan-500"
                        : "bg-gray-300"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute
                      top-1

                      h-5
                      w-5

                      rounded-full
                      bg-white

                      transition-all

                      ${
                        darkMode
                          ? "right-1"
                          : "left-1"
                      }
                    `}
                  />
                </button>
              </div>

              {/* LANGUAGE */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Bahasa Sistem
                </label>

                <select
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-white/5

                    px-4
                    py-3

                    outline-none
                  "
                >
                  <option>Indonesia</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* PROFILE */}
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
            <div className="flex items-center gap-4">
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
                <UserCog
                  size={30}
                  className="text-cyan-500"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  Super Admin
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  admin@talap.com
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-sm text-gray-500">
                  Role
                </span>

                <span
                  className="
                    rounded-full
                    bg-cyan-500/10

                    px-3
                    py-1

                    text-sm
                    font-semibold
                    text-cyan-500
                  "
                >
                  Super Admin
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-sm text-gray-500">
                  Last Login
                </span>

                <span className="font-medium">
                  10 Menit Lalu
                </span>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
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
            <div className="flex items-center gap-3">
              <Bell className="text-yellow-500" />

              <h3 className="text-lg font-bold">
                Notifikasi Sistem
              </h3>
            </div>

            <div className="mt-6 space-y-4">
              {[
                "Booking baru masuk",
                "Owner baru mendaftar",
                "Pembayaran berhasil",
                "Backup database selesai",
              ].map((item, index) => (
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
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DATABASE */}
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
            <div className="flex items-center gap-3">
              <Database className="text-green-500" />

              <h3 className="text-lg font-bold">
                Database Backup
              </h3>
            </div>

            <p
              className="
                mt-4
                text-sm
                leading-7

                text-gray-500
                dark:text-gray-400
              "
            >
              Backup terakhir berhasil dilakukan
              pada 20 Mei 2026 pukul 02:00 WIB.
            </p>

            <button
              className="
                mt-6

                flex
                w-full
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-green-500

                px-5
                py-3

                text-sm
                font-semibold
                text-white

                transition
                hover:bg-green-400
              "
            >
              <Database size={18} />
              Backup Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
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
            duration-300

            hover:scale-105
            hover:bg-cyan-400
          "
        >
          <Save size={18} />
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}