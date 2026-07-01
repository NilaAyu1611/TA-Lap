/** Kode bank Iris/Midtrans — selaras dengan backend */
export const INDONESIAN_BANKS = [
  { code: "bca", name: "BCA" },
  { code: "bni", name: "BNI" },
  { code: "bri", name: "BRI" },
  { code: "mandiri", name: "Bank Mandiri" },
  { code: "cimb", name: "CIMB Niaga" },
  { code: "permata", name: "Permata Bank" },
  { code: "danamon", name: "Danamon" },
  { code: "bsi", name: "BSI" },
  { code: "btn", name: "BTN" },
  { code: "mega", name: "Bank Mega" },
  { code: "ocbc", name: "OCBC NISP" },
  { code: "panin", name: "Panin Bank" },
  { code: "maybank", name: "Maybank Indonesia" },
  { code: "sinarmas", name: "Sinarmas" },
  { code: "bjb", name: "BJB" },
  { code: "bukopin", name: "Bukopin" },
  { code: "dki", name: "Bank DKI" },
  { code: "jago", name: "Bank Jago" },
  { code: "seabank", name: "SeaBank" },
] as const;

export function bankLabel(code: string | null | undefined): string {
  if (!code) return "—";
  const found = INDONESIAN_BANKS.find((b) => b.code === code.toLowerCase());
  return found ? `${found.name} (${found.code.toUpperCase()})` : code.toUpperCase();
}
