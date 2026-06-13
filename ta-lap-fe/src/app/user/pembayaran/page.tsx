"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  CreditCard,
  Wallet,
  QrCode,
  Landmark,
  Banknote,
  CircleDollarSign,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { getMyPesanan } from "@/services/pesanan.service";
import { createPembayaran } from "@/services/pembayaran.service";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";

type PendingPesanan = {
  id: string;
  total_harga: number | string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  lapangan?: { nama: string; jenis?: { nama: string } };
};

export default function PembayaranPage() {
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [pembayaran, setPembayaran] = useState<PendingPesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMyPesanan();
        const pending = (result.data || []).filter(
          (p: PendingPesanan & { status: string }) => p.status === "pending"
        );
        setPembayaran(pending);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePay = async (pesananId: string, total: number | string) => {
    const metodeMap: Record<string, string> = {
      qris: "qris",
      transfer: "transfer",
      tunai: "cash",
    };

    try {
      setPayingId(pesananId);
      await createPembayaran({
        pesanan_id: pesananId,
        metode: metodeMap[selectedMethod] || "qris",
        total_bayar: Number(total),
      });
      setPembayaran((prev) => prev.filter((p) => p.id !== pesananId));
      alert("Pembayaran berhasil dikirim!");
    } catch (error) {
      console.error(error);
      alert("Gagal melakukan pembayaran.");
    } finally {
      setPayingId(null);
    }
  };

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
      <UserNavbar active="pembayaran" />

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
            Pembayaran Booking
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
            Selesaikan pembayaran booking lapangan
            dengan sistem modern, aman, dan realtime.
          </p>
        </div>

        {/* CARD */}
        <div className="mt-10 space-y-7">
          {loading && (
            <p className="text-center text-gray-500">Memuat data pembayaran...</p>
          )}
          {pembayaran.map((item) => (
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
                  gap-8

                  xl:flex-row
                  xl:items-start
                  xl:justify-between
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

                        text-cyan-700

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

                      md:grid-cols-2
                      xl:grid-cols-4
                    "
                  >
                    {/* TANGGAL */}
                    <div
                      className="
                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={18}
                          className="text-cyan-500"
                        />

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
                      </div>

                      <h4 className="mt-3 font-medium">
                        {formatDate(item.tanggal_booking)}
                      </h4>
                    </div>

                    {/* JAM */}
                    <div
                      className="
                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={18}
                          className="text-blue-500"
                        />

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
                      </div>

                      <h4 className="mt-3 font-medium">
                        {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)}
                      </h4>
                    </div>

                    {/* TOTAL */}
                    <div
                      className="
                        rounded-2xl

                        bg-gray-100
                        dark:bg-white/5

                        p-4
                      "
                    >
                      <div className="flex items-center gap-2">
                        <Wallet
                          size={18}
                          className="text-green-500"
                        />

                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-400
                          "
                        >
                          Total Bayar
                        </p>
                      </div>

                      <h4
                        className="
                          mt-3
                          font-semibold

                          text-green-600
                          dark:text-green-400
                        "
                      >
                        {formatRupiah(item.total_harga)}
                      </h4>
                    </div>

                    {/* STATUS */}
                    <div
                      className="
                        rounded-2xl

                        bg-yellow-100
                        dark:bg-yellow-500/10

                        p-4
                      "
                    >
                      <div className="flex items-center gap-2">
                        <CircleDollarSign
                          size={18}
                          className="text-yellow-500"
                        />

                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-wide

                            text-gray-500
                          "
                        >
                          Status
                        </p>
                      </div>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          gap-2

                          font-semibold

                          text-yellow-700
                          dark:text-yellow-400
                        "
                      >
                        <CheckCircle2 size={18} />
                        Belum Dibayar
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT METHOD */}
                  <div className="mt-8">
                    <h3
                      className="
                        text-lg
                        font-semibold
                      "
                    >
                      Metode Pembayaran
                    </h3>

                    <div
                      className="
                        mt-4
                        grid
                        gap-4

                        md:grid-cols-3
                      "
                    >
                      {/* QRIS */}
                      <button
                        onClick={() =>
                          setSelectedMethod(
                            "qris"
                          )
                        }
                        className={`
                          rounded-2xl
                          border

                          p-5
                          text-left

                          transition-all
                          duration-300

                          ${
                            selectedMethod ===
                            "qris"
                              ? `
                                border-cyan-500
                                bg-cyan-500/10
                              `
                              : `
                                border-gray-200
                                dark:border-white/10

                                bg-gray-100
                                dark:bg-white/5
                              `
                          }
                        `}
                      >
                        <QrCode
                          className="
                            mb-4
                            text-cyan-500
                          "
                          size={28}
                        />

                        <h4 className="font-semibold">
                          QRIS
                        </h4>

                        <p
                          className="
                            mt-2
                            text-sm

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Scan QR code untuk
                          pembayaran instan.
                        </p>
                      </button>

                      {/* TRANSFER */}
                      <button
                        onClick={() =>
                          setSelectedMethod(
                            "transfer"
                          )
                        }
                        className={`
                          rounded-2xl
                          border

                          p-5
                          text-left

                          transition-all
                          duration-300

                          ${
                            selectedMethod ===
                            "transfer"
                              ? `
                                border-cyan-500
                                bg-cyan-500/10
                              `
                              : `
                                border-gray-200
                                dark:border-white/10

                                bg-gray-100
                                dark:bg-white/5
                              `
                          }
                        `}
                      >
                        <Landmark
                          className="
                            mb-4
                            text-blue-500
                          "
                          size={28}
                        />

                        <h4 className="font-semibold">
                          Transfer
                        </h4>

                        <p
                          className="
                            mt-2
                            text-sm

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Pembayaran melalui
                          transfer bank.
                        </p>
                      </button>

                      {/* TUNAI */}
                      <button
                        onClick={() =>
                          setSelectedMethod(
                            "tunai"
                          )
                        }
                        className={`
                          rounded-2xl
                          border

                          p-5
                          text-left

                          transition-all
                          duration-300

                          ${
                            selectedMethod ===
                            "tunai"
                              ? `
                                border-cyan-500
                                bg-cyan-500/10
                              `
                              : `
                                border-gray-200
                                dark:border-white/10

                                bg-gray-100
                                dark:bg-white/5
                              `
                          }
                        `}
                      >
                        <Banknote
                          className="
                            mb-4
                            text-green-500
                          "
                          size={28}
                        />

                        <h4 className="font-semibold">
                          Tunai
                        </h4>

                        <p
                          className="
                            mt-2
                            text-sm

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Bayar langsung di lokasi
                          lapangan.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* PAYMENT INFO */}
                  <div
                    className="
                      mt-6
                      rounded-3xl

                      border

                      border-gray-200
                      dark:border-white/10

                      bg-gray-100
                      dark:bg-black/20

                      p-6
                    "
                  >
                    {selectedMethod === "qris" && (
                      <div className="text-center">
                        <QrCode
                          size={60}
                          className="
                            mx-auto
                            text-cyan-500
                          "
                        />

                        <h4
                          className="
                            mt-4
                            text-lg
                            font-semibold
                          "
                        >
                          Pembayaran QRIS
                        </h4>

                        <p
                          className="
                            mt-2
                            text-sm

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Scan QR code untuk
                          menyelesaikan pembayaran.
                        </p>
                      </div>
                    )}

                    {selectedMethod ===
                      "transfer" && (
                      <div>
                        <h4
                          className="
                            text-lg
                            font-semibold
                          "
                        >
                          Transfer Bank
                        </h4>

                        <div className="mt-4 space-y-2">
                          <p>
                            Bank:{" "}
                            <span className="font-semibold">
                              BNI
                            </span>
                          </p>

                          <p>
                            No Rekening:{" "}
                            <span className="font-semibold">
                              1234567890
                            </span>
                          </p>

                          <p>
                            Atas Nama:{" "}
                            <span className="font-semibold">
                              TA-LAP SPORT
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedMethod ===
                      "tunai" && (
                      <div>
                        <h4
                          className="
                            text-lg
                            font-semibold
                          "
                        >
                          Pembayaran Tunai
                        </h4>

                        <p
                          className="
                            mt-3
                            text-sm
                            leading-7

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Pembayaran dilakukan
                          langsung saat datang ke
                          lokasi lapangan.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION */}
                <div className="xl:w-[220px]">
                  <button
                    onClick={() => handlePay(item.id, item.total_harga)}
                    disabled={payingId === item.id}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-3

                      rounded-2xl

                      bg-cyan-500

                      px-6
                      py-4

                      text-sm
                      font-semibold
                      text-white

                      shadow-lg
                      shadow-cyan-500/20

                      transition-all
                      duration-300

                      hover:bg-cyan-400
                      hover:shadow-cyan-500/40
                    "
                  >
                    <CreditCard size={20} />
                    {payingId === item.id ? "Memproses..." : "Bayar Sekarang"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {!loading && pembayaran.length === 0 && (
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
              Tidak Ada Pembayaran
            </h3>

            <p
              className="
                mt-3

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Semua pembayaran Anda sudah selesai.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}