import prisma from "../config/prisma.js";
import { saveBuktiSetoranBase64 } from "../utils/saveBuktiSetoran.js";
import { bankLabel } from "../utils/indonesianBanks.js";
import {
  aggregateMonthCashKomisi,
  formatMonthLabel,
  getMonthBounds,
} from "./cashKomisiSetoranService.js";
import { notifyAdminsOwnerSetoran } from "./adminNotificationService.js";
import {
  notifyOwnerSetoranApproved,
  notifyOwnerSetoranRejected,
} from "./ownerNotificationService.js";

const VALID_METODE = new Set(["transfer", "ewallet"]);

export async function getPlatformSetoranTujuan() {
  const settings = await prisma.setting.findFirst({ where: { id: 1 } });
  return {
    app_name: settings?.app_name || "TA-LAP",
    app_email: settings?.app_email || null,
    app_phone: settings?.app_phone || null,
    bank_code: settings?.platform_bank_code || null,
    bank_name: bankLabel(settings?.platform_bank_code),
    bank_account_number: settings?.platform_bank_account_number || null,
    bank_account_holder: settings?.platform_bank_account_holder || null,
    ewallet_note: settings?.platform_ewallet_note || null,
  };
}

function formatPengajuan(row, owner) {
  return {
    id: String(row.id),
    owner_id: String(row.owner_id),
    owner_name: owner?.name || "Owner",
    owner_email: owner?.email || null,
    owner_phone: owner?.phone || null,
    tahun: row.tahun,
    bulan: row.bulan,
    label: formatMonthLabel(row.tahun, row.bulan),
    total_komisi: row.total_komisi,
    jumlah_transaksi: row.jumlah_transaksi,
    metode: row.metode,
    bukti_pembayaran: row.bukti_pembayaran,
    catatan_owner: row.catatan_owner,
    tanggal_bayar: row.tanggal_bayar,
    status: row.status,
    catatan_admin: row.catatan_admin,
    reviewed_at: row.reviewed_at,
    created_at: row.created_at,
  };
}

async function markOwnerCashKomisiLunas(ownerId, year, month, note) {
  const { start, end } = getMonthBounds(year, month);
  await prisma.pembayaran.updateMany({
    where: {
      metode: "cash",
      status: "sukses",
      status_komisi: "belum_lunas",
      tanggal_bayar: { gte: start, lt: end },
      pesanan: { lapangan: { owner_id: BigInt(ownerId) } },
    },
    data: {
      status_komisi: "lunas",
      catatan_settlement: note,
    },
  });
}

export async function submitOwnerSetoran(ownerId, year, month, payload) {
  const { metode, tanggal_bayar, catatan_owner, bukti_base64 } = payload;

  if (!VALID_METODE.has(metode)) {
    throw new Error("Metode setoran harus transfer atau ewallet");
  }
  if (!tanggal_bayar) {
    throw new Error("Tanggal pembayaran wajib diisi");
  }
  if (!bukti_base64) {
    throw new Error("Upload bukti transfer wajib");
  }

  const agg = await aggregateMonthCashKomisi(year, month, ownerId);
  if (agg.komisi_belum_setor <= 0) {
    throw new Error("Tidak ada komisi tunai yang perlu disetor untuk bulan ini");
  }

  const existing = await prisma.setoranKomisiOwner.findUnique({
    where: {
      owner_id_tahun_bulan: {
        owner_id: BigInt(ownerId),
        tahun: year,
        bulan: month,
      },
    },
  });

  if (existing?.status === "menunggu_verifikasi") {
    throw new Error("Pengajuan bulan ini masih menunggu verifikasi admin");
  }
  if (existing?.status === "disetujui") {
    throw new Error("Setoran bulan ini sudah disetujui");
  }

  const buktiUrl = await saveBuktiSetoranBase64(bukti_base64, ownerId);
  const tanggalBayar = new Date(tanggal_bayar);

  const owner = await prisma.user.findUnique({
    where: { id: BigInt(ownerId) },
    select: { id: true, name: true, email: true },
  });

  let pengajuan;
  if (existing?.status === "ditolak") {
    pengajuan = await prisma.setoranKomisiOwner.update({
      where: { id: existing.id },
      data: {
        total_komisi: agg.komisi_belum_setor,
        jumlah_transaksi: agg.transaksi_belum_setor,
        metode,
        bukti_pembayaran: buktiUrl,
        catatan_owner: catatan_owner?.trim() || null,
        tanggal_bayar: tanggalBayar,
        status: "menunggu_verifikasi",
        catatan_admin: null,
        reviewed_by_id: null,
        reviewed_at: null,
      },
    });
  } else {
    pengajuan = await prisma.setoranKomisiOwner.create({
      data: {
        owner_id: BigInt(ownerId),
        tahun: year,
        bulan: month,
        total_komisi: agg.komisi_belum_setor,
        jumlah_transaksi: agg.transaksi_belum_setor,
        metode,
        bukti_pembayaran: buktiUrl,
        catatan_owner: catatan_owner?.trim() || null,
        tanggal_bayar: tanggalBayar,
        status: "menunggu_verifikasi",
      },
    });
  }

  await notifyAdminsOwnerSetoran(pengajuan, owner);

  return formatPengajuan(pengajuan, owner);
}

