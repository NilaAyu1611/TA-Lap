/** URL asset statis dari backend (upload bukti setoran, dll). */
export function apiAssetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
  const origin = apiBase.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
