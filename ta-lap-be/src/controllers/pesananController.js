import prisma from "../config/prisma.js";
import { isMaintenanceMode } from "../utils/platformSettings.js";
import {
  buildPembayaranKomisiData,
  getKomisiPersen,
} from "../utils/komisi.js";
import {
  buildKebijakanBatal,
  processPesananCancellation,
} from "../utils/refund.js";
import { blocksSlotWhere } from "../utils/pesananStatus.js";
import {
  notifyBookingCreatedUnpaid,
  notifyUserWalkInBooking,
  processBookingPaymentReminders,
} from "../services/bookingPaymentReminderService.js";
import { notifyAdminsNewBooking } from "../services/adminNotificationService.js";
import { notifyOwnerNewBooking } from "../services/ownerNotificationService.js";
import { decodeMidtransMeta } from "../utils/midtransMeta.js";
import {
  fixPesananPaidMismatch,
  syncUserPendingGatewayPayments,
} from "../services/payment/gatewayPaymentSync.js";
import {
  findOrCreateWalkInUser,
  findCustomerByPhone,
  formatDisplayEmail,
} from "../services/walkInCustomerService.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const pesananInclude = {
  user: {
    select: { id: true, name: true, email: true, phone: true },
  },
  lapangan: {
    include: {
      jenis: true,
      owner: { select: { id: true, name: true, email: true } },
    },
  },
  pembayaran: true,
};

const generateKodeBooking = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `BK-${date}-${rand}`;
};

const calcTotalHarga = (hargaPerJam, jamMulai, jamSelesai) => {
  const hours = (jamSelesai - jamMulai) / (1000 * 60 * 60);
  return Number(hargaPerJam) * Math.max(hours, 1);
};

const formatPesanan = (pesanan) => {
  const pb = pesanan.pembayaran;
  let gateway_awaiting = false;
  if (pb?.status === "menunggu" && pb.metode !== "cash") {
    const meta = decodeMidtransMeta(pb.catatan_settlement);
    gateway_awaiting = meta?.gateway_status === "awaiting_settlement";
  }

  return {
  id: pesanan.id,
  kode_booking: pesanan.kode_booking,
  status: pesanan.status,
  total_harga: Number(pesanan.total_harga),
  tanggal_booking: pesanan.tanggal_booking,
  jam_mulai: pesanan.jam_mulai,
  jam_selesai: pesanan.jam_selesai,
  catatan: pesanan.catatan,
  created_at: pesanan.created_at,
  updated_at: pesanan.updated_at,
  user_id: pesanan.user_id,
  user_name: pesanan.user?.name ?? null,
  user_email: formatDisplayEmail(pesanan.user?.email),
  user_phone: pesanan.user?.phone ?? null,
  lapangan_id: pesanan.lapangan_id,
  lapangan_nama: pesanan.lapangan?.nama ?? null,
  lapangan_jenis: pesanan.lapangan?.jenis?.nama ?? null,
  owner_id: pesanan.lapangan?.owner?.id ?? null,
  owner_name: pesanan.lapangan?.owner?.name ?? null,
  pembayaran: pb
    ? {
        id: pb.id,
        metode: pb.metode,
        status: pb.status,
        total_bayar: pb.total_bayar,
        tanggal_bayar: pb.tanggal_bayar,
        komisi_persen: pb.komisi_persen,
        komisi_platform: pb.komisi_platform,
        pendapatan_owner: pb.pendapatan_owner,
        status_komisi: pb.status_komisi,
        status_payout_owner: pb.status_payout_owner,
        jumlah_refund: pb.jumlah_refund ?? 0,
        jumlah_potongan: pb.jumlah_potongan ?? 0,
        refund_reason: pb.refund_reason,
        gateway_awaiting,
        kode_transaksi: `TRX-${String(pb.id).padStart(6, "0")}`,
      }
    : null,
};
};

