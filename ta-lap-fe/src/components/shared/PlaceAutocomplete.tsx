"use client";

import { Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  searchTomTomPlaces,
  TomTomSearchOptions,
} from "@/lib/tomtom";
import { TomTomPlace } from "@/types/tomtom";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: TomTomPlace) => void;
  placeholder?: string;
  inputClassName?: string;
  hint?: string;
  minChars?: number;
  disabled?: boolean;
  searchKind?: "area" | "all";
  locationBias?: { lat: number; lon: number } | null;
  onNearbyQuery?: (query: string) => void | Promise<void>;
  normalizeQuery?: (query: string) => string;
};

export default function PlaceAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Ketik nama kota, alamat, atau tempat...",
  inputClassName = "",
  hint = "Suggestion muncul otomatis via TomTom Maps",
  minChars = 2,
  disabled = false,
  searchKind = "all",
  locationBias = null,
  onNearbyQuery,
  normalizeQuery,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<TomTomPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildSearchOptions = useCallback((): TomTomSearchOptions => {
    const opts: TomTomSearchOptions = {
      limit: 8,
      kind: searchKind,
    };
    if (locationBias) {
      opts.lat = locationBias.lat;
      opts.lon = locationBias.lon;
    }
    return opts;
  }, [locationBias, searchKind]);

  const runSearch = useCallback(
    async (text: string) => {
      if (text.trim().length < minChars) {
        setSuggestions([]);
        setOpen(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const results = await searchTomTomPlaces(text, buildSearchOptions());
        setSuggestions(results);
        setOpen(results.length > 0);
        if (results.length === 0) {
          setError(
            searchKind === "area"
              ? "Kota/area tidak ditemukan. Coba: Yogyakarta, Sleman, Jakarta Selatan."
              : "Tidak ada lokasi ditemukan. Coba kata kunci lain."
          );
        }
      } catch (err: unknown) {
        setSuggestions([]);
        setOpen(false);
        const message =
          err instanceof Error ? err.message : "Gagal mencari lokasi";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [buildSearchOptions, minChars, searchKind]
  );

  const handleInputChange = (text: string) => {
    onChange(text);
    setError("");

    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    if (onNearbyQuery && /\b(terdekat|dekat\s+saya|near\s*me)\b/i.test(text)) {
      setSuggestions([]);
      setOpen(false);
      void onNearbyQuery(text);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    const searchText = normalizeQuery ? normalizeQuery(text) : text;
    debounceRef.current = setTimeout(() => runSearch(searchText), 350);
  };

  const handleSelect = (place: TomTomPlace) => {
    skipSearchRef.current = true;
    onChange(place.label);
    setOpen(false);
    setSuggestions([]);
    setError("");
    onSelect(place);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={inputClassName}
        />
        {loading && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
          />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/15 dark:bg-gray-800">
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2.5 text-left text-sm transition hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {item.label.split(",")[0]}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
