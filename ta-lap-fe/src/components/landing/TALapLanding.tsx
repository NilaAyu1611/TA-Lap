"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingCompanyProfile from "@/components/landing/LandingCompanyProfile";
import LandingAuthModal from "@/components/landing/LandingAuthModal";
import LandingLapanganCard from "@/components/landing/LandingLapanganCard";
import { getPublicLapanganPreview } from "@/services/lapangan.service";
import { Lapangan } from "@/types/lapangan";
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileBarChart2,
  Loader2,
  MapPin,
  Menu,
  Percent,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "#lapangan", label: "Venue" },
  { href: "#fitur", label: "Fitur" },
  { href: "#pemain", label: "Cara Pesan" },
  { href: "#owner", label: "Mitra Venue" },
  { href: "#tentang", label: "Tentang Kami" },
];

const VALUE_PILLARS = [
  {
    icon: Clock3,
    title: "Pesan kapan saja",
    desc: "Tidak perlu telepon atau chat — booking bisa dilakukan malam hari sekalipun.",
  },
  {
    icon: CalendarDays,
    title: "Jadwal langsung terlihat",
    desc: "Slot kosong dan terisi diperbarui otomatis, jadi jadwal main tidak bentrok.",
  },
  {
    icon: CreditCard,
    title: "Bayar sesuai venue",
    desc: "QRIS, transfer VA, e-wallet, atau langsung di lapangan — tergantung kebijakan venue.",
  },
  {
    icon: MapPin,
    title: "Berbagai olahraga",
    desc: "Futsal, badminton, basket, dan jenis lapangan lain — dan terus bertambah.",
  },
];

const PLAYER_FEATURES = [
  {
    icon: CalendarDays,
    iconClass: "text-cyan-600 dark:text-cyan-400",
    bgClass: "bg-cyan-500/15",
    title: "Pilih venue & jam main",
    desc: "Foto, alamat, harga per sesi, dan fasilitas — semua terlihat sebelum Anda pesan.",
  },
  {
    icon: Clock3,
    iconClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-500/15",
    title: "Jadwal real-time",
    desc: "Slot kosong langsung terlihat. Jam yang sudah dipesan otomatis tertutup.",
  },
  {
    icon: CreditCard,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/15",
    title: "Bayar sesuai venue",
    desc: "QRIS, transfer, e-wallet, atau langsung di lapangan — tergantung kebijakan venue.",
  },
  {
    icon: MapPin,
    iconClass: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-500/15",
    title: "Cari per kota",
    desc: "Temukan lapangan di kotamu tanpa harus hubungi venue satu per satu.",
  },
];

const OWNER_FEATURES = [
  {
    icon: Bell,
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-500/15",
    title: "Pesanan masuk otomatis",
    desc: "Notifikasi langsung saat ada booking baru — tidak perlu catat manual.",
  },
  {
    icon: FileBarChart2,
    iconClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-500/15",
    title: "Rekap pendapatan",
    desc: "Lihat transaksi, pendapatan bersih, dan komisi platform per periode.",
  },
  {
    icon: Building2,
    iconClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-500/15",
    title: "Kelola banyak lapangan",
    desc: "Satu akun owner untuk beberapa venue — data terpusat di satu dashboard.",
  },
  {
    icon: Percent,
    iconClass: "text-fuchsia-600 dark:text-fuchsia-400",
    bgClass: "bg-fuchsia-500/15",
    title: "Bayar kalau dapat pesanan",
    desc: "Komisi platform hanya dipotong dari transaksi yang benar-benar terjadi.",
  },
];

const PLAYER_STEPS = [
  {
    step: "1",
    title: "Daftar akun",
    desc: "Gratis — cukup email dan data dasar, langsung bisa cari lapangan.",
  },
  {
    step: "2",
    title: "Pilih venue & jadwal",
    desc: "Cari berdasarkan kota, pilih tanggal dan jam yang masih kosong.",
  },
  {
    step: "3",
    title: "Bayar & main",
    desc: "Selesaikan pembayaran, datang sesuai jadwal. Riwayat pesanan tersimpan di akun.",
  },
];

const OWNER_POINTS = [
  "Daftar venue gratis — tanpa biaya bulanan atau langganan",
  "Komisi platform hanya dipotong per transaksi berhasil",
  "Venue tampil di pencarian pemain setelah verifikasi admin",
  "Pesanan, jadwal, dan rekap pendapatan dalam satu dashboard",
];

