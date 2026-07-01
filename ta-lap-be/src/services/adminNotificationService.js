import prisma from "../config/prisma.js";
import { getOrCreatePlatformSettings } from "../utils/platformSettings.js";

async function getActiveAdminIds() {
  const admins = await prisma.user.findMany({
    where: { role: "admin", status: "active" },
    select: { id: true },
  });
  return admins.map((a) => a.id);
}

async function adminNotificationExists(pesananId, type) {
  if (!pesananId) return false;
  const row = await prisma.notifikasi.findFirst({
    where: {
      pesanan_id: BigInt(pesananId),
      type,
    },
    select: { id: true },
  });
  return Boolean(row);
}

/**
 * Kirim notifikasi ke semua admin aktif.
 * settingKey: booking_notification | owner_notification | payment_notification | backup_notification
 */
export async function notifyAdmins({
  settingKey,
  type,
  title,
  message,
  link,
  pesananId,
}) {
  const settings = await getOrCreatePlatformSettings();
  if (settingKey && settings[settingKey] === false) return;

  if (pesananId && type) {
    const exists = await adminNotificationExists(pesananId, type);
    if (exists) return;
  }

  const adminIds = await getActiveAdminIds();
  if (adminIds.length === 0) return;

  await prisma.notifikasi.createMany({
    data: adminIds.map((adminId) => ({
      user_id: adminId,
      type: type || null,
      title,
      message,
      link: link || null,
      pesanan_id: pesananId ? BigInt(pesananId) : null,
    })),
  });
}

export async function notifyAdminsNewBooking(pesanan) {
  const kode = pesanan.kode_booking || "—";
  const pemain = pesanan.user?.name || "Pemain";
  const lapangan = pesanan.lapangan?.nama || "Lapangan";

  await notifyAdmins({
    settingKey: "booking_notification",
    type: "admin_booking_new",
    title: "Pesanan baru",
    message: `${kode} — ${pemain} · ${lapangan}`,
    link: `/admin/pesanan?q=${encodeURIComponent(kode)}`,
    pesananId: pesanan.id,
  });
}

export async function notifyAdminsPaymentSuccess(pesananId) {
  const pesanan = await prisma.pesanan.findUnique({
    where: { id: BigInt(pesananId) },
    include: {
      user: { select: { name: true } },
      lapangan: { select: { nama: true } },
    },
  });

  if (!pesanan) return;

  const kode = pesanan.kode_booking || "—";
  const pemain = pesanan.user?.name || "Pemain";
  const lapangan = pesanan.lapangan?.nama || "Lapangan";

  await notifyAdmins({
    settingKey: "payment_notification",
    type: "admin_payment_success",
    title: "Pembayaran diterima",
    message: `${kode} — ${pemain} · ${lapangan}`,
    link: `/admin/transaksi?q=${encodeURIComponent(kode)}`,
    pesananId: pesanan.id,
  });
}

export async function notifyAdminsOwnerRegistration({ name, email, city }) {
  await notifyAdmins({
    settingKey: "owner_notification",
    type: "owner_register",
    title: "Pendaftaran owner baru",
    message: `${name} (${email}) · ${city}`,
    link: "/admin/owners?review=pending",
  });
}

export async function notifyAdminsBackup({ success, fileName }) {
  await notifyAdmins({
    settingKey: "backup_notification",
    type: success ? "backup_success" : "backup_failed",
    title: success ? "Backup selesai" : "Backup gagal",
    message: success
      ? `File ${fileName} berhasil dibuat.`
      : "Backup database gagal. Periksa log sistem.",
    link: "/admin/settings",
  });
}

function formatRupiahId(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

/** Admin: owner mengajukan setoran komisi tunai bulanan. */
export async function notifyAdminsOwnerSetoran(pengajuan, owner) {
  const bulanLabel = `${pengajuan.bulan}/${pengajuan.tahun}`;
  const ownerName = owner?.name || "Owner";

  await notifyAdmins({
    settingKey: "payment_notification",
    type: "admin_setoran_komisi",
    title: "Pengajuan setoran komisi tunai",
    message: `${ownerName} · ${bulanLabel} · ${formatRupiahId(pengajuan.total_komisi)}`,
    link: "/admin/transaksi?setoran=menunggu",
  });
}
