"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { buildMapsEmbedUrl, buildMapsLink } from "@/lib/lapanganMedia";

type Props = {
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
  alamat?: string | null;
  nama?: string;
  compact?: boolean;
};

export default function LapanganMapEmbed({
  latitude,
  longitude,
  google_maps_url,
  alamat,
  nama,
  compact = false,
}: Props) {
  const mapsLink = buildMapsLink({
    google_maps_url,
    latitude,
    longitude,
    alamat,
    nama,
  });

  const hasCoords = latitude != null && longitude != null;

  if (!hasCoords && !mapsLink) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 dark:border-white/10">
        Peta belum tersedia — owner perlu isi lokasi venue.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {hasCoords && (
        <div
          className={`overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 ${
            compact ? "h-44" : "h-56 sm:h-64"
          }`}
        >
          <iframe
            title={`Peta ${nama || "lapangan"}`}
            src={buildMapsEmbedUrl(latitude!, longitude!)}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {(alamat || mapsLink) && (
        <div className="flex flex-wrap items-start justify-between gap-2 text-sm">
          {alamat && (
            <p className="inline-flex items-start gap-1.5 text-gray-600 dark:text-gray-400">
              <MapPin size={15} className="mt-0.5 shrink-0 text-cyan-600" />
              {alamat}
            </p>
          )}
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 font-medium text-cyan-600 hover:underline dark:text-cyan-400"
            >
              Buka di Google Maps
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
