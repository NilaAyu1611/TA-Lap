"use client";

import {
  AlertCircle,
  Building2,
  Layers,
  MapPin,
  Store,
  Sun,
  User2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Lapangan } from "@/types/lapangan";
import LapanganMapEmbed from "@/components/lapangan/LapanganMapEmbed";
import LapanganPhotoGallery from "@/components/lapangan/LapanganPhotoGallery";
import LapanganFacilityFields from "@/components/admin/lapangan/LapanganFacilityFields";

type Props = {
  open: boolean;
  lapangan: Lapangan | null;
  showOwner?: boolean;
  variant?: "admin" | "owner";
  onClose: () => void;
  onEdit: (lapangan: Lapangan) => void;
};

export default function LapanganDetailModal({
  open,
  lapangan,
  showOwner = true,
  variant = "admin",
  onClose,
  onEdit,
}: Props) {
  if (!open || !lapangan) return null;

  const missingKapasitas = !lapangan.kapasitas;
  const missingCourt = !lapangan.jumlah_court;
  const isOwnerView = variant === "owner";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-5 dark:border-white/10 dark:from-cyan-950/30 dark:to-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Detail Lapangan
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                {lapangan.nama}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <LapanganPhotoGallery
            gambar={lapangan.gambar}
            images={lapangan.images}
            alt={lapangan.nama}
          />

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 ${
                lapangan.status
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 ring-gray-200 dark:bg-white/10"
              }`}
            >
              {lapangan.status ? "Aktif" : "Nonaktif"}
            </span>
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-white/10 dark:text-gray-300">
              {lapangan.jenis || "—"}
            </span>
            {lapangan.kapasitas ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:ring-cyan-500/20">
                <Users size={12} />
                ±{lapangan.kapasitas} orang
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400">
                <AlertCircle size={12} />
                Kapasitas belum diisi
              </span>
            )}
          </div>

          {(missingKapasitas || missingCourt) && isOwnerView && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Info venue belum lengkap</p>
                <p className="mt-1 text-xs leading-relaxed opacity-90">
                  {missingKapasitas && "Kapasitas maksimal "}
                  {missingKapasitas && missingCourt && "dan "}
                  {missingCourt && "jumlah court "}
                  belum diisi. User melihat tanda &quot;—&quot; di halaman booking.
                  Lengkapi lewat Edit agar lebih transparan.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <VenueHighlight
              icon={Users}
              label="Kapasitas Maksimal"
              value={
                lapangan.kapasitas
                  ? `${lapangan.kapasitas} orang`
                  : "Belum diisi"
              }
              warn={!lapangan.kapasitas}
            />
            <VenueHighlight
              icon={Layers}
              label="Jumlah Court"
              value={
                lapangan.jumlah_court
                  ? `${lapangan.jumlah_court} court`
                  : "Belum diisi"
              }
              warn={!lapangan.jumlah_court}
            />
            <VenueHighlight
              icon={lapangan.indoor ? Building2 : Sun}
              label="Tipe Venue"
              value={lapangan.indoor ? "Indoor" : "Outdoor"}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {showOwner && (
              <InfoItem
                icon={User2}
                label="Owner"
                value={lapangan.owner_name || "Belum ada owner"}
              />
            )}
            <InfoItem
              icon={Wallet}
              label="Harga / Sesi"
              value={`Rp ${lapangan.harga.toLocaleString("id-ID")}`}
            />
            <InfoItem
              icon={MapPin}
              label="Kota"
              value={lapangan.kota || "—"}
            />
            <InfoItem
              icon={Store}
              label="Total Booking"
              value={String(lapangan.totalBooking)}
            />
          </div>

          {lapangan.deskripsi && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs text-gray-500">Deskripsi</p>
              <p className="mt-1 text-sm">{lapangan.deskripsi}</p>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Detail Venue & Kapasitas
            </p>
            <p className="mb-3 text-xs text-gray-500">
              Informasi ini ditampilkan persis ke user/pemain di halaman detail
              lapangan saat mereka booking.
            </p>
            <LapanganFacilityFields
              values={lapangan}
              columns={3}
              highlightEmpty={isOwnerView}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Lokasi & Peta
            </p>
            <LapanganMapEmbed
              latitude={lapangan.latitude}
              longitude={lapangan.longitude}
              google_maps_url={lapangan.google_maps_url}
              alamat={lapangan.alamat}
              nama={lapangan.nama}
              compact
            />
          </div>

          <div className="flex gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(lapangan);
              }}
              className="flex-1 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500"
            >
              Edit Lapangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Icon size={13} />
        {label}
      </div>
      <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function VenueHighlight({
  icon: Icon,
  label,
  value,
  warn,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        warn
          ? "border-amber-200 bg-amber-50/80 dark:border-amber-500/25 dark:bg-amber-500/5"
          : "border-cyan-100 bg-cyan-50/50 dark:border-cyan-500/20 dark:bg-cyan-500/5"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <Icon size={14} className={warn ? "text-amber-600" : "text-cyan-600"} />
        {label}
      </div>
      <p
        className={`mt-1 text-lg font-semibold ${
          warn
            ? "text-amber-700 dark:text-amber-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
