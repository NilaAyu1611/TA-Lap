"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import PlaceAutocomplete from "@/components/shared/PlaceAutocomplete";
import { formInputClass, formLabelClass } from "./formStyles";
import LapanganMapEmbed from "@/components/lapangan/LapanganMapEmbed";
import { TomTomPlace } from "@/types/tomtom";

export type LocationValue = {
  alamat: string;
  kota: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string;
};

type Props = {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
};

function buildMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function LocationPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState(value.alamat);

  useEffect(() => {
    setQuery(value.alamat);
  }, [value.alamat]);

  const handleSelect = (place: TomTomPlace) => {
    onChange({
      alamat: place.alamat,
      kota: place.kota || value.kota,
      latitude: place.lat,
      longitude: place.lng,
      google_maps_url: buildMapsUrl(place.lat, place.lng),
    });
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    onChange({
      ...value,
      alamat: text,
      latitude: null,
      longitude: null,
      google_maps_url: "",
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className={formLabelClass}>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} />
            Cari Lokasi
          </span>
        </label>
        <PlaceAutocomplete
          value={query}
          onChange={handleQueryChange}
          onSelect={handleSelect}
          placeholder="Ketik alamat venue, mall, jalan, atau kota..."
          inputClassName={formInputClass + " pl-11"}
          hint="Ketik minimal 2 huruf — pilih dari suggestion TomTom Maps."
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={formLabelClass}>Kota</label>
          <input
            type="text"
            value={value.kota}
            onChange={(e) => onChange({ ...value, kota: e.target.value })}
            placeholder="Medan"
            className={formInputClass}
          />
        </div>
        <div>
          <label className={formLabelClass}>Koordinat</label>
          <input
            type="text"
            value={
              value.latitude != null && value.longitude != null
                ? `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`
                : "Belum dipilih"
            }
            readOnly
            className={formInputClass + " cursor-not-allowed opacity-80"}
          />
        </div>
      </div>

      {value.latitude != null && value.longitude != null && (
        <div>
          <label className={formLabelClass}>Preview Peta</label>
          <LapanganMapEmbed
            latitude={value.latitude}
            longitude={value.longitude}
            google_maps_url={value.google_maps_url}
            alamat={value.alamat}
            compact
          />
        </div>
      )}

      {value.latitude == null && value.google_maps_url && (
        <a
          href={value.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-xs font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Lihat di Peta →
        </a>
      )}
    </div>
  );
}
