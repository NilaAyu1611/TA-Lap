"use client";

import { useState } from "react";
import { getLapanganGallery } from "@/lib/lapanganMedia";

type Props = {
  gambar?: string | null;
  images?: { image_url: string }[];
  alt: string;
  className?: string;
};

export default function LapanganPhotoGallery({
  gambar,
  images,
  alt,
  className = "",
}: Props) {
  const photos = getLapanganGallery({ gambar, images });
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
        <img
          src={current}
          alt={alt}
          className="h-56 w-full object-cover sm:h-64"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {photos.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                active === index
                  ? "border-cyan-500 ring-2 ring-cyan-500/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
