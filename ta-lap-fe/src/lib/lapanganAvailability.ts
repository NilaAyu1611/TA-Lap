function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

function rangesOverlap(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && endA > startB;
}

export function isRangeBooked(
  jamMulai: string,
  jamSelesai: string,
  booked: { jam_mulai: string; jam_selesai: string }[]
): boolean {
  const start = parseTimeToMinutes(jamMulai);
  const end = parseTimeToMinutes(jamSelesai);
  return booked.some((b) =>
    rangesOverlap(
      start,
      end,
      parseTimeToMinutes(b.jam_mulai),
      parseTimeToMinutes(b.jam_selesai)
    )
  );
}

export function findFirstAvailableSlot(
  slots: { jam_mulai: string; jam_selesai: string; status: string }[]
) {
  return slots.find((s) => s.status === "available") ?? null;
}