const PREVIEW_PLACEHOLDERS: Lapangan[] = [
  {
    id: "preview-1",
    nama: "Lapangan Futsal Premium",
    jenis: "futsal",
    jenis_id: 1,
    harga: 150000,
    status: true,
    gambar:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    deskripsi: "Venue futsal indoor dengan lighting standar pertandingan.",
    alamat: null,
    kota: "Jakarta",
    kapasitas: null,
    indoor: true,
    jumlah_court: null,
    jam_buka: null,
    jam_tutup: null,
    google_maps_url: null,
    latitude: null,
    longitude: null,
    owner_id: null,
    owner_name: null,
    owner_business_name: null,
    owner_email: null,
    totalBooking: 0,
    created_at: "",
  },
  {
    id: "preview-2",
    nama: "Badminton Center",
    jenis: "badminton",
    jenis_id: 2,
    harga: 80000,
    status: true,
    gambar:
      "https://images.unsplash.com/photo-1626224583824-190177814a45?q=80&w=1200&auto=format&fit=crop",
    deskripsi: "Lapangan badminton ber-AC, cocok untuk latihan dan turnamen.",
    alamat: null,
    kota: "Bandung",
    kapasitas: null,
    indoor: true,
    jumlah_court: null,
    jam_buka: null,
    jam_tutup: null,
    google_maps_url: null,
    latitude: null,
    longitude: null,
    owner_id: null,
    owner_name: null,
    owner_business_name: null,
    owner_email: null,
    totalBooking: 0,
    created_at: "",
  },
  {
    id: "preview-3",
    nama: "Arena Futsal Kota",
    jenis: "futsal",
    jenis_id: 1,
    harga: 120000,
    status: true,
    gambar:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1200&auto=format&fit=crop",
    deskripsi: "Lapangan outdoor dengan rumput sintetis berkualitas.",
    alamat: null,
    kota: "Surabaya",
    kapasitas: null,
    indoor: false,
    jumlah_court: null,
    jam_buka: null,
    jam_tutup: null,
    google_maps_url: null,
    latitude: null,
    longitude: null,
    owner_id: null,
    owner_name: null,
    owner_business_name: null,
    owner_email: null,
    totalBooking: 0,
    created_at: "",
  },
];

