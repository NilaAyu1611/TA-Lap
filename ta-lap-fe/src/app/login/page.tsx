"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Eye,
  EyeOff,
  Home,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import ThemeInit from "@/components/admin/ThemeInit";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { storeToken, storeUser } from "@/lib/auth";
import { redirectAfterLogin } from "@/lib/authRedirect";
import { login } from "@/services/auth.service";

const LOGIN_HERO_IMAGE = "/images/login-lapangan.png";

function HomeIconButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      title="Beranda"
      className={`
        group flex h-11 w-11 items-center justify-center rounded-xl border
        border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md
        transition hover:border-cyan-300/50 hover:bg-cyan-500/20 hover:shadow-cyan-500/20
        dark:border-white/15 dark:bg-white/10 dark:hover:border-cyan-400/40
        ${className}
      `}
    >
      <Home
        size={20}
        className="transition group-hover:scale-110 group-hover:text-cyan-300"
      />
    </Link>
  );
}

function HomeIconButtonLight({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      title="Beranda"
      className={`
        group flex h-11 w-11 items-center justify-center rounded-xl border
        border-cyan-200/80 bg-white text-cyan-600 shadow-md shadow-cyan-100
        transition hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-cyan-200
        dark:border-white/15 dark:bg-white/10 dark:text-cyan-400
        dark:shadow-none dark:hover:border-cyan-400/40 dark:hover:bg-cyan-500/10
        ${className}
      `}
    >
      <Home size={20} className="transition group-hover:scale-110" />
    </Link>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const resetSuccess = searchParams.get("reset");

  const successMessage =
    resetSuccess === "success"
      ? "Password berhasil diubah. Silakan login dengan password baru."
      : registered === "owner"
      ? "Pendaftaran owner berhasil. Tim admin akan memverifikasi akun Anda — silakan login setelah disetujui."
      : registered === "user"
        ? "Registrasi berhasil. Silakan masuk untuk mulai booking lapangan."
        : null;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await login(email, password);
      storeToken(data.token);
      storeUser(data.user);
      redirectAfterLogin(router, data.user);
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Terjadi kesalahan server";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-cyan-100 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/10";

  const featureCards = [
    {
      icon: CalendarDays,
      title: "Booking online 24 jam",
      desc: "Pesan lapangan kapan saja — pilih venue, tanggal, dan jam main langsung dari akun Anda.",
      iconWrap: "bg-cyan-500/20 text-cyan-300",
      cardClass: "border-cyan-400/25 bg-cyan-500/10",
    },
    {
      icon: Clock3,
      title: "Jadwal real-time",
      desc: "Slot kosong dan terisi diperbarui otomatis — tidak ada double booking.",
      iconWrap: "bg-violet-500/20 text-violet-300",
      cardClass: "border-violet-400/25 bg-violet-500/10",
    },
    {
      icon: MapPin,
      title: "Berbagai jenis olahraga",
      desc: "Futsal, badminton, basket, dan lapangan lain — terus bertambah di platform.",
      iconWrap: "bg-sky-500/20 text-sky-300",
      cardClass: "border-sky-400/25 bg-sky-500/10",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-cyan-50/50 to-violet-50/40 text-gray-900 transition-colors duration-300 dark:from-[#060b14] dark:via-[#060b14] dark:to-[#0a1628] dark:text-white">
      <ThemeInit />

      {/* Ambient glow — lebih kuat di light mode */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[480px] w-[480px] rounded-full bg-cyan-400/30 blur-[100px] dark:bg-cyan-500/15" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-violet-400/25 blur-[100px] dark:bg-violet-600/15" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl dark:bg-blue-500/5" />
      </div>

      {/* Mobile top bar */}
      <header className="relative z-30 flex items-center justify-between gap-3 border-b border-cyan-100/80 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#060b14]/80 lg:hidden">
        <HomeIconButtonLight />
        <ThemeToggle />
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-57px)] flex-col lg:min-h-screen lg:flex-row">
        {/* LEFT — brand panel (desktop) — overlay gelap di kedua mode agar foto tetap hidup */}
        <section className="relative hidden overflow-hidden lg:flex lg:w-[52%] lg:flex-col">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${LOGIN_HERO_IMAGE})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#041018]/88 via-cyan-950/75 to-violet-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(6,182,212,0.35),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(139,92,246,0.2),transparent_50%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <HomeIconButton />

            <div className="mt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur-sm">
                <Sparkles size={14} className="text-cyan-300" />
                Booking lapangan olahraga
              </div>
              <h1 className="mt-6 max-w-lg font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Pesan lapangan,{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300 bg-clip-text text-transparent">
                  langsung main
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-gray-300">
                Cari venue, cek jadwal kosong, dan selesaikan pesanan — semua
                real-time, dari satu platform.
              </p>
            </div>

            <div className="space-y-4">
              {featureCards.map(({ icon: Icon, title, desc, iconWrap, cardClass }) => (
                <div
                  key={title}
                  className={`flex items-start gap-4 rounded-2xl border p-4 backdrop-blur-md ${cardClass}`}
                >
                  <div className={`mt-0.5 rounded-xl p-2.5 ${iconWrap}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile hero */}
        <section className="relative h-44 overflow-hidden sm:h-52 lg:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${LOGIN_HERO_IMAGE})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041018]/85 via-cyan-950/60 to-violet-900/50" />
          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-5 sm:px-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-[11px] font-medium text-cyan-200">
              <Sparkles size={12} />
              TA-LAP Booking
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Masuk ke TA-LAP
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Booking lapangan olahraga, real-time
            </p>
          </div>
        </section>

        {/* RIGHT — form */}
        <section className="relative flex w-full flex-1 flex-col justify-center px-4 py-8 sm:px-8 lg:w-[48%] lg:px-10 lg:py-12 xl:px-16">
          <div className="absolute right-6 top-6 hidden lg:block xl:right-10 xl:top-10">
            <ThemeToggle />
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="hidden lg:block">
              <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Selamat datang kembali
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Masuk dengan email dan password akun TA-LAP Anda.
              </p>
            </div>

            <div
              className="
                relative mt-6 overflow-hidden rounded-2xl border border-cyan-100/80
                bg-white/90 p-5 shadow-xl shadow-cyan-100/50 backdrop-blur-sm sm:p-8
                dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30
              "
            >
              {/* accent strip — hidup di light mode */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500" />

              {successMessage && (
                <div className="mb-5 mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-5 mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-2 space-y-5" autoComplete="on">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/70 dark:text-gray-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500/70 dark:text-gray-400"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:text-cyan-600 dark:hover:text-gray-300"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400"
                    >
                      Lupa password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-500 hover:via-cyan-400 hover:to-sky-400 hover:shadow-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-60 dark:from-cyan-500 dark:to-cyan-400 dark:shadow-cyan-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>

              <div className="my-2 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-gray-300/80 dark:via-white/10 dark:to-white/15" />
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  atau
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 to-gray-300/80 dark:via-white/10 dark:to-white/15" />
              </div>

              <GoogleSignInButton
                disabled={loading}
                onError={(msg) => setError(msg)}
              />
            </div>

            <div className="mt-8 space-y-3 text-center text-sm">
              <p className="text-gray-700 dark:text-gray-400">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-bold text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400"
                >
                  Daftar sekarang
                </Link>
              </p>
              <p className="text-gray-600 dark:text-gray-500">
                Pemilik venue?{" "}
                <Link
                  href="/register/owner"
                  className="font-bold text-violet-600 transition hover:text-violet-500 dark:text-violet-400"
                >
                  Daftar venue
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50 dark:bg-[#060b14]">
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <Loader2 size={20} className="animate-spin text-cyan-500" />
        Memuat halaman login...
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