const VALID_METODE = ["transfer", "qris", "cash", "ewallet"];
const VALID_PEMBAYARAN_STATUS = ["menunggu", "sukses", "gagal", "refund"];

const syncPembayaran = async (
  pesananId,
  totalHarga,
  pembayaranInput,
  tx = prisma
) => {
  if (!pembayaranInput?.metode) return null;

  if (!VALID_METODE.includes(pembayaranInput.metode)) {
    throw new Error("Metode pembayaran tidak valid");
  }

  const payStatus = pembayaranInput.status || "sukses";
  if (!VALID_PEMBAYARAN_STATUS.includes(payStatus)) {
    throw new Error("Status pembayaran tidak valid");
  }

  const amount = Number(pembayaranInput.total_bayar ?? totalHarga);
  const persen = await getKomisiPersen();
  const komisiData = buildPembayaranKomisiData(
    amount,
    pembayaranInput.metode,
    payStatus,
    persen
  );

  const data = {
    metode: pembayaranInput.metode,
    total_bayar: amount,
    bukti_pembayaran: amount,
    status: payStatus,
    tanggal_bayar: payStatus === "sukses" ? new Date() : null,
    ...komisiData,
  };

  const existing = await tx.pembayaran.findUnique({
    where: { pesanan_id: BigInt(pesananId) },
  });

  if (existing) {
    return tx.pembayaran.update({
      where: { id: existing.id },
      data,
    });
  }

  return tx.pembayaran.create({
    data: {
      pesanan_id: BigInt(pesananId),
      ...data,
    },
  });
};

const checkBookingConflict = async (
  lapanganId,
  tanggal,
  jamMulai,
  jamSelesai,
  excludeId = null
) => {
  const where = blocksSlotWhere({
    lapangan_id: BigInt(lapanganId),
    tanggal_booking: tanggal,
    OR: [
      { jam_mulai: { gte: jamMulai, lt: jamSelesai } },
      { jam_selesai: { gt: jamMulai, lte: jamSelesai } },
      {
        AND: [
          { jam_mulai: { lte: jamMulai } },
          { jam_selesai: { gte: jamSelesai } },
        ],
      },
    ],
  });

  if (excludeId) {
    where.id = { not: BigInt(excludeId) };
  }

  return prisma.pesanan.findFirst({ where });
};

