import prisma from "../config/prisma.js";
import { deliverNotificationChannels } from "./emailNotificationService.js";

function resolveOwnerId(pesanan) {
  return (
    pesanan.lapangan?.owner?.id ??
    pesanan.lapangan?.owner_id ??
    null
  );
}

async function ownerNotificationExists(pesananId, type, ownerId) {
  const row = await prisma.notifikasi.findFirst({
    where: {
      pesanan_id: BigInt(pesananId),
      type,
      user_id: BigInt(ownerId),
    },
    select: { id: true },
  });
  return Boolean(row);
}

async function notifyOwner({
  ownerId,
  type,
  title,
  message,
  link,
  pesananId,
}) {
  if (!ownerId) return;

  if (pesananId && type) {
    const exists = await ownerNotificationExists(pesananId, type, ownerId);
    if (exists) return;
  }

  await prisma.notifikasi.create({
    data: {
      user_id: BigInt(ownerId),
      type,
      title,
      message,
      link: link || null,
      pesanan_id: pesananId ? BigInt(pesananId) : null,
    },
  });

  await deliverNotificationChannels({
    userId: ownerId,
    title,
    message,
    link,
    type,
  });
}

/** Owner mendapat notifikasi saat ada booking baru di lapangannya. */
export async function notifyOwnerNewBooking(pesanan) {
  const ownerId = resolveOwnerId(pesanan);
  if (!ownerId) return;

  const kode = pesanan.kode_booking || "—";
  const pemain = pesanan.user?.name || "Pemain";
  const lapangan = pesanan.lapangan?.nama || "Lapangan";

  await notifyOwner({
    ownerId,
    type: "owner_booking_new",
    title: "Pesanan baru di lapangan Anda",
    message: `${kode} — ${pemain} · ${lapangan}`,
    link: `/owner/pesanan?q=${encodeURIComponent(kode)}`,
    pesananId: pesanan.id,
  });
}

/** Owner mendapat notifikasi saat pembayaran booking berhasil. */
export async function notifyOwnerPaymentSuccess(pesananId) {
  const pesanan = await prisma.pesanan.findUnique({
    where: { id: BigInt(pesananId) },
    include: {
      user: { select: { name: true } },
      lapangan: {
        include: { owner: { select: { id: true } } },
      },
    },
  });

  if (!pesanan) return;

  const ownerId = resolveOwnerId(pesanan);
  if (!ownerId) return;

  const kode = pesanan.kode_booking || "—";
  const pemain = pesanan.user?.name || "Pemain";
  const lapangan = pesanan.lapangan?.nama || "Lapangan";

  await notifyOwner({
    ownerId,
    type: "owner_payment_success",
    title: "Pembayaran diterima",
    message: `${kode} — ${pemain} · ${lapangan}`,
    link: `/owner/pembayaran?q=${encodeURIComponent(kode)}`,
    pesananId: pesanan.id,
  });
}

function formatMonthLabel(year, month) {
  const names = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${names[month - 1] ?? month} ${year}`;
}

export async function notifyOwnerSetoranApproved(pengajuan, owner) {
  await notifyOwner({
    ownerId: owner.id,
    type: "owner_setoran_approved",
    title: "Setoran komisi disetujui",
    message: `${formatMonthLabel(pengajuan.tahun, pengajuan.bulan)} — admin sudah verifikasi pembayaran Anda`,
    link: "/owner/setoran-tunai",
  });
}

export async function notifyOwnerSetoranRejected(pengajuan, owner, reason) {
  await notifyOwner({
    ownerId: owner.id,
    type: "owner_setoran_rejected",
    title: "Setoran komisi ditolak",
    message: `${formatMonthLabel(pengajuan.tahun, pengajuan.bulan)} — ${reason}`,
    link: "/owner/setoran-tunai",
  });
}
