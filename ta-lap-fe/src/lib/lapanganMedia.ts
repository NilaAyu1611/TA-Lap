type LapanganMediaInput = {
  gambar?: string | null;
  images?: { image_url?: string | null }[];
};

export const DEFAULT_LAPANGAN_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop";

export function getLapanganCover(lapangan: LapanganMediaInput) {
  if (lapangan.gambar?.trim()) return lapangan.gambar.trim();
  const first = lapangan.images?.[0]?.image_url;
  if (first?.trim()) return first.trim();
  return DEFAULT_LAPANGAN_IMAGE;
}

export function getLapanganGallery(lapangan: LapanganMediaInput) {
  const urls = new Set<string>();
  if (lapangan.gambar?.trim()) urls.add(lapangan.gambar.trim());
  for (const img of lapangan.images || []) {
    if (img.image_url?.trim()) urls.add(img.image_url.trim());
  }
  const list = Array.from(urls);
  return list.length > 0 ? list : [DEFAULT_LAPANGAN_IMAGE];
}

export function buildMapsEmbedUrl(lat: number, lng: number) {
  const pad = 0.012;
  const bbox = [lng - pad, lat - pad, lng + pad, lat + pad].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function buildMapsLink(lapangan: {
  google_maps_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  alamat?: string | null;
  nama?: string;
}) {
  if (lapangan.google_maps_url?.trim()) return lapangan.google_maps_url.trim();
  if (lapangan.latitude != null && lapangan.longitude != null) {
    return `https://www.google.com/maps?q=${lapangan.latitude},${lapangan.longitude}`;
  }
  if (lapangan.alamat?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lapangan.alamat)}`;
  }
  return null;
}
