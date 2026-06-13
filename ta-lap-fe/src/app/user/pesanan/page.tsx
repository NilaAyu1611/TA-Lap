"use client";

import { useEffect, useState } from "react";

import {
  Clock3,
  Calendar,
  Wallet,
  CheckCircle2,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { getMyPesanan } from "@/services/pesanan.service";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";

type PesananItem = {
  id: string;
  kode_booking?: string;
  status: string;
  total_harga: number | string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  lapangan?: { nama: string; jenis?: { nama: string } };
};

export default function PesananPage() {
  const [pesanans, setPesanans] = useState<PesananItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMyPesanan();
        setPesanans(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

        {/* CARD LIST */}
        <div className="mt-10 space-y-6">
          {loading && (
            <p className="text-center text-gray-500">Memuat pesanan...</p>
          )}
          {!loading && pesanans.length === 0 && (
            <p className="text-center text-gray-500">Belum ada pesanan.</p>
          )}
          {pesanans.map((item) => (
            <div
              key={item.id}
              className="
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
                duration-300

                hover:-translate-y-1
                hover:border-cyan-500/30
              "
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
                      {item.lapangan?.nama || "Lapangan"}
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
                      {item.lapangan?.jenis?.nama || "-"}
                    </span>
                  </div>

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
                </div>

                {/* STATUS */}
                <div>
                  {item.status === "pending" && (
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
                  )}

                  {item.status === "dibayar" && (
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {pesanans.length === 0 && (
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
            <h3
              className="
                text-2xl
                font-semibold
              "
            >
              Belum Ada Pesanan
            </h3>

            <p
              className="
                mt-3

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Anda belum memiliki riwayat booking
              lapangan.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}