export async function listSetoranPengajuan({ status } = {}) {
  const where = status && status !== "all" ? { status } : {};

  const [rows, menungguCount] = await Promise.all([
    prisma.setoranKomisiOwner.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: [{ created_at: "desc" }],
    }),
    prisma.setoranKomisiOwner.count({
      where: { status: "menunggu_verifikasi" },
    }),
  ]);

  return {
    rows: rows.map((row) => formatPengajuan(row, row.owner)),
    menunggu: menungguCount,
  };
}

export async function approveSetoranPengajuan(adminId, pengajuanId, catatan_admin) {
  const row = await prisma.setoranKomisiOwner.findUnique({
    where: { id: BigInt(pengajuanId) },
    include: { owner: { select: { id: true, name: true } } },
  });

  if (!row) throw new Error("Pengajuan setoran tidak ditemukan");
  if (row.status !== "menunggu_verifikasi") {
    throw new Error("Pengajuan sudah diproses sebelumnya");
  }

  const note = catatan_admin?.trim()
    ? `Setoran ${formatMonthLabel(row.tahun, row.bulan)} disetujui: ${catatan_admin.trim()}`
    : `Setoran komisi tunai ${formatMonthLabel(row.tahun, row.bulan)} disetujui admin`;

  await markOwnerCashKomisiLunas(row.owner_id, row.tahun, row.bulan, note);

  const updated = await prisma.setoranKomisiOwner.update({
    where: { id: row.id },
    data: {
      status: "disetujui",
      catatan_admin: catatan_admin?.trim() || null,
      reviewed_by_id: BigInt(adminId),
      reviewed_at: new Date(),
    },
    include: { owner: { select: { id: true, name: true } } },
  });

  await notifyOwnerSetoranApproved(updated, updated.owner);

  return formatPengajuan(updated, updated.owner);
}

export async function rejectSetoranPengajuan(adminId, pengajuanId, catatan_admin) {
  const reason = catatan_admin?.trim();
  if (!reason) {
    throw new Error("Alasan penolakan wajib diisi");
  }

  const row = await prisma.setoranKomisiOwner.findUnique({
    where: { id: BigInt(pengajuanId) },
    include: { owner: { select: { id: true, name: true } } },
  });

  if (!row) throw new Error("Pengajuan setoran tidak ditemukan");
  if (row.status !== "menunggu_verifikasi") {
    throw new Error("Pengajuan sudah diproses sebelumnya");
  }

  const updated = await prisma.setoranKomisiOwner.update({
    where: { id: row.id },
    data: {
      status: "ditolak",
      catatan_admin: reason,
      reviewed_by_id: BigInt(adminId),
      reviewed_at: new Date(),
    },
    include: { owner: { select: { id: true, name: true } } },
  });

  await notifyOwnerSetoranRejected(updated, updated.owner, reason);

  return formatPengajuan(updated, updated.owner);
}

export async function attachPengajuanToOwnerMonths(ownerId, months) {
  if (months.length === 0) return [];

  const pengajuan = await prisma.setoranKomisiOwner.findMany({
    where: {
      owner_id: BigInt(ownerId),
      OR: months.map((m) => ({ tahun: m.tahun, bulan: m.bulan })),
    },
  });

  const map = new Map(
    pengajuan.map((p) => [`${p.tahun}-${p.bulan}`, p])
  );

  return months.map((month) => {
    const p = map.get(`${month.tahun}-${month.bulan}`);

    return {
      ...month,
      pengajuan_id: p ? String(p.id) : null,
      pengajuan_status: p?.status ?? null,
      pengajuan_metode: p?.metode ?? null,
      pengajuan_bukti: p?.bukti_pembayaran ?? null,
      catatan_admin: p?.catatan_admin ?? null,
      can_submit:
        month.komisi_belum_setor > 0 &&
        (!p || p.status === "ditolak"),
      is_pending: p?.status === "menunggu_verifikasi",
    };
  });
}
