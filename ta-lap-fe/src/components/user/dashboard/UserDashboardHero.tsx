"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

import PesananStatusBadge from "@/components/admin/pesanan/PesananStatusBadge";
import { getLapanganCover } from "@/lib/lapanganMedia";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { getPaymentPageHref, needsPayment } from "@/lib/pesananPayment";
import { UserDashboardBooking, UserDashboardStats } from "@/types/userDashboard";
import { PesananStatus } from "@/types/pesanan";

type Props = {
  userName: string;
  city?: string | null;
  stats: UserDashboardStats;
  nextBooking?: UserDashboardBooking | null;
};

export default function UserDashboardHero({
  userName,
  city,
  stats,
  nextBooking,
}: Props) {
  const firstName = userName.split(/\s+/)[0] || userName;
  const isNewUser = stats.totalBooking === 0;

  const showPayCta =
    nextBooking &&
    needsPayment({
      status: nextBooking.status,
      pembayaran: nextBooking.pembayaran_status
        ? {
            status: nextBooking.pembayaran_status,
            metode: nextBooking.pembayaran_metode || undefined,
          }
        : null,
    });

  const subtitle =
    stats.bookingHariIni > 0
      ? `Hari ini ada ${stats.bookingHariIni} jadwal main — siapkan diri & datang tepat waktu.`
      : stats.bookingMendatang > 0
        ? `${stats.bookingMendatang} jadwal mendatang. Pastikan booking sudah lunas.`
        : stats.totalBooking === 0
          ? `${stats.totalLapanganTersedia} lapangan tersedia di sekitar Anda.`
          : "Kelola jadwal, bayar booking, dan nikmati olahraga favorit.";

  return (
    <div className="space-y-5">
      {/* Welcome bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isNewUser ? "Selamat datang di TA-LAP" : "Selamat datang kembali"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Halo, {firstName} 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
          {city && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
              <MapPin size={12} className="text-cyan-600 dark:text-cyan-400" />
              {city}
            </p>
          )}
        </div>

        {/* Stat pills — kontekstual, bukan "Lunas" untuk user baru */}
        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
          <StatPill
            icon={CalendarClock}
            label="Jadwal mendatang"
            value={String(stats.bookingMendatang)}
            accent="cyan"
            href={stats.bookingMendatang > 0 ? "/user/pesanan" : undefined}
          />
          <SecondaryStatPill stats={stats} />
        </div>
      </div>

      {/* Next booking ticket OR empty state */}
      {nextBooking ? (
        <NextBookingTicket
          booking={nextBooking}
          showPayCta={Boolean(showPayCta)}
        />
      ) : (
        <EmptyBookingCard totalLapangan={stats.totalLapanganTersedia} />
      )}

      {/* Quick actions — satu baris rapi */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ActionTile
          href="/user/lapangan"
          icon={Search}
          label="Cari Lapangan"
          sub={`${stats.totalLapanganTersedia} venue`}
          primary
        />
        <ActionTile
          href="/user/pembayaran"
          icon={CreditCard}
          label="Pembayaran"
          sub={
            stats.menungguBayar > 0
              ? `${stats.menungguBayar} belum lunas`
              : "Riwayat bayar"
          }
          warn={stats.menungguBayar > 0}
        />
        <ActionTile
          href="/user/pesanan"
          icon={CalendarDays}
          label="Pesanan Saya"
          sub={`${stats.bookingMendatang} aktif`}
        />
        <ActionTile
          href="/user/profile"
          icon={MapPin}
          label="Profil"
          sub="Akun & pengaturan"
          className="hidden sm:flex"
        />
      </div>
    </div>
  );
}

type StatAccent = "cyan" | "amber" | "emerald" | "violet";

function SecondaryStatPill({ stats }: { stats: UserDashboardStats }) {
  if (stats.menungguBayar > 0) {
    return (
      <StatPill
        icon={CreditCard}
        label="Perlu dibayar"
        value={`${stats.menungguBayar} pesanan`}
        accent="amber"
        href="/user/pembayaran"
      />
    );
  }

  if (stats.pembayaranMenunggu > 0) {
    return (
      <StatPill
        icon={Clock3}
        label="Menunggu konfirmasi"
        value={`${stats.pembayaranMenunggu} pembayaran`}
        accent="amber"
        href="/user/pesanan"
      />
    );
  }

  if (stats.totalBooking === 0) {
    return (
      <StatPill
        icon={Sparkles}
        label="Langkah pertama"
        value={`${stats.totalLapanganTersedia} venue siap`}
        accent="violet"
        href="/user/lapangan"
      />
    );
  }

  return (
    <StatPill
      icon={CheckCircle2}
      label="Pembayaran"
      value="Semua lunas"
      accent="emerald"
      href="/user/pembayaran"
    />
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  accent,
  href,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
  accent: StatAccent;
  href?: string;
}) {
  const colors: Record<StatAccent, string> = {
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/30",
    amber:
      "bg-amber-50 text-amber-700 ring-amber-200/80 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
    emerald:
      "bg-emerald-50 text-emerald-700 ring-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
    violet:
      "bg-violet-50 text-violet-700 ring-violet-200/80 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30",
  };

  const inner = (
    <div
      className={`inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 ring-1 ${colors[accent]}`}
    >
      <Icon size={18} className="shrink-0 opacity-80" />
      <div className="text-left">
        <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
          {label}
        </p>
        <p className="text-sm font-bold tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition hover:scale-[1.02]">
        {inner}
      </Link>
    );
  }
  return inner;
}

