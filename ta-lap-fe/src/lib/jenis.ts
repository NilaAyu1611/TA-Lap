export function formatJenisLabel(nama: string | null | undefined) {
  if (!nama) return "";
  return nama
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
