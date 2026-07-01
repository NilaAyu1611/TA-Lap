const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Jakarta";

/** @param {string} time "HH:mm" or "HH:mm:ss" */
export function parseTimeToMinutes(time) {
  if (!time) return 0;
  const [h, m] = String(time).split(":").map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Jam tampilan (WIB) — selaras dengan formatTime di frontend. */
export function extractWallClockTime(dateValue, timezone = APP_TIMEZONE) {
  const d = new Date(dateValue);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function slotDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`);
}

export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

export function rangesOverlapDate(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

export function getTodayDateString(now = new Date(), timezone = APP_TIMEZONE) {
  return now.toLocaleDateString("en-CA", { timeZone: timezone });
}

export function getNowMinutes(now = new Date(), timezone = APP_TIMEZONE) {
  return parseTimeToMinutes(extractWallClockTime(now, timezone));
}

export function isSlotPast(dateStr, slotEndMinutes, now = new Date()) {
  const today = getTodayDateString(now);
  if (dateStr !== today) return dateStr < today;

  return slotEndMinutes <= getNowMinutes(now);
}

/**
 * @param {Array<{ jam_mulai: Date, jam_selesai: Date, status: string, kode_booking: string }>} bookings
 */
export function buildLapanganAvailability(lapangan, dateStr, bookings, now = new Date()) {
  const jamBuka = lapangan.jam_buka || "08:00";
  const jamTutup = lapangan.jam_tutup || "22:00";
  const openMin = parseTimeToMinutes(jamBuka);
  const closeMin = parseTimeToMinutes(jamTutup);

  const booked = bookings.map((b) => {
    const jamMulai = extractWallClockTime(b.jam_mulai);
    const jamSelesai = extractWallClockTime(b.jam_selesai);
    return {
      id: String(b.id),
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      status: b.status,
      kode_booking: b.kode_booking,
      startMin: parseTimeToMinutes(jamMulai),
      endMin: parseTimeToMinutes(jamSelesai),
      startAt: new Date(b.jam_mulai),
      endAt: new Date(b.jam_selesai),
    };
  });

  const slots = [];
  for (let start = openMin; start + 60 <= closeMin; start += 60) {
    const end = start + 60;
    const slotStart = slotDateTime(dateStr, minutesToTime(start));
    const slotEnd = slotDateTime(dateStr, minutesToTime(end));

    const isBooked = booked.some((b) =>
      rangesOverlapDate(slotStart, slotEnd, b.startAt, b.endAt)
    );
    const isPast = isSlotPast(dateStr, end, now);

    slots.push({
      jam_mulai: minutesToTime(start),
      jam_selesai: minutesToTime(end),
      status: isBooked ? "booked" : isPast ? "past" : "available",
    });
  }

  return {
    date: dateStr,
    jam_buka: jamBuka.length === 5 ? jamBuka : jamBuka.slice(0, 5),
    jam_tutup: jamTutup.length === 5 ? jamTutup : jamTutup.slice(0, 5),
    slots,
    booked: booked.map(({ startMin, endMin, startAt, endAt, ...rest }) => rest),
    total_booked: booked.length,
    total_available: slots.filter((s) => s.status === "available").length,
  };
}

/** Cek apakah rentang jam bentrok dengan booking yang ada. */
export function isRangeBooked(jamMulai, jamSelesai, bookedList) {
  const start = parseTimeToMinutes(jamMulai);
  const end = parseTimeToMinutes(jamSelesai);
  return bookedList.some((b) =>
    rangesOverlap(
      start,
      end,
      parseTimeToMinutes(b.jam_mulai),
      parseTimeToMinutes(b.jam_selesai)
    )
  );
}
