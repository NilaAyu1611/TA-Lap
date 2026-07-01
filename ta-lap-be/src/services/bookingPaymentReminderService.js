import prisma from "../config/prisma.js";
import { extractWallClockTime } from "../utils/lapanganAvailability.js";
import { deliverNotificationChannels } from "./emailNotificationService.js";

/** Batas bayar: 15 menit sebelum jam mulai booking. */
export const PAYMENT_DEADLINE_MINUTES_BEFORE = 15;
const REMINDER_1H_MS = 60 * 60 * 1000;
const WARNING_15M_MS = PAYMENT_DEADLINE_MINUTES_BEFORE * 60 * 1000;
const REMINDER_WINDOW_MS = 5 * 60 * 1000;

export function isUnpaidPesanan(pesanan) {
  if (pesanan.status !== "pending") return false;
  if (!pesanan.pembayaran) return true;
  return pesanan.pembayaran.status === "gagal";
}

/** Prisma filter: pesanan pending yang masih perlu dibayar (selaras dengan FE needsPayment). */
export function unpaidPesananWhere(baseWhere = {}) {
  return {
    ...baseWhere,
    status: "pending",
    OR: [
      { pembayaran: { is: null } },
      { pembayaran: { status: "gagal" } },
    ],
  };
}

function formatBookingWhen(pesanan) {
  const date = new Date(pesanan.tanggal_booking).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const mulai = extractWallClockTime(pesanan.jam_mulai);
  const selesai = extractWallClockTime(pesanan.jam_selesai);
  return `${date} · ${mulai}–${selesai}`;
}

function paymentLink(pesananId) {
  return `/user/pembayaran?pesanan=${String(pesananId)}`;
}

async function notificationExists(pesananId, type) {
  const row = await prisma.notifikasi.findFirst({
    where: {
      pesanan_id: BigInt(pesananId),
      type,
    },
    select: { id: true },
  });
  return Boolean(row);
}

async function createNotification({
  userId,
  pesananId,
  type,
  title,
  message,
  link,
}) {
  const exists = await notificationExists(pesananId, type);
  if (exists) return null;

  const row = await prisma.notifikasi.create({
    data: {
      user_id: BigInt(userId),
      pesanan_id: BigInt(pesananId),
      type,
      title,
      message,
      link,
    },
  });

  await deliverNotificationChannels({
    userId,
    title,
    message,
    link,
    type,
  });

  return row;
}

export async function notifyUserWalkInBooking(pesanan) {
  if (!pesanan?.user_id) return null;

  const lapangan = pesanan.lapangan?.nama || "lapangan";
  const when = formatBookingWhen(pesanan);
  const venue = pesanan.lapangan?.owner?.name
    ? ` (${pesanan.lapangan.owner.name})`
    : "";

  if (pesanan.status === "pending" && isUnpaidPesanan(pesanan)) {
    return createNotification({
      userId: pesanan.user_id,
      pesananId: pesanan.id,
      type: "booking_created_by_venue",
      title: "Booking dibuat di venue",
      message: `${lapangan}${venue} · ${when} didaftarkan untuk Anda. Selesaikan pembayaran melalui aplikasi atau bayar di venue.`,
      link: paymentLink(pesanan.id),
    });
  }

  return createNotification({
    userId: pesanan.user_id,
    pesananId: pesanan.id,
    type: "booking_created_by_venue",
    title: "Booking Anda sudah terdaftar",
    message: `${lapangan}${venue} · ${when} didaftarkan untuk Anda. Cek detail di menu Pesanan.`,
    link: "/user/pesanan",
  });
}

export async function notifyBookingCreatedUnpaid(pesanan) {
  if (!isUnpaidPesanan(pesanan)) return null;

  const lapangan = pesanan.lapangan?.nama || "lapangan";
  const when = formatBookingWhen(pesanan);

  return createNotification({
    userId: pesanan.user_id,
    pesananId: pesanan.id,
    type: "booking_created_unpaid",
    title: "Booking berhasil — selesaikan pembayaran",
    message: `${lapangan} (${when}). Bayar sebelum H-${PAYMENT_DEADLINE_MINUTES_BEFORE} menit jam main, atau booking otomatis dibatalkan dan slot kembali tersedia.`,
    link: paymentLink(pesanan.id),
  });
}

