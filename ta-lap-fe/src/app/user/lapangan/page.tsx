"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Search, Filter, Star } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { getLapangan } from "@/services/lapangan.service";
import { createPesanan } from "@/services/pesanan.service";
import { formatRupiah } from "@/lib/auth";

type LapanganItem = {
  id: string;
  nama: string;
  harga: number | string;
  status: boolean;
  gambar?: string;
  jenis?: { nama: string };
};

export default function LapanganPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [lapangans, setLapangans] = useState<LapanganItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLapangan();
        setLapangans(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBooking = async (lapanganId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tanggal = tomorrow.toISOString().split("T")[0];
    const jamMulai = new Date(`${tanggal}T16:00:00`);
    const jamSelesai = new Date(`${tanggal}T18:00:00`);

    try {
      setBookingId(lapanganId);
      await createPesanan({
        lapangan_id: lapanganId,
        tanggal_booking: tanggal,
        jam_mulai: jamMulai.toISOString(),
        jam_selesai: jamSelesai.toISOString(),
      });
      router.push("/user/pesanan");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan. Pastikan sudah login.");
    } finally {
      setBookingId(null);
    }
  };

  const filtered = lapangans.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
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
      <UserNavbar active="lapangan" />

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* TOP */}
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
          <div>
            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
              "
            >
              Daftar Lapangan
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
              Pilih lapangan favorit Anda untuk booking
              realtime dengan sistem modern dan cepat.
            </p>
          </div>

          {/* SEARCH */}
          <div
            className="
              flex
              w-full
              flex-col
              gap-3

              sm:flex-row
              lg:w-auto
            "
          >
            <div className="relative">
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Cari lapangan..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border

                  border-gray-300
                  dark:border-white/10

                  bg-white
                  dark:bg-white/5

                  py-3
                  pl-11
                  pr-4

                  text-sm

                  outline-none

                  transition-all
                  duration-300

                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                "
              />
            </div>

            <button
              className="
                flex
                items-center
                justify-center
                gap-2

                rounded-2xl
                border

                border-gray-300
                dark:border-white/10

                bg-white
                dark:bg-white/5

                px-5
                py-3

                text-sm
                font-medium

                transition-all
                duration-300

                hover:border-cyan-500
                hover:text-cyan-500
              "
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* GRID */}
        <div
          className="
            mt-10
            grid
            gap-7

            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {loading && (
            <p className="col-span-full text-center text-gray-500">Memuat lapangan...</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Belum ada lapangan tersedia.</p>
          )}
          {filtered.map((item) => (
            <div
              key={item.id}
              className="
                overflow-hidden
                rounded-3xl
                border

                border-gray-200
                dark:border-white/10

                bg-white/80
                dark:bg-white/5

                shadow-lg
                backdrop-blur-xl

                transition-all
                duration-300

                hover:-translate-y-2
                hover:border-cyan-500/40
                hover:shadow-cyan-500/10
              "
            >
              {/* IMAGE */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.gambar || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"}
                  alt={item.nama}
                  className="
                    h-full
                    w-full
                    object-cover

                    transition-transform
                    duration-500

                    hover:scale-110
                  "
                />

                <div
                  className="
                    absolute
                    left-4
                    top-4

                    flex
                    items-center
                    gap-1

                    rounded-full

                    bg-white/90
                    dark:bg-black/60

                    px-3
                    py-1

                    text-xs
                    font-semibold
                  "
                >
                  <Star
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  Premium
                </div>
              </div>

              {/* BODY */}
              <div className="p-6">
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <h3
                      className="
                        text-xl
                        font-semibold
                        tracking-tight
                      "
                    >
                      {item.nama}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm

                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {item.jenis?.nama || "Olahraga"}
                    </p>
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold

                      ${
                        item.status
                          ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }
                    `}
                  >
                    {item.status ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </div>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide

                        text-gray-400
                      "
                    >
                      Harga
                    </p>

                    <h4
                      className="
                        mt-1
                        text-lg
                        font-bold

                        text-cyan-600
                        dark:text-cyan-400
                      "
                    >
                      {formatRupiah(item.harga)} / jam
                    </h4>
                  </div>

                  <button
                    onClick={() => handleBooking(item.id)}
                    disabled={!item.status || bookingId === item.id}
                    className={`
                      rounded-2xl
                      px-5
                      py-3

                      text-sm
                      font-semibold

                      transition-all
                      duration-300

                      ${
                        item.status
                          ? `
                            bg-cyan-500
                            text-white

                            hover:bg-cyan-400
                            hover:shadow-lg
                            hover:shadow-cyan-500/20
                          `
                          : `
                            cursor-not-allowed
                            bg-gray-300
                            text-gray-500

                            dark:bg-white/10
                            dark:text-gray-500
                          `
                      }
                    `}
                  >
                    {bookingId === item.id ? "Memproses..." : "Booking"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}