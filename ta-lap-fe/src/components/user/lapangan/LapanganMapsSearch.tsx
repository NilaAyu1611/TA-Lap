"use client";

import {
  Loader2,
  MapPin,
  Navigation,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GeoPoint, getCurrentPosition } from "@/lib/geo";
import {
  buildSearchSuggestions,
  normalizeCityQuery,
  parseLapanganSearchQuery,
  SearchSuggestion,
} from "@/lib/lapanganSearch";
import { reverseTomTomPlace, searchTomTomPlaces } from "@/lib/tomtom";
import { Lapangan } from "@/types/lapangan";

export type LocationFilter = {
  center: GeoPoint | null;
  radiusKm: number;
};

export type LapanganSearchApply = {
  query: string;
  center: GeoPoint | null;
  radiusKm: number;
  jenis: string;
  keywords: string;
};

type Props = {
  lapangans: Lapangan[];
  locationFilter: LocationFilter;
  jenisFilter: string;
  searchQuery: string;
  keywordFilter: string;
  onApply: (state: LapanganSearchApply) => void;
};

const RADIUS_OPTIONS = [
  { km: 5, label: "5 km" },
  { km: 10, label: "10 km" },
  { km: 25, label: "25 km" },
  { km: 50, label: "50 km" },
  { km: 100, label: "100 km" },
];

export default function LapanganMapsSearch({
  lapangans,
  locationFilter,
  jenisFilter,
  searchQuery,
  keywordFilter,
  onApply,
}: Props) {
  const [input, setInput] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [placeSuggestions, setPlaceSuggestions] = useState<
    { id: string; label: string; lat: number; lng: number }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationBias, setLocationBias] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocationBias({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const resolveGpsCenter = useCallback(async (): Promise<GeoPoint> => {
    const point = await getCurrentPosition();
    try {
      const reversed = await reverseTomTomPlace(point.lat, point.lng);
      return {
        lat: reversed.lat,
        lng: reversed.lng,
        label: reversed.label,
      };
    } catch {
      return { ...point, label: "Lokasi Anda" };
    }
  }, []);

  const resolveCityCenter = useCallback(
    async (cityQuery: string): Promise<GeoPoint | null> => {
      const results = await searchTomTomPlaces(normalizeCityQuery(cityQuery), {
        kind: "area",
        limit: 1,
        lat: locationBias?.lat,
        lon: locationBias?.lon,
      });
      if (!results[0]) return null;
      return {
        lat: results[0].lat,
        lng: results[0].lng,
        label: results[0].label,
      };
    },
    [locationBias]
  );

  const runApply = useCallback(
    async (
      query: string,
      opts?: { centerOverride?: GeoPoint | null }
    ) => {
      const parsed = parseLapanganSearchQuery(query);

      setLoading(true);
      setError("");

      try {
        let center: GeoPoint | null = opts?.centerOverride ?? null;

        if (!center && parsed.cityQuery) {
          center = await resolveCityCenter(parsed.cityQuery);
        }

        if (!center) {
          center = await resolveGpsCenter();
        }

        onApply({
          query: query.trim(),
          center,
          radiusKm: locationFilter.radiusKm,
          jenis: parsed.sport || jenisFilter,
          keywords: parsed.keywords,
        });

        setOpen(false);
      } catch {
        setError(
          "Akses lokasi diperlukan untuk menghitung jarak venue. Izinkan di browser lalu coba lagi."
        );
      } finally {
        setLoading(false);
      }
    },
    [jenisFilter, locationFilter.radiusKm, onApply, resolveCityCenter, resolveGpsCenter]
  );

  const updateSuggestions = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) {
        setSuggestions([]);
        setPlaceSuggestions([]);
        setOpen(false);
        return;
      }

      const local = buildSearchSuggestions(trimmed, lapangans);
      setSuggestions(local);

      if (trimmed.length >= 2) {
        try {
          const places = await searchTomTomPlaces(normalizeCityQuery(trimmed), {
            kind: "area",
            limit: 4,
            lat: locationBias?.lat,
            lon: locationBias?.lon,
          });
          setPlaceSuggestions(
            places.map((p) => ({
              id: p.id,
              label: p.label,
              lat: p.lat,
              lng: p.lng,
            }))
          );
          setOpen(local.length > 0 || places.length > 0);
        } catch {
          setPlaceSuggestions([]);
          setOpen(local.length > 0);
        }
      } else {
        setPlaceSuggestions([]);
        setOpen(local.length > 0);
      }
    },
    [lapangans, locationBias]
  );

  const handleInputChange = (text: string) => {
    setInput(text);
    setError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void updateSuggestions(text), 300);
  };

  const handleSelectPlace = (place: {
    label: string;
    lat: number;
    lng: number;
  }) => {
    setInput(place.label);
    void runApply(place.label, {
      centerOverride: { lat: place.lat, lng: place.lng, label: place.label },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runApply(input);
  };

  const clearSearch = () => {
    setInput("");
    setSuggestions([]);
    setPlaceSuggestions([]);
    setOpen(false);
    setError("");
    onApply({
      query: "",
      center: null,
      radiusKm: locationFilter.radiusKm,
      jenis: "all",
      keywords: "",
    });
  };

  const hasDropdown =
    open &&
    (suggestions.length > 0 || placeSuggestions.length > 0);

  return (
    <div className="space-y-3">
      <div
        ref={wrapperRef}
        className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-4"
      >
        <form onSubmit={handleSubmit} className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => input.trim().length >= 2 && setOpen(true)}
            placeholder="Jenis olahraga, nama venue, atau kota..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-24 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-white/5"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {loading && (
              <Loader2 size={16} className="animate-spin text-cyan-500" />
            )}
            {input && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-lg p-2 text-gray-400 hover:text-red-500"
                aria-label="Hapus pencarian"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => void runApply(input)}
              className="rounded-lg p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
              title="Perbarui lokasi"
            >
              <Navigation size={18} />
            </button>
          </div>

          {hasDropdown && (
            <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/15 dark:bg-gray-900">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/user/lapangan/${item.venueId}`}
                    onClick={() => setOpen(false)}
                    className="block w-full px-4 py-3 text-left transition hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                  >
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.sublabel && (
                      <p className="text-xs text-gray-500">{item.sublabel}</p>
                    )}
                  </Link>
                </li>
              ))}

              {placeSuggestions.length > 0 && (
                <>
                  {suggestions.length > 0 && (
                    <li className="border-t border-gray-100 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:border-white/10">
                      Area / Kota
                    </li>
                  )}
                  {placeSuggestions.map((place) => (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className="flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                      >
                        <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                        <span className="text-sm">{place.label}</span>
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </form>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Lokasi perangkat dipakai sebagai titik acuan radius. Venue ditampilkan
          berdasarkan jarak dan kata kunci pencarian.
        </p>

        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {locationFilter.center && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan-200/60 bg-cyan-50/50 px-4 py-3 dark:border-cyan-500/20 dark:bg-cyan-500/5">
          <MapPin size={14} className="text-cyan-600" />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            Titik acuan{" "}
            <strong>{locationFilter.center.label || "lokasi Anda"}</strong>
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">Radius:</span>
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.km}
              type="button"
              onClick={() =>
                onApply({
                  query: searchQuery,
                  center: locationFilter.center,
                  radiusKm: opt.km,
                  jenis: jenisFilter,
                  keywords: keywordFilter,
                })
              }
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                locationFilter.radiusKm === opt.km
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-600 dark:bg-white/10 dark:text-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
