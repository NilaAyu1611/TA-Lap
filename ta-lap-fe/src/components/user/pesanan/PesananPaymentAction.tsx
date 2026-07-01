"use client";



import Link from "next/link";

import { CreditCard, FileText, Hourglass } from "lucide-react";

import {

  getPaymentPageHref,

  getTransaksiReceiptHref,

  isAwaitingPaymentConfirmation,

  isPaymentSuccess,

  needsPayment,

} from "@/lib/pesananPayment";

import { formatRupiah } from "@/lib/auth";

import { formatMetodePembayaran } from "@/lib/pembayaran";

import { Pesanan } from "@/types/pesanan";



type Props = {

  pesanan: Pesanan;

};



export default function PesananPaymentAction({ pesanan }: Props) {

  if (needsPayment(pesanan)) {

    return (

      <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="rounded-xl bg-amber-500/15 p-2.5">

              <CreditCard className="h-5 w-5 text-amber-700 dark:text-amber-400" />

            </div>

            <div>

              <p className="font-semibold text-amber-900 dark:text-amber-100">

                Booking belum dibayar

              </p>

              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/90">

                Segera bayar{" "}

                <strong>{formatRupiah(pesanan.total_harga)}</strong> agar jadwal

                Anda terkonfirmasi.

              </p>

              {pesanan.kode_booking && (

                <p className="mt-1 font-mono text-xs text-amber-700/70 dark:text-amber-400/80">

                  Kode: {pesanan.kode_booking}

                </p>

              )}

            </div>

          </div>



          <Link

            href={getPaymentPageHref(pesanan.id)}

            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/25 transition hover:bg-amber-500"

          >

            <CreditCard size={18} />

            Bayar Sekarang

          </Link>

        </div>

      </div>

    );

  }



  if (isPaymentSuccess(pesanan) && pesanan.pembayaran?.id) {

    return (

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

            <div>

              <p className="font-semibold text-emerald-900 dark:text-emerald-100">

                Pembayaran berhasil

              </p>

              <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-300/90">

                {formatMetodePembayaran(pesanan.pembayaran.metode)} ·{" "}

                {formatRupiah(pesanan.pembayaran.total_bayar)}

                {pesanan.pembayaran.kode_transaksi && (

                  <>

                    {" "}

                    ·{" "}

                    <span className="font-mono text-xs">

                      {pesanan.pembayaran.kode_transaksi}

                    </span>

                  </>

                )}

              </p>

            </div>

          </div>

          <Link

            href={getTransaksiReceiptHref(pesanan.pembayaran.id)}

            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"

          >

            <FileText size={16} />

            Lihat Struk

          </Link>

        </div>

      </div>

    );

  }



  if (isAwaitingPaymentConfirmation(pesanan)) {

    return (

      <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-500/30 dark:bg-cyan-500/10">

        <div className="flex items-start gap-3">

          <Hourglass className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />

          <div>

            <p className="font-semibold text-cyan-900 dark:text-cyan-100">

              Menunggu konfirmasi pembayaran

            </p>

            <p className="mt-1 text-sm text-cyan-800/80 dark:text-cyan-300/90">

              {pesanan.pembayaran?.metode === "cash"

                ? "Pembayaran tunai dicatat. Owner akan konfirmasi saat Anda bayar di venue."

                : "Pembayaran sedang diproses Midtrans. Status akan terupdate otomatis — refresh halaman jika belum berubah."}

            </p>

          </div>

        </div>

      </div>

    );

  }



  return null;

}

