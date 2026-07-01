export function getTomtomConfig() {
  const apiKey = process.env.TOMTOM_API_KEY || "";
  return {
    apiKey,
    enabled: Boolean(apiKey),
  };
}

const AREA_ENTITY_TYPES =
  "Municipality,CountrySubdivision,CountrySecondarySubdivision,CountryTertiarySubdivision,Neighbourhood,MunicipalitySubdivision";

function extractCity(address = {}) {
  return (
    address.municipality ||
    address.municipalitySubdivision ||
    address.localName ||
    address.countrySubdivision ||
    ""
  );
}

function buildLabel(item) {
  const addr = item.address || {};
  const freeform = addr.freeformAddress?.trim();
  const poiName = item.poi?.name?.trim();

  if (poiName && freeform) return `${poiName}, ${freeform}`;
  if (freeform) return freeform;
  if (poiName) return poiName;
  return item.type || "Lokasi";
}

function mapTomTomResult(item, index) {
  const addr = item.address || {};
  const label = buildLabel(item);
  return {
    id: item.id || `${item.position.lat}-${item.position.lon}-${index}`,
    label,
    alamat: addr.freeformAddress?.trim() || label,
    kota: extractCity(addr),
    lat: item.position.lat,
    lng: item.position.lon,
  };
}

export async function searchTomTomPlaces(
  query,
  { limit = 6, kind = "all", lat, lon, radiusM } = {}
) {
  const config = getTomtomConfig();
  if (!config.enabled) {
    throw new Error(
      "TomTom API belum dikonfigurasi. Isi TOMTOM_API_KEY di ta-lap-be/.env"
    );
  }

  const text = String(query || "").trim();
  if (text.length < 2) return [];

  const params = new URLSearchParams({
    key: config.apiKey,
    countrySet: "ID",
    limit: String(Math.min(Math.max(limit, 1), 10)),
    typeahead: "true",
    language: "id-ID",
  });

  if (kind === "area") {
    params.set("entityTypeSet", AREA_ENTITY_TYPES);
    params.set("idxSet", "Geo");
  }

  if (lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon)) {
    params.set("lat", String(lat));
    params.set("lon", String(lon));
    if (radiusM != null && radiusM > 0) {
      params.set("radius", String(Math.round(radiusM)));
    }
  }

  const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?${params}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      data?.errorText ||
      data?.detailedError?.message ||
      `TomTom Search error (${response.status})`;
    throw new Error(msg);
  }

  return (data.results || [])
    .filter((item) => item.position?.lat != null && item.position?.lon != null)
    .map(mapTomTomResult);
}

/** Nama kota/area dari koordinat GPS (untuk "Lokasi saya"). */
export async function reverseGeocodeTomTom(lat, lon) {
  const config = getTomtomConfig();
  if (!config.enabled) {
    throw new Error(
      "TomTom API belum dikonfigurasi. Isi TOMTOM_API_KEY di ta-lap-be/.env"
    );
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Koordinat tidak valid");
  }

  const params = new URLSearchParams({
    key: config.apiKey,
    language: "id-ID",
  });

  const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?${params}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      data?.errorText ||
      data?.detailedError?.message ||
      `TomTom Reverse Geocode error (${response.status})`;
    throw new Error(msg);
  }

  const addresses = data.addresses || [];
  const first = addresses[0];
  if (!first?.address) {
    return {
      lat,
      lng: lon,
      label: "Lokasi Anda",
      alamat: "Lokasi Anda",
      kota: "",
    };
  }

  const addr = first.address;
  const municipality = extractCity(addr);
  const subdivision = addr.countrySubdivision || "";
  const label =
    municipality && subdivision
      ? `${municipality}, ${subdivision}`
      : municipality || addr.freeformAddress?.trim() || "Lokasi Anda";

  return {
    id: `reverse-${lat}-${lon}`,
    label,
    alamat: addr.freeformAddress?.trim() || label,
    kota: municipality,
    lat: first.position?.lat ?? lat,
    lng: first.position?.lon ?? lon,
  };
}
