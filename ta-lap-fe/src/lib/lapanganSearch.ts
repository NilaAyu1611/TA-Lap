/** Parser pencarian terpadu — gaya Google Maps untuk Cari Lapangan. */

const SPORT_KEYWORDS = [
  "futsal",
  "badminton",
  "basket",
  "basketball",
  "tenis",
  "voli",
  "sepak bola",
  "billiard",
  "padel",
] as const;

const CITY_ALIASES: Record<string, string> = {
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
  solo: "Surakarta",
  bali: "Denpasar",
};

export type ParsedLapanganSearch = {
  raw: string;
  /** Aktifkan GPS saat ini */
  useNearby: boolean;
  /** Jenis olahraga jika terdeteksi */
  sport: string | null;
  /** Kota/area untuk geocode (TomTom) */
  cityQuery: string | null;
  /** Kata kunci untuk cocokkan nama/alamat venue di database */
  keywords: string;
};

export function normalizeCityQuery(query: string): string {
  const q = query.trim();
  const lower = q.toLowerCase();
  for (const [key, value] of Object.entries(CITY_ALIASES)) {
    if (lower === key || lower.startsWith(`${key} `) || lower.endsWith(` ${key}`)) {
      return q.replace(new RegExp(key, "i"), value);
    }
  }
  return q;
}

function detectSport(text: string): string | null {
  for (const sport of SPORT_KEYWORDS) {
    if (text.includes(sport)) {
      return sport === "basketball" ? "basket" : sport;
    }
  }
  return null;
}

function detectCityQuery(text: string): string | null {
  const diMatch = text.match(/\b(?:di|dekat|area|kota|sekitar)\s+([a-z0-9\s-]{2,40})/i);
  if (diMatch) {
    const cleaned = diMatch[1]
      .replace(/\b(terdekat|dekat|lapangan|saya|sini)\b/gi, "")
      .trim();
    if (cleaned.length >= 2) return normalizeCityQuery(cleaned);
  }

  for (const alias of Object.keys(CITY_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`, "i").test(text)) {
      return CITY_ALIASES[alias];
    }
  }
  for (const alias of Object.values(CITY_ALIASES)) {
    if (text.toLowerCase().includes(alias.toLowerCase())) {
      return alias;
    }
  }
  return null;
}

export function parseLapanganSearchQuery(query: string): ParsedLapanganSearch {
  const raw = query.trim();
  const lower = raw.toLowerCase();

  const useNearby =
    /\b(terdekat|dekat\s+(saya|sini)|sekitar\s+saya|near\s*me|around\s*me)\b/i.test(
      lower
    );

  const sport = detectSport(lower);
  const cityQuery = detectCityQuery(lower);

  let keywords = lower
    .replace(/\b(lapangan|terdekat|dekat|sekitar|saya|sini|near\s*me|around\s*me)\b/gi, " ")
    .replace(/\b(di|area|kota|dari)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (sport) {
    keywords = keywords.replace(new RegExp(sport, "gi"), "").trim();
  }
  if (cityQuery) {
    keywords = keywords
      .replace(new RegExp(cityQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "")
      .trim();
  }
  for (const alias of Object.keys(CITY_ALIASES)) {
    keywords = keywords.replace(new RegExp(`\\b${alias}\\b`, "gi"), "").trim();
  }

  return { raw, useNearby, sport, cityQuery, keywords };
}

export type SearchSuggestion =
  | { type: "venue"; id: string; label: string; sublabel?: string; venueId: string };

export function buildSearchSuggestions(
  query: string,
  venueNames: { id: string; nama: string; jenis?: string | null; kota?: string | null }[]
): SearchSuggestion[] {
  const parsed = parseLapanganSearchQuery(query);
  const q = query.trim().toLowerCase();

  if (q.length < 2) return [];

  return venueNames
    .filter((v) => {
      const hay = `${v.nama} ${v.jenis || ""} ${v.kota || ""}`.toLowerCase();
      return (
        hay.includes(q) ||
        (parsed.keywords.length >= 2 && hay.includes(parsed.keywords)) ||
        (parsed.sport && (v.jenis || "").toLowerCase() === parsed.sport)
      );
    })
    .slice(0, 6)
    .map((v) => ({
      type: "venue" as const,
      id: `venue-${v.id}`,
      label: v.nama,
      sublabel: [v.jenis, v.kota].filter(Boolean).join(" · "),
      venueId: v.id,
    }));
}