/** User mendapat notifikasi saat pembayaran booking berhasil. */
export async function notifyUserPaymentSuccess(pesananId) {
  const pesanan = await prisma.pesanan.findUnique({
    where: { id: BigInt(pesananId) },
    include: {
      lapangan: { select: { nama: true } },
    },
  });

  if (!pesanan?.user_id) return null;

  const kode = pesanan.kode_booking || "—";
  const lapangan = pesanan.lapangan?.nama || "Lapangan";
  const when = formatBookingWhen(pesanan);

  return createNotification({
    userId: pesanan.user_id,
    pesananId: pesanan.id,
    type: "user_payment_success",
    title: "Pembayaran berhasil",
    message: `${kode} — ${lapangan} (${when}). Booking Anda sudah dikonfirmasi.`,
    link: "/user/pesanan",
  });
}

async function expireUnpaidPesanan(pesanan, tx = prisma) {
  if (pesanan.pembayaran?.status === "menunggu") {
    await tx.pembayaran.update({
      where: { id: pesanan.pembayaran.id },
      data: {
        status: "gagal",
        refund_reason:
          "Pembayaran tidak diselesaikan sebelum batas waktu — booking expired",
        jumlah_refund: 0,
        jumlah_potongan: 0,
      },
    });
  }

  const updated = await tx.pesanan.update({
    where: { id: pesanan.id },
    data: { status: "expired" },
    include: {
      lapangan: { select: { nama: true } },
    },
  });

  const when = formatBookingWhen(pesanan);
  const lapangan = updated.lapangan?.nama || "lapangan";

  await createNotification({
    userId: pesanan.user_id,
    pesananId: pesanan.id,
    type: "booking_expired_unpaid",
    title: "Booking dibatalkan otomatis",
    message: `${lapangan} (${when}) dibatalkan karena belum dibayar. Slot lapangan kembali tersedia untuk user lain.`,
    link: "/user/pesanan",
  });

  return updated;
}

/**
 * Jalankan reminder H-1 jam, peringatan H-15 menit, dan auto-expire unpaid.
 */
export async function processBookingPaymentReminders(now = new Date()) {
  const pesanans = await prisma.pesanan.findMany({
    where: {
      status: "pending",
      jam_mulai: { gt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    },
    include: {
      pembayaran: true,
      lapangan: { select: { nama: true } },
    },
  });

  let reminders1h = 0;
  let warnings15m = 0;
  let expired = 0;

  for (const pesanan of pesanans) {
    if (!isUnpaidPesanan(pesanan)) continue;

    const startMs = new Date(pesanan.jam_mulai).getTime();
    const msUntilStart = startMs - now.getTime();
    const deadlineMs = startMs - WARNING_15M_MS;

    const lapangan = pesanan.lapangan?.nama || "lapangan";
    const when = formatBookingWhen(pesanan);
    const link = paymentLink(pesanan.id);

    if (now.getTime() >= deadlineMs) {
      await expireUnpaidPesanan(pesanan);
      expired += 1;
      continue;
    }

    if (
      msUntilStart <= REMINDER_1H_MS + REMINDER_WINDOW_MS &&
      msUntilStart > REMINDER_1H_MS - REMINDER_WINDOW_MS
    ) {
      const sent = await createNotification({
        userId: pesanan.user_id,
        pesananId: pesanan.id,
        type: "payment_reminder_1h",
        title: "⏰ 1 jam lagi — belum bayar",
        message: `Booking ${lapangan} (${when}) belum dibayar. Segera bayar agar slot tidak hilang. Batas: ${PAYMENT_DEADLINE_MINUTES_BEFORE} menit sebelum jam main.`,
        link,
      });
      if (sent) reminders1h += 1;
    }

    if (
      msUntilStart <= WARNING_15M_MS + REMINDER_WINDOW_MS &&
      msUntilStart > WARNING_15M_MS - REMINDER_WINDOW_MS
    ) {
      const sent = await createNotification({
        userId: pesanan.user_id,
        pesananId: pesanan.id,
        type: "payment_warning_15m",
        title: "⚠️ 15 menit lagi slot dibatalkan",
        message: `Booking ${lapangan} (${when}) akan OTOMATIS DIBATALKAN jika belum dibayar dalam ${PAYMENT_DEADLINE_MINUTES_BEFORE} menit sebelum jam main. Bayar sekarang!`,
        link,
      });
      if (sent) warnings15m += 1;
    }
  }

  return { reminders1h, warnings15m, expired, checked: pesanans.length };
}
