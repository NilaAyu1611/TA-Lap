"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Eye,
  EyeOff,
  Home,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import ThemeInit from "@/components/admin/ThemeInit";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { register } from "@/services/auth.service";

function HomeIconButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      title="Beranda"
      className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-cyan-500/20 ${className}`}
    >
      <Home size={20} className="transition group-hover:scale-110 group-hover:text-cyan-300" />
    </Link>
  );
}

function HomeIconButtonLight({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      title="Beranda"
      className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 dark:border-white/15 dark:bg-white/10 dark:text-cyan-400 dark:hover:border-cyan-400/40 ${className}`}
    >
      <Home size={20} className="transition group-hover:scale-110" />
    </Link>
  );
}

const FEATURE_CARDS = [
  {
    icon: CalendarDays,
    title: "Booking online",
    desc: "Cari venue dan pesan jam main kapan saja.",
  },
  {
    icon: Clock3,
    title: "Jadwal real-time",
    desc: "Slot kosong diperbarui otomatis.",
  },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1626224583824-190177814a45?q=80&w=1600&auto=format&fit=crop";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-cyan-500/60 dark:focus:ring-cyan-500/15";

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

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Nomor telepon tidak valid");
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password, phone: phoneDigits });
      router.push("/login?registered=user");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Gagal mendaftar"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-cyan-50/60 to-violet-50/50 text-gray-900 transition-colors dark:from-[#060b14] dark:via-[#060b14] dark:to-[#0a1628] dark:text-white">
      <ThemeInit />

      {/* Ambient glow — light mode */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden dark:opacity-60">
        <div className="absolute -right-16 top-1/4 h-80 w-80 rounded-full bg-cyan-300/35 blur-[90px] dark:bg-cyan-500/15" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-300/30 blur-[90px] dark:bg-violet-600/15" />
        <div className="absolute right-1/2 top-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl dark:bg-blue-500/5" />
      </div>

      <header className="relative z-30 flex items-center justify-between border-b border-cyan-100/80 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-[#060b14]/80">
        <HomeIconButtonLight />
        <ThemeToggle />
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-57px)] flex-col lg:min-h-screen lg:flex-row">
        {/* LEFT */}
        <section className="relative hidden overflow-hidden lg:flex lg:w-[52%] lg:flex-col">
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#041018]/90 via-cyan-950/80 to-violet-950/75" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <HomeIconButton />

            <div>
              <h1 className="max-w-lg font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
                Booking lapangan olahraga
              </h1>
              <p className="mt-4 max-w-md text-base text-gray-300">
                Cari venue, pilih jadwal, selesaikan pesanan.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURE_CARDS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="rounded-lg bg-white/10 p-2 text-cyan-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-sm text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile hero */}
        <section className="relative h-36 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-[#041018]/80" />
          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-5">
            <h1 className="font-display text-2xl font-bold text-white">Buat akun</h1>
          </div>
        </section>

        {/* RIGHT — form */}
        <section className="relative flex flex-1 flex-col justify-center overflow-hidden px-4 py-8 sm:px-8 lg:w-[48%] lg:px-10 lg:py-10 xl:px-16">
          {/* Panel accent — form side */}
          <div className="pointer-events-none absolute inset-0 lg:hidden dark:opacity-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/50 to-violet-50/40" />
          </div>
          <div className="pointer-events-none absolute -right-20 top-20 hidden h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl lg:block dark:bg-cyan-500/10" />
          <div className="pointer-events-none absolute -left-10 bottom-16 hidden h-56 w-56 rounded-full bg-violet-200/25 blur-3xl lg:block dark:bg-violet-500/10" />

          <div className="absolute right-6 top-6 z-20 hidden lg:block xl:right-10 xl:top-10">
            <ThemeToggle />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className="mb-6 lg:mb-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Buat akun
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Lengkapi data berikut untuk mulai booking.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white/95 p-5 shadow-lg shadow-cyan-100/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-7">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nama lengkap
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nomor telepon
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Konfirmasi password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      required
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={
                        showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"
                      }
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-500 dark:hover:bg-cyan-400"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Daftar"
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 space-y-2 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold text-cyan-600 dark:text-cyan-400">
                  Masuk
                </Link>
              </p>
              <p>
                <Link href="/register/owner" className="font-semibold text-violet-600 dark:text-violet-400">
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
