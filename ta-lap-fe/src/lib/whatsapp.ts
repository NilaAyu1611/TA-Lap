/** Normalisasi nomor Indonesia ke format wa.me (628xxx) */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

export function buildWhatsAppUrl(
  phone: string,
  message = "Halo admin TA-LAP, saya butuh bantuan."
): string {
  const normalized = toWhatsAppNumber(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
