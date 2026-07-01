import { TomTomPlace } from "@/types/tomtom";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export type TomTomSearchOptions = {
  limit?: number;
  kind?: "area" | "all";
  lat?: number;
  lon?: number;
};

export async function searchTomTomPlaces(
  query: string,
  options: TomTomSearchOptions = {}
): Promise<TomTomPlace[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const { limit = 6, kind = "all", lat, lon } = options;

  const params = new URLSearchParams({
    q,
    limit: String(limit),
    kind,
  });

  if (lat != null && lon != null) {
    params.set("lat", String(lat));
    params.set("lon", String(lon));
  }

  const response = await fetch(
    `${API_BASE}/lapangan/places/search?${params}`,
    { cache: "no-store" }
  );

  const body = (await response.json().catch(() => ({}))) as {
    data?: TomTomPlace[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error(body.message || "Gagal mencari lokasi");
  }

  return body.data || [];
}

export async function reverseTomTomPlace(
  lat: number,
  lon: number
): Promise<TomTomPlace> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });

  const response = await fetch(
    `${API_BASE}/lapangan/places/reverse?${params}`,
    { cache: "no-store" }
  );

  const body = (await response.json().catch(() => ({}))) as {
    data?: TomTomPlace;
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "Gagal membaca lokasi");
  }

  return body.data;
}

/** Query seperti "lapangan badminton terdekat" → pakai GPS + filter jenis. */
export function parseNearbyVenueQuery(query: string): {
  isNearby: boolean;
  sport: string | null;
  cityHint: string | null;
} {
  const text = query.trim().toLowerCase();
  const isNearby =
    /\b(terdekat|dekat\s+(saya|sini)|sekitar\s+saya|near\s*me|around\s*me)\b/i.test(
      text
    );

  const sportMatch = text.match(
    /\b(futsal|badminton|basket(?:ball)?|tenis|voli|sepak\s*bola|billiard|padel)\b/i
  );
  const sport = sportMatch
    ? sportMatch[1].replace(/\s+/g, " ").replace("basketball", "basket")
    : null;

  const cityMatch = text.match(
    /\b(?:di|dekat|area|kota)\s+([a-z\s-]{3,40})/i
  );
  const cityHint = cityMatch
    ? cityMatch[1]
        .replace(/\b(terdekat|dekat|lapangan)\b/gi, "")
        .trim() || null
    : null;

  return { isNearby, sport, cityHint };
}

/** Alias kota umum → kata kunci TomTom. */
export function normalizeCityQuery(query: string): string {
  const q = query.trim();
  const aliases: Record<string, string> = {
    jogja: "Yogyakarta",
    jogjakarta: "Yogyakarta",
    yogyakarta: "Yogyakarta",
    jkt: "Jakarta",
    jaksel: "Jakarta Selatan",
    jakbar: "Jakarta Barat",
    jaktim: "Jakarta Timur",
    jakut: "Jakarta Utara",
    jakpus: "Jakarta Pusat",
    sby: "Surabaya",
    bdg: "Bandung",
    smg: "Semarang",
    mdn: "Medan",
  };

  const lower = q.toLowerCase();
  for (const [key, value] of Object.entries(aliases)) {
    if (lower === key || lower.startsWith(`${key} `)) {
      return q.replace(new RegExp(`^${key}`, "i"), value);
    }
  }
  return q;
}
