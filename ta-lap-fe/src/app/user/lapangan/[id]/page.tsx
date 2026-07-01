"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

import UserNavbar from "@/components/UserNavbar";
import LapanganMapEmbed from "@/components/lapangan/LapanganMapEmbed";
import LapanganPhotoGalleryHero from "@/components/user/lapangan/LapanganPhotoGalleryHero";
import UserLapanganBookingPanel, {
  BookingFormData,
} from "@/components/user/lapangan/UserLapanganBookingPanel";
import UserLapanganFacilities from "@/components/user/lapangan/UserLapanganFacilities";
import VenueOperatorLine from "@/components/shared/VenueOperatorLine";
import { formatRupiah } from "@/lib/auth";
import { getLapanganById } from "@/services/lapangan.service";
import { createPesanan } from "@/services/pesanan.service";
import { Lapangan } from "@/types/lapangan";

export default function UserLapanganDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lapangan, setLapangan] = useState<Lapangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getLapanganById(id);
        setLapangan(result.data);
      } catch {
        setError("Lapangan tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleBooking = async (form: BookingFormData) => {
    if (!lapangan) return;

    setBookingLoading(true);
    try {
      await createPesanan({
        lapangan_id: lapangan.id,
        tanggal_booking: form.tanggal,
        jam_mulai: `${form.tanggal}T${form.jam_mulai}:00`,
        jam_selesai: `${form.tanggal}T${form.jam_selesai}:00`,
        catatan: form.catatan || undefined,
      });
      router.push("/user/pesanan");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b1120] dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <UserNavbar active="lapangan" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/user/lapangan"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar lapangan
        </Link>

        {loading && (
          <p className="py-20 text-center text-gray-500">Memuat detail lapangan...</p>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/20 dark:bg-red-500/10">
            <p className="text-red-600">{error}</p>
            <Link
              href="/user/lapangan"
              className="mt-4 inline-block text-sm font-medium text-cyan-600 hover:underline"
            >
              Lihat lapangan lain
            </Link>
          </div>
        )}

        {!loading && lapangan && (
          <div className="space-y-8">
            <LapanganPhotoGalleryHero
              gambar={lapangan.gambar}
              images={lapangan.images}
              alt={lapangan.nama}
            />

            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
              <div className="space-y-8">
                <header>
                  <div className="flex flex-wrap items-center gap-2">
                    {lapangan.jenis && (
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold capitalize text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400">
                        {lapangan.jenis}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        lapangan.status
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {lapangan.status ? "Tersedia untuk booking" : "Sedang penuh"}
                    </span>
                    {lapangan.totalBooking > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
                        <CalendarCheck size={12} />
                        {lapangan.totalBooking}+ booking
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    {lapangan.nama}
                  </h1>

                  {(lapangan.alamat || lapangan.kota) && (
                    <p className="mt-3 inline-flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-cyan-600" />
                      <span>
                        {lapangan.alamat}
                        {lapangan.alamat && lapangan.kota && " · "}
                        {lapangan.kota}
                      </span>
                    </p>
                  )}

                  {lapangan.owner_name && (
                    <div className="mt-3">
                      <VenueOperatorLine
                        businessName={lapangan.owner_business_name}
                        ownerName={lapangan.owner_name}
                      />
                    </div>
                  )}
                </header>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Sparkles size={18} className="text-cyan-600" />
                    Tentang Venue
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {lapangan.deskripsi ||
                      "Venue olahraga dengan fasilitas lengkap. Lihat foto di atas dan peta lokasi di bawah untuk memastikan lapangan sesuai kebutuhan Anda sebelum booking."}
                  </p>
                </div>

                <div>
                  <h2 className="mb-4 text-lg font-semibold">Fasilitas & Info</h2>
                  <UserLapanganFacilities lapangan={lapangan} />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
                  <h2 className="mb-4 text-lg font-semibold">Lokasi & Peta</h2>
                  <p className="mb-4 text-sm text-gray-500">
                    Pastikan lokasi venue mudah dijangkau sebelum melakukan booking.
                    Anda bisa buka Google Maps untuk navigasi langsung.
                  </p>
                  <LapanganMapEmbed
                    latitude={lapangan.latitude}
                    longitude={lapangan.longitude}
                    google_maps_url={lapangan.google_maps_url}
                    alamat={lapangan.alamat}
                    nama={lapangan.nama}
                  />
                </div>

                <div className="rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 dark:border-cyan-500/20 dark:from-cyan-500/10 dark:to-blue-500/5">
                  <div className="flex items-start gap-3">
                    <Star className="mt-0.5 shrink-0 text-amber-500" size={20} />
                    <div>
                      <h3 className="font-semibold">Tips sebelum booking</h3>
                      <ul className="mt-2 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Periksa jam operasional venue di atas</li>
                        <li>• Pilih tanggal & durasi main sesuai kebutuhan tim</li>
                        <li>• Setelah booking, selesaikan pembayaran di menu Pesanan</li>
                        <li>• Total estimasi = durasi slot × {formatRupiah(lapangan.harga)}/sesi</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <UserLapanganBookingPanel
                  lapangan={lapangan}
                  loading={bookingLoading}
                  onSubmit={handleBooking}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
