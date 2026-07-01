"use client";

import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_LAPANGAN_IMAGE,
  getLapanganGallery,
} from "@/lib/lapanganMedia";

type Props = {
  gambar?: string | null;
  images?: { image_url: string }[];
  alt: string;
};

export default function LapanganPhotoGalleryHero({
  gambar,
  images,
  alt,
}: Props) {
  const photos = getLapanganGallery({ gambar, images });
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + photos.length) % photos.length);
    },
    [photos.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  const current = photos[active] ?? DEFAULT_LAPANGAN_IMAGE;

  return (
    <>
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block w-full"
          >
            <img
              src={current}
              alt={`${alt} — foto ${active + 1}`}
              className="aspect-[16/10] w-full object-cover sm:aspect-[16/9] md:max-h-[480px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_LAPANGAN_IMAGE;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
              <span className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                <ZoomIn size={16} />
                Perbesar
              </span>
            </div>
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/90 dark:text-white"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/90 dark:text-white"
                aria-label="Foto berikutnya"
              >
                <ChevronRight size={20} />
              </button>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <Images size={14} />
                {active + 1} / {photos.length}
              </span>
            </>
          )}
        </div>

        {photos.length > 1 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {photos.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${
                  active === index
                    ? "border-cyan-500 ring-2 ring-cyan-500/25"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_LAPANGAN_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Tutup"
          >
            <X size={22} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <img
            src={current}
            alt={alt}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-sm text-white/80">
            {active + 1} dari {photos.length} foto — {alt}
          </p>
        </div>
      )}
    </>
  );
}