function NextBookingTicket({
  booking,
  showPayCta,
}: {
  booking: UserDashboardBooking;
  showPayCta: boolean;
}) {
  const cover = getLapanganCover({
    gambar: booking.lapangan_gambar,
    images: [],
  });

  const detailHref = booking.lapangan_id
    ? `/user/lapangan/${booking.lapangan_id}`
    : "/user/pesanan";

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 transition hover:shadow-xl dark:border-white/10 dark:bg-gray-900/40 dark:shadow-none dark:hover:border-white/15">
      <div className="grid md:grid-cols-[minmax(0,340px),1fr]">
        {/* Image panel */}
        <div className="relative h-44 overflow-hidden md:h-full md:min-h-[220px]">
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/10 md:to-black/40" />
          <div className="absolute bottom-4 left-4 right-4 md:hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Main berikutnya
            </p>
            <p className="mt-0.5 truncate text-lg font-bold text-white">
              {booking.lapangan_nama}
            </p>
          </div>
        </div>

        {/* Details panel */}
        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300">
                Main berikutnya
              </span>
              <PesananStatusBadge
                status={booking.status as PesananStatus}
              />
            </div>

            <h2 className="mt-3 hidden text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:block">
              {booking.lapangan_nama}
            </h2>
            {booking.lapangan_jenis && (
              <p className="mt-1 hidden text-sm text-gray-500 md:block">
                {booking.lapangan_jenis}
                {booking.lapangan_kota ? ` · ${booking.lapangan_kota}` : ""}
              </p>
            )}

            <p className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400 md:mt-3">
              {booking.kode_booking}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MetaItem
                icon={CalendarDays}
                label="Tanggal"
                value={formatDate(booking.tanggal_booking)}
              />
              <MetaItem
                icon={Clock3}
                label="Jam"
                value={`${formatTime(booking.jam_mulai)}–${formatTime(booking.jam_selesai)}`}
              />
              <MetaItem
                icon={CreditCard}
                label="Total"
                value={formatRupiah(booking.total_harga)}
                highlight
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {showPayCta && (
              <Link
                href={getPaymentPageHref(booking.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 sm:flex-none"
              >
                Bayar Sekarang
                <ArrowRight size={16} />
              </Link>
            )}
            <Link
              href={detailHref}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:flex-none"
            >
              Detail Venue
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/user/pesanan"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Semua jadwal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-white/5">
      <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
        <Icon size={11} />
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-semibold tabular-nums ${
          highlight
            ? "text-gray-900 dark:text-white"
            : "text-gray-700 dark:text-gray-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyBookingCard({ totalLapangan }: { totalLapangan: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-cyan-300/60 bg-gradient-to-br from-cyan-50/80 via-white to-violet-50/50 p-8 text-center dark:border-cyan-500/30 dark:from-cyan-950/20 dark:via-gray-900/30 dark:to-violet-950/20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-500/20">
        <Trophy size={32} className="text-cyan-600 dark:text-cyan-400" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
        Belum ada jadwal main
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {totalLapangan} lapangan siap dipesan — futsal, badminton, basket, dan
        lainnya. Booking dalam hitungan menit.
      </p>
      <Link
        href="/user/lapangan"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-500"
      >
        <Search size={18} />
        Jelajahi Lapangan
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function ActionTile({
  href,
  icon: Icon,
  label,
  sub,
  primary,
  warn,
  className = "",
}: {
  href: string;
  icon: typeof Search;
  label: string;
  sub: string;
  primary?: boolean;
  warn?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-2 rounded-2xl border p-4 transition hover:shadow-md ${
        primary
          ? "border-cyan-200 bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 dark:border-cyan-500/30"
          : warn
            ? "border-amber-200 bg-amber-50 hover:border-amber-300 dark:border-amber-500/30 dark:bg-amber-500/10"
            : "border-gray-200/80 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
      } ${className}`}
    >
      <Icon
        size={20}
        className={
          primary
            ? "text-white/90"
            : warn
              ? "text-amber-600 dark:text-amber-400"
              : "text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
        }
      />
      <div>
        <p
          className={`text-sm font-semibold ${
            primary
              ? "text-white"
              : warn
                ? "text-amber-900 dark:text-amber-200"
                : "text-gray-900 dark:text-white"
          }`}
        >
          {label}
        </p>
        <p
          className={`mt-0.5 text-[11px] ${
            primary
              ? "text-white/75"
              : warn
                ? "text-amber-700/80 dark:text-amber-300/80"
                : "text-gray-500"
          }`}
        >
          {sub}
        </p>
      </div>
    </Link>
  );
}
