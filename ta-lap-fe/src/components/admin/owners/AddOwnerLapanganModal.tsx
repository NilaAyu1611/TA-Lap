"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createLapangan } from "@/services/lapangan.service";
import { LapanganFormData } from "@/types/lapangan";
import { Owner } from "@/types/owner";
import JenisOlahragaField from "@/components/admin/lapangan/JenisOlahragaField";
import LapanganPhotosField from "@/components/admin/lapangan/LapanganPhotosField";
import LocationPicker, { LocationValue } from "@/components/admin/lapangan/LocationPicker";
import {
  FacilityFormSection,
  defaultFacilityForm,
  facilityToPayload,
} from "@/components/admin/lapangan/LapanganFacilityFields";
import {
  formInputClass,
  formLabelClass,
  formTextareaClass,
} from "@/components/admin/lapangan/formStyles";

type Props = {
  open: boolean;
  owner: Owner | null;
  onClose: () => void;
  onSuccess: () => void;
};

const defaultForm = {
  nama: "",
  harga: "",
  deskripsi: "",
  jam_buka: "08:00",
  jam_tutup: "22:00",
};

const defaultLocation: LocationValue = {
  alamat: "",
  kota: "",
  latitude: null,
  longitude: null,
  google_maps_url: "",
};

export default function AddOwnerLapanganModal({
  open,
  owner,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState(defaultForm);
  const [location, setLocation] = useState<LocationValue>(defaultLocation);
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
    setForm(defaultForm);
    setJenisValue({});
    setLocation({
      ...defaultLocation,
      kota: owner?.city || "",
    });
    setCover("");
    setGallery([]);
    setFacility(defaultFacilityForm);
    setError("");
  }, [open, owner]);

  if (!open || !owner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nama.trim() || !form.harga) {
      setError("Nama dan harga lapangan wajib diisi");
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
      owner_id: owner.id,
      status: true,
      jam_buka: form.jam_buka,
      jam_tutup: form.jam_tutup,
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

    setLoading(true);
    try {
      await createLapangan(payload);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menambah lapangan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-4 dark:border-white/10 dark:from-cyan-950/40 dark:to-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Tambah Lapangan
              </p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                untuk {owner.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-white/15 dark:hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className={formLabelClass}>Nama Lapangan</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Futsal Arena Medan"
              className={formInputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <JenisOlahragaField
                valueId={jenisValue.jenis_id}
                valueNama={jenisValue.jenis}
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
            <label className={formLabelClass}>Deskripsi (opsional)</label>
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
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:border-white/15 dark:text-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Simpan Lapangan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
