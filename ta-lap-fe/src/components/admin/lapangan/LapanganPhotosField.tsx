"use client";

import { ImagePlus, Link2, Trash2 } from "lucide-react";
import { formInputClass, formLabelClass } from "@/components/admin/lapangan/formStyles";

type Props = {
  cover: string;
  gallery: string[];
  onCoverChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
};

export default function LapanganPhotosField({
  cover,
  gallery,
  onCoverChange,
  onGalleryChange,
}: Props) {
  const addGallerySlot = () => onGalleryChange([...gallery, ""]);

  const updateGallery = (index: number, value: string) => {
    const next = [...gallery];
    next[index] = value;
    onGalleryChange(next);
  };

  const removeGallery = (index: number) => {
    onGalleryChange(gallery.filter((_, i) => i !== index));
  };

  const preview = cover.trim() || gallery.find((u) => u.trim()) || "";

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Foto Lapangan
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Tempel URL gambar (Unsplash, Google Drive publik, dll). User akan
          melihat foto & peta lokasi sebelum booking.
        </p>
      </div>

      {preview && (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
          <img
            src={preview}
            alt="Preview cover"
            className="h-40 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div>
        <label className={formLabelClass}>
          <span className="inline-flex items-center gap-1.5">
            <Link2 size={14} />
            Foto Cover (utama)
          </span>
        </label>
        <input
          type="url"
          value={cover}
          onChange={(e) => onCoverChange(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className={formInputClass}
        />
      </div>

      <div className="space-y-2">
        <label className={formLabelClass}>Galeri Tambahan</label>
        {gallery.map((url, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => updateGallery(index, e.target.value)}
              placeholder={`URL foto ${index + 1}`}
              className={formInputClass}
            />
            <button
              type="button"
              onClick={() => removeGallery(index)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-500/30"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addGallerySlot}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          <ImagePlus size={16} />
          Tambah foto galeri
        </button>
      </div>
    </div>
  );
}