export default function TALapLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authContext, setAuthContext] = useState<"book" | "browse">("book");
  const [lapanganPreview, setLapanganPreview] = useState<Lapangan[]>([]);
  const [totalLapangan, setTotalLapangan] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getPublicLapanganPreview(3);
        if (cancelled) return;
        if (result.data?.length) {
          setLapanganPreview(result.data);
          setTotalLapangan(result.total ?? result.data.length);
          setUsingFallback(false);
        } else {
          setLapanganPreview(PREVIEW_PLACEHOLDERS);
          setTotalLapangan(PREVIEW_PLACEHOLDERS.length);
          setUsingFallback(true);
        }
      } catch {
        if (!cancelled) {
          setLapanganPreview(PREVIEW_PLACEHOLDERS);
          setTotalLapangan(PREVIEW_PLACEHOLDERS.length);
          setUsingFallback(true);
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openAuth = useCallback((context: "book" | "browse") => {
    setAuthContext(context);
    setAuthOpen(true);
  }, []);

  const authModalCopy =
    authContext === "browse"
      ? {
          title: "Masuk untuk lihat semua venue",
          description: `Anda sedang melihat cuplikan saja. ${totalLapangan > 3 ? `Ada ${totalLapangan} lapangan` : "Daftar lapangan lengkap"} tersedia setelah login — termasuk detail venue dan proses booking.`,
        }
      : {
          title: "Login dulu untuk pesan",
          description:
            "Buat akun TA-LAP untuk memilih jadwal dan menyelesaikan pesanan.",
        };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#060b14] dark:text-white">
      <LandingAuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title={authModalCopy.title}
        description={authModalCopy.description}
      />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#060b14]/85">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLogo href="/" subtitle="Booking lapangan olahraga" accent="cyan" />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 md:inline-block"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="hidden rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400 sm:inline-block"
            >
              Daftar
            </Link>
            <Link
              href="/register/owner"
              className="hidden rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 lg:inline-block"
            >
              Daftar venue
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 lg:hidden"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-200 px-4 py-4 dark:border-white/10 lg:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {link.label}
                </a>
              ))}
              <div className="my-2 border-t border-gray-100 dark:border-white/10" />
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-cyan-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Daftar 
              </Link>
              <Link
                href="/register/owner"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-center text-sm font-medium text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
              >
                Daftar venue
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO + LAPANGAN PREVIEW */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Platform booking lapangan olahraga
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Cari lapangan, pilih jadwal,{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                langsung pesan
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              Lihat beberapa venue di bawah ini. Daftar akun untuk booking,
              cek jadwal lengkap, dan simpan riwayat pesanan Anda.
            </p>
          </div>

          {/* LAPANGAN PREVIEW */}
          <div id="lapangan" className="scroll-mt-24 mt-12 sm:mt-14">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Venue di platform</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {previewLoading
                    ? "Memuat..."
                    : usingFallback
                      ? "Contoh tampilan — login untuk data venue aktual"
                      : `${lapanganPreview.length} dari ${totalLapangan} lapangan`}
                </p>
              </div>
              {!previewLoading && (
                <button
                  type="button"
                  onClick={() => openAuth("browse")}
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 sm:self-auto"
                >
                  Lihat semua lapangan
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {previewLoading ? (
              <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="animate-spin" size={18} />
                  Memuat venue...
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {lapanganPreview.map((item) => (
                  <LandingLapanganCard
                    key={item.id}
                    lapangan={item}
                    onBook={() => openAuth("book")}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openAuth("browse")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 sm:w-auto"
              >
                Login untuk lihat & pesan semua venue
                <ArrowRight size={16} />
              </button>
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-cyan-300 dark:border-white/15 dark:text-gray-200 sm:w-auto"
              >
                Belum punya akun? Daftar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section className="border-y border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
          {VALUE_PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIENCE PATHS */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Mau main atau kelola venue?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
              TA-LAP punya jalur berbeda untuk pemain dan pemilik lapangan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Pemain — fokus kemudahan & kecepatan */}
            <div className="flex flex-col rounded-3xl border border-cyan-200/60 bg-white p-7 shadow-sm dark:border-cyan-500/20 dark:bg-white/[0.03]">
              <span className="inline-flex w-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                Untuk pemain
              </span>
              <h3 className="mt-4 font-display text-xl font-bold sm:text-2xl">
                Mau main? Pesannya di sini.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Cari lapangan di kotamu, lihat slot kosong, tentukan jam main —
                selesai dalam beberapa menit. Tidak perlu telepon atau chat
                bolak-balik ke venue.
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-5 dark:border-white/10">
                {[
                  "Gratis daftar, langsung bisa cari lapangan",
                  "Riwayat pesanan tersimpan di akun",
                  "Bayar online atau di venue — sesuai pilihan venue",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Daftar gratis
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Owner — fokus bisnis & operasional */}
            <div className="flex flex-col rounded-3xl border border-violet-200/60 bg-white p-7 shadow-sm dark:border-violet-500/20 dark:bg-white/[0.03]">
              <span className="inline-flex w-fit rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                Untuk pemilik venue
              </span>
              <h3 className="mt-4 font-display text-xl font-bold sm:text-2xl">
                Punya lapangan? Biar pemesanannya rapi.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Kurangi repot catat manual lewat chat atau buku tulis. Pesanan
                masuk tercatat otomatis, jadwal ter-update, dan pendapatan bisa
                dipantau dari dashboard owner.
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-5 dark:border-white/10">
                {[
                  "Daftar gratis — tanpa biaya bulanan",
                  "Komisi hanya saat ada transaksi berhasil",
                  "Kelola lapangan & pantau pendapatan dari dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register/owner"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Daftar sebagai mitra venue
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — split by audience */}
      <section id="fitur" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Dibuat untuk pemain dan pemilik venue
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Fitur berbeda, kebutuhan berbeda — semuanya dalam satu platform.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* ── Pemain ── */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-7 shadow-sm dark:border-cyan-500/20 dark:from-cyan-950/30 dark:via-[#060b14] dark:to-sky-950/20 sm:p-8">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />

              <span className="relative inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                Untuk pemain
              </span>
              <h3 className="relative mt-4 font-display text-xl font-bold sm:text-2xl">
                Pesan lapangan, langsung main
              </h3>
              <p className="relative mt-2 text-sm text-gray-600 dark:text-gray-300">
                Gratis daftar. Cari venue, pilih jadwal, bayar — selesai dari HP.
              </p>

              <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
                {PLAYER_FEATURES.map(({ icon: Icon, title, desc, iconClass, bgClass }) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className={`mb-3 inline-flex rounded-xl p-2.5 ${bgClass}`}>
                      <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="relative mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Daftar 
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* ── Owner ── */}
            <div className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-7 shadow-sm dark:border-violet-500/20 dark:from-violet-950/30 dark:via-[#060b14] dark:to-fuchsia-950/20 sm:p-8">
              <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl" />

              <span className="relative inline-flex rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                Untuk pemilik venue
              </span>
              <h3 className="relative mt-4 font-display text-xl font-bold sm:text-2xl">
                Kelola venue, dapat pesanan otomatis
              </h3>
              <p className="relative mt-2 text-sm text-gray-600 dark:text-gray-300">
                Daftar gratis. Komisi platform hanya dipotong saat ada transaksi
                yang benar-benar terjadi.
              </p>

              {/* Pricing highlight */}
              <div className="relative mt-5 rounded-2xl border border-violet-200/80 bg-white/90 p-5 dark:border-violet-500/25 dark:bg-white/[0.06]">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="font-display text-3xl font-bold text-violet-600 dark:text-violet-400">
                    Gratis
                  </span>
                  <span className="pb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    daftar & pasang venue
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Tidak ada biaya bulanan. Komisi platform dipotong per
                  transaksi berhasil — bayar hanya kalau venue Anda dapat
                  pesanan.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Tanpa langganan", "Bayar per transaksi", "Transparan di dashboard"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:text-violet-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="relative mt-5 grid gap-4 sm:grid-cols-2">
                {OWNER_FEATURES.map(({ icon: Icon, title, desc, iconClass, bgClass }) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-white/80 bg-white/80 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className={`mb-3 inline-flex rounded-xl p-2.5 ${bgClass}`}>
                      <Icon className={`h-5 w-5 ${iconClass}`} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/register/owner"
                className="relative mt-6 inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Daftar venue — gratis
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="pemain"
        className="scroll-mt-24 bg-gradient-to-b from-cyan-50/50 to-transparent px-4 py-16 dark:from-cyan-950/20 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Cara pesan
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                Tiga langkah, langsung main
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Tidak perlu pusing — alurnya sederhana dan bisa diselesaikan dari
                HP.
              </p>
              <div className="mt-8 space-y-6">
                {PLAYER_STEPS.map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-sm font-bold text-white">
                      {step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => openAuth("book")}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
              >
                Mulai pesan
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="rounded-3xl border border-cyan-200/50 bg-white p-7 shadow-xl dark:border-cyan-500/20 dark:bg-white/5">
              <h3 className="font-semibold">Setelah login, Anda bisa</h3>
              <p className="mt-1 text-sm text-gray-500">
                Ringkasan singkat alur di dashboard pemain.
              </p>
              <dl className="mt-6 space-y-4">
                {[
                  { term: "Pilih jenis olahraga", detail: "Futsal, badminton, dan lainnya" },
                  { term: "Pilih venue", detail: "Foto, alamat, dan harga per sesi" },
                  { term: "Tentukan jadwal", detail: "Tanggal dan jam yang masih kosong" },
                  { term: "Selesaikan bayar", detail: "Online atau di venue" },
                ].map((row) => (
                  <div
                    key={row.term}
                    className="flex flex-col gap-0.5 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-white/10 sm:flex-row sm:justify-between"
                  >
                    <dt className="text-sm text-gray-500">{row.term}</dt>
                    <dd className="text-sm font-medium">{row.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER */}
      <section id="owner" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white shadow-2xl dark:border-violet-500/30 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
                  Mitra venue
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold sm:text-3xl">
                  Bawa lapangan Anda ke lebih banyak pemain
                </h2>
                <p className="mt-4 leading-relaxed text-violet-100">
                  Daftar venue gratis — tidak ada biaya bulanan. Setelah
                  verifikasi admin, venue Anda tampil di pencarian pemain.
                  Komisi platform hanya dipotong dari transaksi yang berhasil,
                  dan semuanya tercatat transparan di dashboard owner.
                </p>
                <Link
                  href="/register/owner"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-violet-700 hover:bg-violet-50"
                >
                  Mulai pendaftaran venue
                  <ArrowRight size={16} />
                </Link>
              </div>
              <ul className="space-y-3">
                {OWNER_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <span className="text-sm font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LandingCompanyProfile venueCount={totalLapangan} compact />

      <LandingFooter />
    </main>
  );
}
