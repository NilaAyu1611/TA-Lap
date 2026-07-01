"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Clock3,
  Calendar,
  Wallet,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
  XCircle,
  CreditCard,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import CancelPesananDialog from "@/components/user/CancelPesananDialog";
import PaymentDeadlineBanner from "@/components/user/PaymentDeadlineBanner";
import PesananPaymentAction from "@/components/user/pesanan/PesananPaymentAction";
import UserPesananFilters from "@/components/user/pesanan/UserPesananFilters";
import { cancelPesanan, getMyPesanan } from "@/services/pesanan.service";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { countNeedsPayment, getPaymentPageHref, isAwaitingPaymentConfirmation, isPaymentSuccess, needsPayment } from "@/lib/pesananPayment";
import {
  filterVisibleUserPesanans,
  getCancelledHideSecondsLeft,
} from "@/lib/pesananVisibility";
import {
  filterUserPesanans,
  UserPesananStatusFilter,
} from "@/lib/userPesananFilter";
import { Pesanan } from "@/types/pesanan";

export default function PesananPage() {
  const [pesanans, setPesanans] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Pesanan | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<UserPesananStatusFilter>("all");

  const loadData = async () => {
    try {
      const result = await getMyPesanan();
      setPesanans(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const visiblePesanans = useMemo(
    () => filterVisibleUserPesanans(pesanans, now),
    [pesanans, now]
  );

  const filteredPesanans = useMemo(
    () =>
      filterUserPesanans(visiblePesanans, {
        search,
        status: statusFilter,
      }),
    [visiblePesanans, search, statusFilter]
  );

  const hasActiveFilter = search.trim() !== "" || statusFilter !== "all";

  const handleCancel = async (alasan?: string) => {
    if (!cancelTarget) return;
    const result = await cancelPesanan(cancelTarget.id, alasan);
    setToast(result.message);
    setTimeout(() => setToast(null), 4000);
    setPesanans((prev) =>
      prev.map((p) => (p.id === cancelTarget.id ? result.data : p))
    );
  };

  const canCancel = (status: string) =>
    status === "pending" || status === "dibayar";

  const unpaidCount = useMemo(
    () => countNeedsPayment(visiblePesanans),
    [visiblePesanans]
  );

  return (
    <main
      className="
        min-h-screen

        bg-gray-50
        text-gray-900

        transition-all
        duration-300

        dark:bg-[#0b1120]
        dark:text-white
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]

            h-80
            w-80

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

            h-80
            w-80

            rounded-full
            bg-blue-500/10

            blur-3xl
          "
        />
      </div>

      {/* NAVBAR */}
      <UserNavbar active="pesanan" />

      {toast && (
        <div className="fixed right-6 top-24 z-50 max-w-sm rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
            "
          >
            Riwayat Pesanan
          </h1>

          <p
            className="
              mt-3
              max-w-2xl

              text-sm
              leading-7

              text-gray-500
              dark:text-gray-400
            "
          >
            Kelola dan pantau seluruh riwayat booking
            lapangan Anda secara realtime dan modern.
          </p>
        </div>

        {unpaidCount > 0 && (
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-5 dark:border-amber-500/30 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                {unpaidCount} booking belum dibayar
              </p>
              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/90">
                Bayar sebelum H-15 menit jam main. Jika belum dibayar, booking
                otomatis dibatalkan dan slot kembali tersedia.
              </p>
            </div>
            <Link
              href="/user/pembayaran"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
            >
              <CreditCard size={16} />
              Ke Halaman Pembayaran
            </Link>
          </div>
        )}

        {!loading && visiblePesanans.length > 0 && (
          <UserPesananFilters
            search={search}
            status={statusFilter}
            resultCount={filteredPesanans.length}
            totalCount={visiblePesanans.length}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onReset={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          />
        )}

        {/* CARD LIST */}
        <div className="mt-10 space-y-6">
          {loading && (
            <p className="text-center text-gray-500">Memuat pesanan...</p>
          )}
          {!loading &&
            visiblePesanans.length > 0 &&
            filteredPesanans.length === 0 && (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white/70 py-16 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <h3 className="text-lg font-semibold">Pesanan tidak ditemukan</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Coba kata kunci lain atau ubah filter status.
                </p>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 text-sm font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
                  >
                    Reset pencarian & filter
                  </button>
                )}
              </div>
            )}
          {filteredPesanans.map((item) => {
            const hideSecondsLeft = getCancelledHideSecondsLeft(item, now);
            const isFadingOut =
              item.status === "dibatalkan" &&
              hideSecondsLeft !== null &&
              hideSecondsLeft <= 3;

            return (
            <div
              key={item.id}
              className={`
                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                p-7

                shadow-lg
                backdrop-blur-xl

                transition-all
                duration-500

                ${isFadingOut ? "scale-[0.98] opacity-40" : "hover:-translate-y-1 hover:border-cyan-500/30"}
              `}
            >
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
                {/* LEFT */}
                <div className="flex-1">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    <h2
                      className="
                        text-2xl
                        font-semibold
                        tracking-tight
                      "
                    >
                      {item.lapangan_nama || "Lapangan"}
                    </h2>

                    <span
                      className="
                        rounded-full

                        bg-cyan-100
                        px-3
                        py-1

                        text-xs
                        font-semibold

                        text-cyan-600

                        dark:bg-cyan-500/10
                        dark:text-cyan-400
                      "
                    >
                      {item.lapangan_jenis || "-"}
                    </span>
                  </div>

                  <p className="mt-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {item.kode_booking}
                  </p>

                  {/* INFO */}
                  <div
                    className="
                      mt-6
                      grid
                      gap-4

                      sm:grid-cols-2
                      lg:grid-cols-3
                    "
                  >
                    {/* TANGGAL */}
                    <div
                      className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div
                        className="
                          rounded-xl

                          bg-cyan-500/10

                          p-2
                        "
                      >
                        <Calendar
                          size={20}
                          className="
                            text-cyan-500
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Tanggal
                        </p>

                        <h4 className="mt-1 font-medium">
                          {formatDate(item.tanggal_booking)}
                        </h4>
                      </div>
                    </div>

                    {/* JAM */}
                    <div
                      className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div
                        className="
                          rounded-xl

                          bg-blue-500/10

                          p-2
                        "
                      >
                        <Clock3
                          size={20}
                          className="
                            text-blue-500
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Jam Booking
                        </p>

                        <h4 className="mt-1 font-medium">
                          {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)}
                        </h4>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div
                      className="
                        flex
                        items-start
                        gap-3

                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div
                        className="
                          rounded-xl

                          bg-green-500/10

                          p-2
                        "
                      >
                        <Wallet
                          size={20}
                          className="
                            text-green-500
                          "
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Total Pembayaran
                        </p>

                        <h4
                          className="
                            mt-1
                            font-semibold

                            text-green-600
                            dark:text-green-400
                          "
                        >
                          {formatRupiah(item.total_harga)}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <PaymentDeadlineBanner pesanan={item} now={now} />
                </div>

                {/* STATUS & AKSI */}
                <div className="flex flex-col items-end gap-3">
                  {needsPayment(item) ? (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-yellow-100
                        dark:bg-yellow-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-yellow-700
                        dark:text-yellow-400
                      "
                    >
                      <AlertCircle size={18} />
                      Belum Dibayar
                    </div>
                  ) : isPaymentSuccess(item) || item.status === "dibayar" ? (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-cyan-100
                        dark:bg-cyan-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-cyan-700
                        dark:text-cyan-400
                      "
                    >
                      <CheckCircle2 size={18} />
                      Dibayar
                    </div>
                  ) : isAwaitingPaymentConfirmation(item) ? (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-cyan-100
                        dark:bg-cyan-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-cyan-700
                        dark:text-cyan-400
                      "
                    >
                      <Clock3 size={18} />
                      Menunggu Konfirmasi
                    </div>
                  ) : null}

                  {item.status === "pending" && needsPayment(item) && (
                    <Link
                      href={getPaymentPageHref(item.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-500"
                    >
                      <CreditCard size={16} />
                      Bayar Sekarang
                    </Link>
                  )}

                  {item.status === "selesai" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-green-100
                        dark:bg-green-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-green-700
                        dark:text-green-400
                      "
                    >
                      <BadgeCheck size={18} />
                      Selesai
                    </div>
                  )}

                  {item.status === "dibatalkan" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-red-100
                        dark:bg-red-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-red-700
                        dark:text-red-400
                      "
                    >
                      <XCircle size={18} />
                      Dibatalkan
                    </div>
                  )}

                  {item.status === "expired" && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-2xl

                        bg-gray-100
                        dark:bg-gray-500/10

                        px-5
                        py-3

                        text-sm
                        font-semibold

                        text-gray-700
                        dark:text-gray-400
                      "
                    >
                      <XCircle size={18} />
                      Expired (belum bayar)
                    </div>
                  )}

                  {item.status === "dibatalkan" &&
                    item.pembayaran?.status === "refund" &&
                    (item.pembayaran.jumlah_refund ?? 0) > 0 && (
                      <p className="max-w-[220px] text-right text-xs text-gray-500">
                        Refund:{" "}
                        <strong className="text-emerald-600">
                          {formatRupiah(item.pembayaran.jumlah_refund ?? 0)}
                        </strong>
                        {item.pembayaran.jumlah_potongan ? (
                          <>
                            {" "}
                            · Potongan:{" "}
                            {formatRupiah(item.pembayaran.jumlah_potongan)}
                          </>
                        ) : null}
                      </p>
                    )}

                  {canCancel(item.status) && (
                    <button
                      onClick={() => setCancelTarget(item)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                    >
                      Batalkan Pesanan
                    </button>
                  )}
                </div>
              </div>

              {item.status === "dibatalkan" && hideSecondsLeft !== null && hideSecondsLeft > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100/90 px-4 py-2.5 text-xs text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                  <Clock3 size={14} className="shrink-0 text-gray-400" />
                  Menghilang dari daftar dalam{" "}
                  <strong className="tabular-nums text-gray-800 dark:text-gray-200">
                    {hideSecondsLeft} detik
                  </strong>
                </div>
              )}

              <PesananPaymentAction pesanan={item} />
            </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {!loading && visiblePesanans.length === 0 && (
          <div
            className="
              mt-10
              rounded-3xl
              border
              border-dashed
              border-gray-300
              dark:border-white/10
              bg-white/70
              dark:bg-white/5
              py-20
              text-center
              backdrop-blur-xl
            "
          >
            <h3 className="text-2xl font-semibold">Belum Ada Pesanan</h3>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Anda belum memiliki riwayat booking lapangan.
            </p>
          </div>
        )}
      </section>

      <CancelPesananDialog
        open={cancelTarget !== null}
        totalHarga={Number(cancelTarget?.total_harga || 0)}
        totalBayar={cancelTarget?.pembayaran?.total_bayar}
        pesananStatus={cancelTarget?.status}
        pembayaranStatus={cancelTarget?.pembayaran?.status}
        kodeBooking={cancelTarget?.kode_booking}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </main>
  );
}