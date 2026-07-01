/** Email internal walk-in (tanpa email asli dari pelanggan). */
export function isGuestEmail(email: string | null | undefined): boolean {
  return !!email && email.endsWith("@guest.talap.local");
}

/** Email untuk tampilan UI — guest dikembalikan null. */
export function formatDisplayEmail(
  email: string | null | undefined
): string | null {
  if (!email || isGuestEmail(email)) return null;
  return email;
}

export function formatDisplayEmailOrDash(
  email: string | null | undefined
): string {
  return formatDisplayEmail(email) ?? "—";
}
