"use client";

import { Navigation, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PlaceAutocomplete from "@/components/shared/PlaceAutocomplete";
import { GeoPoint, getCurrentPosition } from "@/lib/geo";
import {
  normalizeCityQuery,
  parseNearbyVenueQuery,
  reverseTomTomPlace,
  searchTomTomPlaces,
} from "@/lib/tomtom";
import { TomTomPlace } from "@/types/tomtom";

export type LocationFilter = {
  center: GeoPoint | null;
  radiusKm: number;
};

type Props = {
  value: LocationFilter;
  onChange: (value: LocationFilter) => void;
  onSportHint?: (sport: string | null) => void;
  onVenueSearchHint?: (text: string) => void;
};

const RADIUS_OPTIONS = [
  { km: 5, label: "5 km" },
  { km: 10, label: "10 km" },
  { km: 25, label: "25 km" },
  { km: 50, label: "50 km" },
  { km: 100, label: "100 km" },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/5";

export default function LapanganLocationFilter({
  value,
  onChange,
  onSportHint,
  onVenueSearchHint,
}: Props) {
  const [query, setQuery] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationBias, setLocationBias] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationBias({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  const setCenter = useCallback(
    (center: GeoPoint | null) => {
      onChange({ ...value, center });
      setError("");
    },
    [onChange, value]
  );

  const applyPlaceCenter = (place: TomTomPlace) => {
    setCenter({
      lat: place.lat,
      lng: place.lng,
      label: place.label,
    });
    setQuery(place.label.split(",").slice(0, 2).join(", "));
  };

  const handleSelectPlace = (place: TomTomPlace) => {
    applyPlaceCenter(place);
  };

  const resolveGeolocationCenter = async () => {
    const point = await getCurrentPosition();
    let label = "Lokasi Anda";

    try {
      const reversed = await reverseTomTomPlace(point.lat, point.lng);
      label = reversed.label;
      setCenter({
        lat: reversed.lat,
        lng: reversed.lng,
        label: reversed.label,
      });
      setQuery(reversed.label.split(",").slice(0, 2).join(", "));
    } catch {
      setCenter({ ...point, label });
      setQuery(label);
    }

    return point;
  };

  const handleNearMe = async () => {
    setLocLoading(true);
    setError("");
    try {
      await resolveGeolocationCenter();
    } catch {
      setError(
        "Izinkan akses lokasi di browser, atau ketik nama kota manual (mis. Yogyakarta)."
      );
    } finally {
      setLocLoading(false);
    }
  };

  const handleNearbyQuery = async (text: string) => {
    const parsed = parseNearbyVenueQuery(text);
    setLocLoading(true);
    setError("");

    try {
      if (parsed.sport) {
        onSportHint?.(parsed.sport);
      }

      if (parsed.cityHint) {
        const cityQuery = normalizeCityQuery(parsed.cityHint);
        const results = await searchTomTomPlaces(cityQuery, {
          kind: "area",
          limit: 1,
          lat: locationBias?.lat,
          lon: locationBias?.lon,
        });
        if (results[0]) {
          applyPlaceCenter(results[0]);
          onVenueSearchHint?.(parsed.sport || "");
          return;
        }
      }

      await resolveGeolocationCenter();
      onVenueSearchHint?.(parsed.sport || "");
    } catch {
      setError(
        "Gagal mendeteksi lokasi terdekat. Klik Lokasi Saya atau pilih kota (mis. Yogyakarta)."
      );
    } finally {
      setLocLoading(false);
    }
  };

  const clearLocation = () => {
    setCenter(null);
    setQuery("");
    setError("");
    onSportHint?.(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex-1">
          <PlaceAutocomplete
            value={query}
            onChange={(text) => {
              setQuery(normalizeCityQuery(text));
              if (!text.trim()) setCenter(null);
            }}
            onSelect={handleSelectPlace}
            onNearbyQuery={handleNearbyQuery}
            searchKind="area"
            locationBias={locationBias}
            normalizeQuery={normalizeCityQuery}
            placeholder="Kota atau area — Yogyakarta, Sleman, Jakarta Selatan..."
            inputClassName={inputClass}
            hint="Pilih kota/area Anda — bukan nama lapangan. Untuk terdekat, klik Lokasi Saya atau ketik lalu pilih kota."
            disabled={locLoading}
          />
        </div>

        <div className="flex flex-wrap gap-2 lg:pt-0">
          <button
            type="button"
            onClick={handleNearMe}
            disabled={locLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"
          >
            <Navigation size={16} className="text-cyan-600" />
            Lokasi Saya
          </button>
          {value.center && (
            <button
              type="button"
              onClick={clearLocation}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-3 text-sm text-gray-500 hover:text-red-600"
              title="Hapus filter lokasi"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {value.center && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Radius:</span>
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.km}
              type="button"
              onClick={() => onChange({ ...value, radiusKm: opt.km })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                value.radiusKm === opt.km
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <span className="ml-1 text-xs text-cyan-600 dark:text-cyan-400">
            dari {value.center.label || "titik pilihan"}
          </span>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
