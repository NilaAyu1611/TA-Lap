"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/services/auth.service";

import {
  Eye,
  EyeOff,
  CalendarDays,
  ShieldCheck,
  Trophy,
  UserPlus,
  User,
  Mail,
  LockKeyhole,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      router.push("/login");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error ||
          "Gagal mendaftar"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        overflow-hidden

        bg-gray-50
        text-gray-900

        dark:bg-gradient-to-br
        dark:from-[#0b1120]
        dark:via-[#111827]
        dark:to-[#0f172a]

        dark:text-white

        transition-all
        duration-300
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

      {/* LEFT SIDE */}
      <section
        className="
          relative
          z-10

          hidden
          w-1/2
          flex-col
          justify-center

          px-20

          lg:flex
        "
      >
        <div className="max-w-xl">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div
              className="
                rounded-2xl

                bg-cyan-500/10

                p-3
              "
            >
              <UserPlus
                className="
                  h-8
                  w-8

                  text-cyan-500
                "
              />
            </div>

            <h1
              className="
                text-5xl
                font-semibold
                tracking-tight

                text-cyan-500
              "
            >
              TA-LAP
            </h1>
          </div>

          {/* DESC */}
          <p
            className="
              mt-6
              max-w-lg

              text-lg
              leading-8
              tracking-tight

              text-gray-600
              dark:text-gray-300
            "
          >
            Bergabung dengan platform booking lapangan modern yang cepat,
            realtime, aman, dan profesional untuk pengalaman reservasi terbaik.
          </p>

          {/* FEATURES */}
          <div className="mt-14 space-y-8">
            {/* ITEM */}
            <div className="flex items-start gap-4">
              <div
                className="
                  rounded-2xl

                  bg-cyan-100
                  dark:bg-cyan-500/10

                  p-3
                "
              >
                <CalendarDays
                  className="
                    h-6
                    w-6

                    text-cyan-600
                    dark:text-cyan-400
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-base
                    font-semibold
                    tracking-tight
                  "
                >
                  Realtime Booking
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-7

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Pemesanan lapangan realtime tanpa bentrok jadwal.
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex items-start gap-4">
              <div
                className="
                  rounded-2xl

                  bg-purple-100
                  dark:bg-purple-500/10

                  p-3
                "
              >
                <ShieldCheck
                  className="
                    h-6
                    w-6

                    text-purple-600
                    dark:text-purple-400
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-base
                    font-semibold
                    tracking-tight
                  "
                >
                  Secure System
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-7

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Data akun dan transaksi lebih aman dan terpercaya.
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex items-start gap-4">
              <div
                className="
                  rounded-2xl

                  bg-green-100
                  dark:bg-green-500/10

                  p-3
                "
              >
                <Trophy
                  className="
                    h-6
                    w-6

                    text-green-600
                    dark:text-green-400
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-base
                    font-semibold
                    tracking-tight
                  "
                >
                  Modern Experience
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-7

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Tampilan modern minimalis dan nyaman digunakan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section
        className="
          relative
          z-10

          flex
          w-full
          items-center
          justify-center

          px-6
          py-10

          lg:w-1/2
        "
      >
        {/* CARD */}
        <div
          className="
            w-full
            max-w-md

            rounded-3xl
            border

            border-gray-200
            dark:border-white/10

            bg-white/90
            dark:bg-white/5

            p-8

            shadow-xl
            dark:shadow-none

            backdrop-blur-xl
          "
        >
          {/* HEADER */}
          <div className="mb-10">
            <h2
              className="
                text-3xl
                font-semibold
                tracking-tight
              "
            >
              Create Account
            </h2>

            <p
              className="
                mt-3

                text-sm
                leading-7

                text-gray-500
                dark:text-gray-400
              "
            >
              Daftar akun baru untuk mulai menggunakan TA-LAP.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* NAME */}
            {/* NAME */}
            <div>
              <label
                className="
                mb-2
                block

                text-sm
                font-medium

                text-gray-700
                dark:text-gray-300
                "
              >
                Nama Lengkap
              </label>

              <div className="relative">
                <User
                  className="
                    absolute
                    left-4
                    top-1/2

                    h-4
                    w-4

                    -translate-y-1/2

                    text-gray-400
                "
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="
                    w-full
                    rounded-2xl
                    border

                    border-gray-300
                    dark:border-white/10

                    bg-gray-100
                    dark:bg-black/20

                    py-3
                    pl-11
                    pr-4

                    text-sm

                    text-black
                    dark:text-white

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-gray-400

                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                "
                />
              </div>
            </div>

            {/* EMAIL */}
            {/* EMAIL */}
            <div>
              <label
                className="
                mb-2
                block

                text-sm
                font-medium

                text-gray-700
                dark:text-gray-300
                "
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="
                    absolute
                    left-4
                    top-1/2

                    h-4
                    w-4

                    -translate-y-1/2

                    text-gray-400
                "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                  className="
                    w-full
                    rounded-2xl
                    border

                    border-gray-300
                    dark:border-white/10

                    bg-gray-100
                    dark:bg-black/20

                    py-3
                    pl-11
                    pr-4

                    text-sm

                    text-black
                    dark:text-white

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-gray-400

                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-gray-300
                "
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="
                    absolute
                    left-4
                    top-1/2

                    h-4
                    w-4

                    -translate-y-1/2

                    text-gray-400
                    "
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="
                    w-full
                    rounded-2xl
                    border

                    border-gray-300
                    dark:border-white/10

                    bg-gray-100
                    dark:bg-black/20

                    py-3
                    pl-11
                    pr-12

                    text-sm

                    text-black
                    dark:text-white

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-gray-400

                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                    "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2

                    -translate-y-1/2

                    text-gray-500

                    transition
                    hover:text-cyan-500
                    "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-gray-300
                "
              >
                Konfirmasi Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="
                    absolute
                    left-4
                    top-1/2

                    h-4
                    w-4

                    -translate-y-1/2

                    text-gray-400
                    "
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi password"
                  required
                  className="
                    w-full
                    rounded-2xl
                    border

                    border-gray-300
                    dark:border-white/10

                    bg-gray-100
                    dark:bg-black/20

                    py-3
                    pl-11
                    pr-12

                    text-sm

                    text-black
                    dark:text-white

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-gray-400

                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-500/10
                    "
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2

                    -translate-y-1/2

                    text-gray-500

                    transition
                    hover:text-cyan-500
                    "
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl

                bg-cyan-500

                py-3

                text-sm
                font-medium
                text-white

                transition-all
                duration-300

                hover:bg-cyan-400
              "
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          {/* FOOTER */}
          <div
            className="
              mt-8

              text-center
              text-sm

              text-gray-500
              dark:text-gray-400
            "
          >
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="
                font-semibold

                text-cyan-600
                dark:text-cyan-400

                hover:underline
              "
            >
              Masuk sekarang
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
