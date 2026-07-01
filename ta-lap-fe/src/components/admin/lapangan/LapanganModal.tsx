"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getOwners } from "@/services/owner.service";
import { Lapangan, LapanganFormData } from "@/types/lapangan";
import { Owner } from "@/types/owner";
import JenisOlahragaField from "./JenisOlahragaField";
import LapanganPhotosField from "./LapanganPhotosField";
import LocationPicker, { LocationValue } from "./LocationPicker";
import {
  FacilityFormSection,
  defaultFacilityForm,
  facilityFromLapangan,
  facilityToPayload,
} from "./LapanganFacilityFields";
import VenueHierarchyGuide, {
  FieldHint,
} from "@/components/shared/VenueHierarchyGuide";
import {
  formInputClass,
  formLabelClass,
  formSelectClass,
  formTextareaClass,
  toTimeInputValue,
} from "./formStyles";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  variant?: "admin" | "owner";
  onClose: () => void;
  onSubmit: (data: LapanganFormData) => Promise<void>;
  initialData?: Lapangan | null;
};

const defaultLocation: LocationValue = {
  alamat: "",
  kota: "",
  latitude: null,
  longitude: null,
  google_maps_url: "",
};

const defaultForm = {
  nama: "",
  harga: "",
  deskripsi: "",
  owner_id: "",
  status: true,
  jam_buka: "08:00",
  jam_tutup: "22:00",
};

export default function LapanganModal({
  open,
  mode,
  variant = "admin",
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const isOwner = variant === "owner";
  const [form, setForm] = useState(defaultForm);
  const [location, setLocation] = useState<LocationValue>(defaultLocation);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [jenisValue, setJenisValue] = useState<{
    jenis_id?: number;
    jenis?: string;
  }>({});
  const [cover, setCover] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [facility, setFacility] = useState(defaultFacilityForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (!isOwner) {
      getOwners()
        .then((res) => setOwners(res.data))
        .catch(() => setOwners([]));
    }

    if (mode === "edit" && initialData) {
      setForm({
        nama: initialData.nama,
        harga: String(initialData.harga),
        deskripsi: initialData.deskripsi || "",
        owner_id: initialData.owner_id || "",
        status: initialData.status,
        jam_buka: toTimeInputValue(initialData.jam_buka) || "08:00",
        jam_tutup: toTimeInputValue(initialData.jam_tutup) || "22:00",
      });
      setJenisValue({
        jenis_id: initialData.jenis_id,
        jenis: initialData.jenis || undefined,
      });
      setLocation({
        alamat: initialData.alamat || "",
        kota: initialData.kota || "",
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        google_maps_url: initialData.google_maps_url || "",
      });
      setCover(initialData.gambar || "");
      setGallery(
        (initialData.images || [])
          .map((img) => img.image_url)
          .filter((url) => url !== initialData.gambar)
      );
      setFacility(facilityFromLapangan(initialData));
    } else {
      setForm(defaultForm);
      setJenisValue({});
      setLocation(defaultLocation);
      setCover("");
      setGallery([]);
      setFacility(defaultFacilityForm);
    }
    setError("");
  }, [open, mode, initialData, isOwner]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nama.trim() || !form.harga) {
      setError("Nama dan harga wajib diisi");
      return;
    }

    if (!isOwner && !form.owner_id) {
      setError("Owner wajib dipilih");
      return;
    }

    if (!jenisValue.jenis_id && !jenisValue.jenis?.trim()) {
      setError("Jenis olahraga wajib dipilih atau ditambahkan");
      return;
    }

    const payload: LapanganFormData = {
      nama: form.nama.trim(),
      harga: Number(form.harga),
      kota: location.kota.trim(),
      alamat: location.alamat.trim(),
      deskripsi: form.deskripsi.trim(),
      status: form.status,
      jam_buka: form.jam_buka || undefined,
      jam_tutup: form.jam_tutup || undefined,
      google_maps_url: location.google_maps_url || undefined,
      latitude: location.latitude,
      longitude: location.longitude,
      ...facilityToPayload(facility),
    };

    if (cover.trim() || gallery.some((u) => u.trim())) {
      payload.gambar = cover.trim() || undefined;
      payload.images = gallery.map((u) => u.trim()).filter(Boolean);
    }

    if (jenisValue.jenis_id) {
      payload.jenis_id = jenisValue.jenis_id;
    } else if (jenisValue.jenis?.trim()) {
      payload.jenis = jenisValue.jenis.trim();
    }

    if (!isOwner && form.owner_id) {
      payload.owner_id = form.owner_id;
    }

    setLoading(true);
    try {
      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan lapangan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-4 dark:border-white/10 dark:from-cyan-950/40 dark:to-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                {mode === "create" ? "Tambah Lapangan" : "Edit Lapangan"}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {mode === "create"
                  ? "Venue Baru"
                  : initialData?.nama || "Perbarui Data"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-white/15 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {!isOwner && (
            <div>
              <label className={formLabelClass}>Owner</label>
              <select
                value={form.owner_id}
                onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                className={formSelectClass}
              >
                <option value="">Pilih owner...</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={formLabelClass}>
              Nama Lapangan (tampil ke pemain)
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Futsal Court A — Bandung Utara"
              className={formInputClass}
            />
            <FieldHint>
              Judul listing di pencarian & halaman booking user. Beda dengan brand
              usaha di Profil & Bisnis.
            </FieldHint>
          </div>

          {isOwner && (
            <VenueHierarchyGuide
              variant="owner-form"
              venuePreview={form.nama}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <JenisOlahragaField
                valueId={jenisValue.jenis_id}
                valueNama={jenisValue.jenis || initialData?.jenis}
                onChange={setJenisValue}
              />
            </div>

            <div>
              <label className={formLabelClass}>Harga / Sesi (Rp)</label>
              <input
                type="number"
                min={0}
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                placeholder="150000"
                className={formInputClass}
              />
            </div>
          </div>

          <div>
            <label className={formLabelClass}>Status</label>
            <select
              value={form.status ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value === "true" })
              }
              className={formSelectClass}
            >
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </div>

          <LocationPicker value={location} onChange={setLocation} />

          <FacilityFormSection value={facility} onChange={setFacility} />

          <LapanganPhotosField
            cover={cover}
            gallery={gallery}
            onCoverChange={setCover}
            onGalleryChange={setGallery}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={formLabelClass}>Jam Buka</label>
              <input
                type="time"
                value={form.jam_buka}
                onChange={(e) =>
                  setForm({ ...form, jam_buka: e.target.value })
                }
                className={formInputClass}
              />
            </div>
            <div>
              <label className={formLabelClass}>Jam Tutup</label>
              <input
                type="time"
                value={form.jam_tutup}
                onChange={(e) =>
                  setForm({ ...form, jam_tutup: e.target.value })
                }
                className={formInputClass}
              />
            </div>
          </div>

          <div>
            <label className={formLabelClass}>Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              rows={2}
              className={formTextareaClass}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "create" ? "Tambah Lapangan" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