export const getMyPesanan = async (req, res) => {
  try {
    await processBookingPaymentReminders();

    const userId = req.user.id;
    try {
      await syncUserPendingGatewayPayments(userId);
      await fixPesananPaidMismatch(userId);
    } catch (syncError) {
      console.warn("[getMyPesanan] sync skip:", syncError.message);
    }

    const pesanans = await prisma.pesanan.findMany({
      where: { user_id: BigInt(userId) },
      include: pesananInclude,
      orderBy: { tanggal_booking: "desc" },
    });

    res.json({
      message: "Pesanan berhasil diambil",
      data: serialize(pesanans.map(formatPesanan)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPesanan = async (req, res) => {
  try {
    const user = req.user;
    let whereClause = {};

    if (user.role === "owner") {
      whereClause = {
        lapangan: { owner_id: BigInt(user.id) },
      };
    }

    const data = await prisma.pesanan.findMany({
      where: whereClause,
      include: pesananInclude,
      orderBy: { created_at: "desc" },
    });

    const formatted = data.map(formatPesanan);

    const buildStats = async (statsWhere) => {
      const [total, pending, dibayar, selesai, dibatalkan, revenueRows] =
        await Promise.all([
          prisma.pesanan.count({ where: statsWhere }),
          prisma.pesanan.count({
            where: { ...statsWhere, status: "pending" },
          }),
          prisma.pesanan.count({
            where: { ...statsWhere, status: "dibayar" },
          }),
          prisma.pesanan.count({
            where: { ...statsWhere, status: "selesai" },
          }),
          prisma.pesanan.count({
            where: { ...statsWhere, status: "dibatalkan" },
          }),
          prisma.pesanan.aggregate({
            where: {
              ...statsWhere,
              status: { in: ["dibayar", "selesai"] },
            },
            _sum: { total_harga: true },
          }),
        ]);

      return {
        total,
        pending,
        dibayar,
        selesai,
        dibatalkan,
        totalRevenue: Number(revenueRows._sum.total_harga || 0),
      };
    };

    if (user.role === "admin") {
      const stats = await buildStats({});

      return res.json(
        serialize({
          stats,
          data: formatted,
        })
      );
    }

    if (user.role === "owner") {
      const stats = await buildStats(whereClause);

      return res.json(
        serialize({
          stats,
          data: formatted,
        })
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPesananById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const pesanan = await prisma.pesanan.findUnique({
      where: { id: BigInt(id) },
      include: pesananInclude,
    });

    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      pesanan.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.json(serialize({ data: formatPesanan(pesanan) }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPesanan = async (req, res) => {
  try {
    if (req.user.role === "user" && (await isMaintenanceMode())) {
      return res.status(503).json({
        message:
          "Platform sedang maintenance. Booking sementara tidak tersedia.",
      });
    }

    const {
      lapangan_id,
      tanggal_booking,
      jam_mulai,
      jam_selesai,
      catatan,
      user_id,
      status,
      pembayaran,
      walk_in_customer,
    } = req.body;

    const jamMulai = new Date(jam_mulai);
    const jamSelesai = new Date(jam_selesai);
    const tanggal = new Date(tanggal_booking);

    if (jamMulai >= jamSelesai) {
      return res.status(400).json({
        message: "Jam selesai harus lebih besar dari jam mulai",
      });
    }

    let userId = BigInt(req.user.id);

    if (req.user.role === "admin") {
      if (!user_id) {
        return res.status(400).json({
          message: "User wajib dipilih saat admin membuat pesanan",
        });
      }
      const targetUser = await prisma.user.findFirst({
        where: { id: BigInt(user_id), role: "user" },
      });
      if (!targetUser) {
        return res.status(400).json({ message: "User tidak ditemukan" });
      }
      userId = BigInt(user_id);
    }

    if (req.user.role === "owner") {
      if (walk_in_customer?.phone) {
        try {
          const customer = await findOrCreateWalkInUser({
            name: walk_in_customer.name,
            phone: walk_in_customer.phone,
            email: walk_in_customer.email,
          });
          userId = customer.id;
        } catch (err) {
          return res.status(400).json({ message: err.message });
        }
      } else if (user_id) {
        const targetUser = await prisma.user.findFirst({
          where: {
            id: BigInt(user_id),
            role: "user",
            status: "active",
          },
        });
        if (!targetUser) {
          return res.status(400).json({
            message: "Pelanggan tidak ditemukan atau akun tidak aktif",
          });
        }
        userId = BigInt(user_id);
      } else {
        return res.status(400).json({
          message:
            "Data pelanggan wajib diisi — nomor telepon minimal harus ada",
        });
      }
    }

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(lapangan_id) },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    if (
      req.user.role === "owner" &&
      lapangan.owner_id !== BigInt(req.user.id)
    ) {
      return res.status(403).json({
        message: "Anda hanya dapat booking lapangan milik Anda",
      });
    }

    const conflict = await checkBookingConflict(
      lapangan_id,
      tanggal,
      jamMulai,
      jamSelesai
    );

    if (conflict) {
      return res.status(400).json({
        message: "Waktu booking bentrok dengan pesanan lain pada jam tersebut",
      });
    }

    const totalHarga = calcTotalHarga(lapangan.harga, jamMulai, jamSelesai);
    const pesananStatus = status || "pending";

    if (
      ["admin", "owner"].includes(req.user.role) &&
      ["dibayar", "selesai"].includes(pesananStatus) &&
      !pembayaran?.metode
    ) {
      return res.status(400).json({
        message:
          "Metode pembayaran wajib dipilih untuk pesanan berstatus dibayar/selesai",
      });
    }

    const pesanan = await prisma.$transaction(async (tx) => {
      const created = await tx.pesanan.create({
        data: {
          kode_booking: generateKodeBooking(),
          user_id: userId,
          lapangan_id: BigInt(lapangan_id),
          tanggal_booking: tanggal,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
          catatan: catatan || null,
          total_harga: totalHarga,
          status: pesananStatus,
        },
      });

      if (
        ["admin", "owner"].includes(req.user.role) &&
        pembayaran?.metode
      ) {
        await syncPembayaran(created.id, totalHarga, pembayaran, tx);
      }

      return tx.pesanan.findUnique({
        where: { id: created.id },
        include: pesananInclude,
      });
    });

    if (req.user.role === "owner") {
      await notifyUserWalkInBooking(pesanan);
    } else if (pesanan.status === "pending") {
      await notifyBookingCreatedUnpaid(pesanan);
      await notifyAdminsNewBooking(pesanan);
      await notifyOwnerNewBooking(pesanan);
    }

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: serialize(formatPesanan(pesanan)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const {
      lapangan_id,
      tanggal_booking,
      jam_mulai,
      jam_selesai,
      catatan,
      status,
      user_id,
      pembayaran,
    } = req.body;

    const existing = await prisma.pesanan.findUnique({
      where: { id: BigInt(id) },
      include: { lapangan: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      existing.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const updateData = {};

    if (catatan !== undefined) updateData.catatan = catatan || null;
    if (status !== undefined) updateData.status = status;

    const nextStatus = status ?? existing.status;
    if (
      ["admin", "owner"].includes(user.role) &&
      ["dibayar", "selesai"].includes(nextStatus) &&
      pembayaran?.metode === undefined
    ) {
      const hasPayment = await prisma.pembayaran.findUnique({
        where: { pesanan_id: BigInt(id) },
      });
      if (!hasPayment) {
        return res.status(400).json({
          message:
            "Metode pembayaran wajib dipilih untuk pesanan berstatus dibayar/selesai",
        });
      }
    }

    if (
      (user.role === "admin" || user.role === "owner") &&
      pembayaran !== undefined
    ) {
      if (pembayaran?.metode) {
        await syncPembayaran(
          id,
          Number(existing.total_harga),
          pembayaran
        );
      }
    }

    if (user.role === "admin" && user_id !== undefined) {
      const targetUser = await prisma.user.findFirst({
        where: { id: BigInt(user_id), role: "user" },
      });
      if (!targetUser) {
        return res.status(400).json({ message: "User tidak ditemukan" });
      }
      updateData.user_id = BigInt(user_id);
    }

    if (user.role === "owner" && user_id !== undefined) {
      return res.status(403).json({
        message: "Owner tidak dapat mengubah pelanggan pesanan",
      });
    }

    const nextLapanganId = lapangan_id ?? existing.lapangan_id.toString();
    const nextTanggal = tanggal_booking
      ? new Date(tanggal_booking)
      : existing.tanggal_booking;
    const nextJamMulai = jam_mulai
      ? new Date(jam_mulai)
      : existing.jam_mulai;
    const nextJamSelesai = jam_selesai
      ? new Date(jam_selesai)
      : existing.jam_selesai;

    if (nextJamMulai >= nextJamSelesai) {
      return res.status(400).json({
        message: "Jam selesai harus lebih besar dari jam mulai",
      });
    }

    if (lapangan_id || tanggal_booking || jam_mulai || jam_selesai) {
      const conflict = await checkBookingConflict(
        nextLapanganId,
        nextTanggal,
        nextJamMulai,
        nextJamSelesai,
        id
      );
      if (conflict) {
        return res.status(400).json({
          message: "Waktu booking bentrok dengan pesanan lain pada jam tersebut",
        });
      }

      const lapangan = await prisma.lapangan.findUnique({
        where: { id: BigInt(nextLapanganId) },
      });
      if (!lapangan) {
        return res.status(404).json({ message: "Lapangan tidak ditemukan" });
      }

      if (
        user.role === "owner" &&
        lapangan.owner_id !== BigInt(user.id)
      ) {
        return res.status(403).json({
          message: "Anda hanya dapat menggunakan lapangan milik Anda",
        });
      }

      updateData.lapangan_id = BigInt(nextLapanganId);
      updateData.tanggal_booking = nextTanggal;
      updateData.jam_mulai = nextJamMulai;
      updateData.jam_selesai = nextJamSelesai;
      updateData.total_harga = calcTotalHarga(
        lapangan.harga,
        nextJamMulai,
        nextJamSelesai
      );
    }

    const updated = await prisma.pesanan.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: pesananInclude,
    });

    if (updateData.total_harga !== undefined) {
      const pembayaranRecord = await prisma.pembayaran.findUnique({
        where: { pesanan_id: BigInt(id) },
      });
      if (pembayaranRecord) {
        await syncPembayaran(id, updateData.total_harga, {
          metode: pembayaranRecord.metode,
          status: pembayaranRecord.status,
          total_bayar: updateData.total_harga,
        });
      }
    }

    const finalPesanan = updateData.total_harga
      ? await prisma.pesanan.findUnique({
          where: { id: BigInt(id) },
          include: pesananInclude,
        })
      : updated;

    res.json({
      message: "Pesanan berhasil diperbarui",
      data: serialize(formatPesanan(finalPesanan)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getKebijakanBatal = async (req, res) => {
  try {
    const data = await buildKebijakanBatal();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelPesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { alasan } = req.body;
    const user = req.user;

    const existing = await prisma.pesanan.findUnique({
      where: { id: BigInt(id) },
      include: {
        lapangan: true,
        pembayaran: true,
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (user.role === "user" && existing.user_id !== BigInt(user.id)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    if (
      user.role === "owner" &&
      existing.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const result = await prisma.$transaction(async (tx) =>
      processPesananCancellation(existing, {
        alasan,
        actorRole: user.role,
      }, tx)
    );

    const message = result.refundInfo
      ? `Pesanan dibatalkan. Refund ${result.refundInfo.refund_persen}% (Rp ${result.refundInfo.jumlah_refund.toLocaleString("id-ID")}) — potongan ${result.refundInfo.potongan_persen}%`
      : "Pesanan berhasil dibatalkan";

    res.json({
      message,
      data: serialize(formatPesanan(result.pesanan)),
      refund: result.refundInfo,
    });
  } catch (error) {
    const status = error.message.includes("tidak dapat") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const updateStatusPesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, alasan } = req.body;
    const user = req.user;

    const existing = await prisma.pesanan.findUnique({
      where: { id: BigInt(id) },
      include: { lapangan: true, pembayaran: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      existing.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    if (status === "dibatalkan") {
      const result = await prisma.$transaction(async (tx) =>
        processPesananCancellation(existing, {
          alasan,
          actorRole: user.role,
        }, tx)
      );

      return res.json({
        message: "Pesanan dibatalkan dengan kebijakan refund",
        data: serialize(formatPesanan(result.pesanan)),
        refund: result.refundInfo,
      });
    }

    const updated = await prisma.pesanan.update({
      where: { id: BigInt(id) },
      data: { status },
      include: pesananInclude,
    });

    res.json({
      message: "Status berhasil diupdate",
      data: serialize(formatPesanan(updated)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const pesananId = BigInt(id);

    const existing = await prisma.pesanan.findUnique({
      where: { id: pesananId },
      include: { lapangan: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      existing.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.pembayaran.deleteMany({ where: { pesanan_id: pesananId } });
      await tx.pesanan.delete({ where: { id: pesananId } });
    });

    res.json({ message: "Pesanan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
