/** Jarak km antara dua titik (Haversine). */
import { searchTomTomPlaces } from "@/lib/tomtom";

export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export type GeoPoint = { lat: number; lng: number; label?: string };

export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  if (query.trim().length < 2) return null;

  try {
    const results = await searchTomTomPlaces(query, { limit: 1, kind: "area" });
    if (!results[0]) return null;

    return {
      lat: results[0].lat,
      lng: results[0].lng,
      label: results[0].label,
    };
  } catch {
    return null;
  }
}

export function getCurrentPosition(): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "Lokasi Anda",
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
}
