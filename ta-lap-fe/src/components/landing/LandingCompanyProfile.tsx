"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Handshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Terpercaya",
    desc: "Pembayaran aman dan setiap transaksi tercatat jelas di sistem.",
  },
  {
    icon: Sparkles,
    title: "Mudah digunakan",
    desc: "Cari venue, pilih jadwal, dan bayar — semua dari satu platform.",
  },
  {
    icon: Handshake,
    title: "Transparan",
    desc: "Harga per sesi, slot kosong, dan status pesanan selalu terlihat.",
  },
  {
    icon: Users,
    title: "Kolaboratif",
    desc: "Menghubungkan pemain, pemilik venue, dan tim platform dalam satu ekosistem.",
  },
];

type Props = {
  venueCount?: number;
  compact?: boolean;
};

export default function LandingCompanyProfile({
  venueCount = 0,
  compact = false,
}: Props) {
  const venueLabel =
    venueCount > 0 ? `${venueCount}+ venue terdaftar` : "Venue terus bertambah";

  return (
    <section
      id="tentang"
      className="scroll-mt-24 border-t border-gray-200 bg-gradient-to-b from-gray-50/80 to-white px-4 py-16 dark:border-white/10 dark:from-white/[0.02] dark:to-[#060b14] sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
            Tentang TA-LAP
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
            Platform booking lapangan olahraga yang{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              menghubungkan semua pihak
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            TA-LAP hadir untuk memudahkan pemain menemukan dan memesan lapangan,
            sekaligus membantu pemilik venue mengelola pesanan secara digital —
            praktis, terstruktur, dan siap tumbuh bersama bisnis Anda.
          </p>
        </div>

        {/* Trust stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { value: venueLabel, label: "Jaringan venue" },
            { value: "24/7", label: "Booking online kapan saja" },
            { value: "Real-time", label: "Jadwal slot langsung update" },
            { value: "Aman", label: "Pembayaran via gateway terpercaya" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="font-display text-lg font-bold text-cyan-600 dark:text-cyan-400 sm:text-xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Visi & Misi */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-white p-7 dark:border-cyan-500/20 dark:from-cyan-950/30 dark:to-[#060b14] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15">
              <Eye className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">Visi</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
              Menjadi platform booking lapangan olahraga yang mudah
              diakses dan dipercaya, tempat pemain booking tanpa ribet, dan
              venue berkembang dengan sistem yang rapi.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-white p-7 dark:border-violet-500/20 dark:from-violet-950/30 dark:to-[#060b14] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">
              <Target className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">Misi</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                Mempermudah pemain menemukan lapangan sesuai kota dan jadwal.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                Mendigitalisasi operasional booking untuk pemilik venue.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                Menyediakan alur pembayaran dan pencatatan transaksi yang transparan.
              </li>
            </ul>
          </div>
        </div>

        {/* Nilai inti */}
        <div className="mt-14">
          <h3 className="text-center font-display text-xl font-bold sm:text-2xl">
            Nilai yang kami pegang
          </h3>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5">
                  <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="mt-4 font-semibold text-gray-900 dark:text-white">
                  {title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Siapa kami + CTA */}
        {!compact && (
          <div className="mt-14 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
            <div className="grid lg:grid-cols-5">
              <div className="relative min-h-[220px] bg-gradient-to-br from-cyan-600 via-cyan-500 to-violet-600 lg:col-span-2 lg:min-h-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="relative flex h-full flex-col justify-end p-7 text-white sm:p-8">
                  <MapPin className="h-8 w-8 text-cyan-100" />
                  <p className="mt-4 font-display text-xl font-bold">
                    Dibangun untuk ekosistem olahraga lokal
                  </p>
                  <p className="mt-2 text-sm text-cyan-50/90">
                    Dari lapangan futsal hingga badminton — satu platform untuk
                    semua kebutuhan booking Anda.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-8 lg:col-span-3">
                <h3 className="font-display text-xl font-bold sm:text-2xl">
                  Siapa TA-LAP?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                  TA-LAP adalah sistem informasi pemesanan lapangan olahraga
                  berbasis web. Kami fokus pada pengalaman pengguna yang
                  sederhana: pemain bisa booking cepat, pemilik venue bisa kelola
                  pesanan dan pendapatan, sementara platform menjaga alur
                  pembayaran tetap aman dan terdokumentasi.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                  Baik Anda ingin main rutin setiap minggu atau mengelola
                  beberapa lapangan sekaligus — TA-LAP dirancang agar prosesnya
                  jelas dari awal sampai selesai.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
                  >
                    Mulai booking
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/register/owner"
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
                  >
                    Daftarkan venue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
