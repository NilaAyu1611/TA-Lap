/** Kode bank Iris/Midtrans — https://iris-docs.midtrans.com/#supported-banks */
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
];

const BANK_CODES = new Set(INDONESIAN_BANKS.map((b) => b.code));

export function isValidBankCode(code) {
  return BANK_CODES.has(String(code || "").trim().toLowerCase());
}

export function normalizeBankCode(code) {
  return String(code || "").trim().toLowerCase();
}

export function bankLabel(code) {
  if (!code) return "—";
  const found = INDONESIAN_BANKS.find(
    (b) => b.code === String(code).trim().toLowerCase()
  );
  return found ? found.name : String(code).toUpperCase();
}
