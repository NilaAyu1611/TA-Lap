import prisma from "../config/prisma.js";
import { formatTransaksi, transaksiInclude } from "../utils/formatTransaksi.js";
import { buildKomisiUpdateForPembayaran } from "../utils/komisi.js";
import { payoutMenungguWhere } from "../utils/payout.js";
import {
  fixPesananPaidMismatch,
  syncUserPendingGatewayPayments,
} from "../services/payment/gatewayPaymentSync.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export const getAllTransaksi = async (req, res) => {
  try {
    const user = req.user;
    let whereClause = {};

    if (user.role === "owner") {
      whereClause = {
        pesanan: {
          lapangan: { owner_id: BigInt(user.id) },
        },
      };
    }

    const data = await prisma.pembayaran.findMany({
      where: whereClause,
      include: transaksiInclude,
      orderBy: { created_at: "desc" },
    });

    const formatted = data.map(formatTransaksi);

    if (user.role === "admin") {
      const successWhere = { status: "sukses" };
      const [
        total,
        sukses,
        menunggu,
        gagal,
        komisiBelumLunas,
        payoutMenunggu,
        revenueRows,
        komisiRows,
        komisiTerkumpulAgg,
        komisiPiutangAgg,
      ] = await Promise.all([
        prisma.pembayaran.count(),
        prisma.pembayaran.count({ where: { status: "sukses" } }),
        prisma.pembayaran.count({ where: { status: "menunggu" } }),
        prisma.pembayaran.count({
          where: { status: { in: ["gagal", "refund"] } },
        }),
        prisma.pembayaran.count({
          where: { status_komisi: "belum_lunas", status: "sukses" },
        }),
        prisma.pembayaran.count({
          where: payoutMenungguWhere(),
        }),
        prisma.pembayaran.aggregate({
          where: successWhere,
          _sum: { total_bayar: true },
        }),
        prisma.pembayaran.aggregate({
          where: successWhere,
          _sum: { komisi_platform: true },
        }),
        prisma.pembayaran.aggregate({
          where: {
            ...successWhere,
            status_komisi: { in: ["terpotong", "lunas"] },
          },
          _sum: { komisi_platform: true },
        }),
        prisma.pembayaran.aggregate({
          where: {
            ...successWhere,
            status_komisi: "belum_lunas",
          },
          _sum: { komisi_platform: true },
        }),
      ]);

      return res.json(
        serialize({
          stats: {
            total,
            sukses,
            menunggu,
            gagal,
            komisiBelumLunas,
            payoutMenunggu,
            totalVolume: Number(revenueRows._sum.total_bayar || 0),
            totalKomisi: Number(komisiRows._sum.komisi_platform || 0),
            pendapatanAdmin: Number(
              komisiTerkumpulAgg._sum.komisi_platform || 0
            ),
            piutangKomisi: Number(komisiPiutangAgg._sum.komisi_platform || 0),
          },
          data: formatted,
        })
      );
    }

    if (user.role === "owner") {
      const stats = await buildOwnerStats(whereClause);

      return res.json(
        serialize({
          stats,
          data: formatted,
        })
      );
    }

    res.json({
      message: "Data transaksi",
      data: serialize(formatted),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buildOwnerStats = async (ownerWhere) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const successWhere = { ...ownerWhere, status: "sukses" };

  const [
    total,
    sukses,
    menunggu,
    gagal,
    hariIni,
    pendapatanAgg,
    komisiBelumSetorCount,
    komisiBelumSetorAgg,
    payoutMenunggu,
    dicairkanAgg,
  ] = await Promise.all([
    prisma.pembayaran.count({ where: ownerWhere }),
    prisma.pembayaran.count({ where: successWhere }),
    prisma.pembayaran.count({ where: { ...ownerWhere, status: "menunggu" } }),
    prisma.pembayaran.count({
      where: { ...ownerWhere, status: { in: ["gagal", "refund"] } },
    }),
    prisma.pembayaran.count({
      where: {
        ...ownerWhere,
        created_at: { gte: today, lt: tomorrow },
      },
    }),
    prisma.pembayaran.aggregate({
      where: successWhere,
      _sum: { pendapatan_owner: true, total_bayar: true },
    }),
    prisma.pembayaran.count({
      where: { ...successWhere, status_komisi: "belum_lunas" },
    }),
    prisma.pembayaran.aggregate({
      where: { ...successWhere, status_komisi: "belum_lunas" },
      _sum: { komisi_platform: true },
    }),
    prisma.pembayaran.count({
      where: { ...payoutMenungguWhere(), ...ownerWhere },
    }),
    prisma.pembayaran.aggregate({
      where: { ...successWhere, status_payout_owner: "dicairkan" },
      _sum: { pendapatan_owner: true },
    }),
  ]);

  const totalKomisiHarusSetor = Number(
    komisiBelumSetorAgg._sum.komisi_platform || 0
  );

  return {
    total,
    sukses,
    menunggu,
    gagal,
    hariIni,
    totalVolume: Number(pendapatanAgg._sum.total_bayar || 0),
    totalPendapatan: Number(pendapatanAgg._sum.pendapatan_owner || 0),
    pendapatanDicairkan: Number(dicairkanAgg._sum.pendapatan_owner || 0),
    komisiBelumSetor: komisiBelumSetorCount,
    totalKomisiHarusSetor,
    payoutMenunggu,
    komisiBelumLunas: komisiBelumSetorCount,
    totalKomisi: totalKomisiHarusSetor,
    pendapatanAdmin: 0,
    piutangKomisi: totalKomisiHarusSetor,
  };
};

export const getMyTransaksi = async (req, res) => {
  try {
    const userId = req.user.id;
    try {
      await syncUserPendingGatewayPayments(userId);
      await fixPesananPaidMismatch(userId);
    } catch (syncError) {
      console.warn("[getMyTransaksi] sync skip:", syncError.message);
    }

    const data = await prisma.pembayaran.findMany({
      where: { pesanan: { user_id: BigInt(userId) } },
      include: transaksiInclude,
      orderBy: { created_at: "desc" },
    });

    const formatted = data.map(formatTransaksi);
    const sukses = formatted.filter((t) => t.status === "sukses").length;
    const menunggu = formatted.filter((t) => t.status === "menunggu").length;

    res.json(
      serialize({
        message: "Riwayat transaksi",
        data: formatted,
        stats: {
          total: formatted.length,
          sukses,
          menunggu,
          gagal: formatted.filter((t) => ["gagal", "refund"].includes(t.status))
            .length,
        },
      })
    );
  } catch (error) {
    console.error("[getMyTransaksi]", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMyTransaksiById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const item = await prisma.pembayaran.findFirst({
      where: {
        id: BigInt(id),
        pesanan: { user_id: BigInt(userId) },
      },
      include: transaksiInclude,
    });

    if (!item) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (item.status === "menunggu" && item.metode !== "cash") {
      await syncUserPendingGatewayPayments(userId);
      const refreshed = await prisma.pembayaran.findFirst({
        where: { id: BigInt(id), pesanan: { user_id: BigInt(userId) } },
        include: transaksiInclude,
      });
      if (refreshed) {
        return res.json(serialize({ data: formatTransaksi(refreshed) }));
      }
    }

    res.json(serialize({ data: formatTransaksi(item) }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransaksiById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const item = await prisma.pembayaran.findUnique({
      where: { id: BigInt(id) },
      include: transaksiInclude,
    });

    if (!item) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      item.pesanan?.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.json(serialize({ data: formatTransaksi(item) }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const {
      status,
      status_komisi,
      status_payout_owner,
      catatan_settlement,
    } = req.body;

    const existing = await prisma.pembayaran.findUnique({
      where: { id: BigInt(id) },
      include: {
        pesanan: { include: { lapangan: true } },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      existing.pesanan?.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    if (user.role === "owner") {
      if (
        status_komisi !== undefined ||
        status_payout_owner !== undefined ||
        catatan_settlement !== undefined
      ) {
        return res.status(403).json({
          message: "Owner hanya dapat memverifikasi status pembayaran",
        });
      }
      if (status === undefined) {
        return res.status(400).json({ message: "Status wajib diisi" });
      }
    }

    const updateData = {};
    const nextStatus = status ?? existing.status;
    const statusChanged =
      status !== undefined && status !== existing.status;

    if (status !== undefined) {
      updateData.status = status;
      // Hanya hitung ulang komisi/payout default saat status benar-benar berubah.
      // Jika tidak, setiap "Simpan" dengan status Sukses akan reset payout ke menunggu.
      if (statusChanged) {
        const komisiData = await buildKomisiUpdateForPembayaran(
          existing.total_bayar,
          existing.metode,
          nextStatus
        );
        Object.assign(updateData, komisiData);
      }
    }

    if (status_komisi !== undefined) updateData.status_komisi = status_komisi;
    if (status_payout_owner !== undefined) {
      updateData.status_payout_owner = status_payout_owner;
    }
    if (catatan_settlement !== undefined) {
      updateData.catatan_settlement = catatan_settlement || null;
    }

    if (nextStatus === "sukses" && !existing.tanggal_bayar) {
      updateData.tanggal_bayar = new Date();
    }

    const updated = await prisma.pembayaran.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: transaksiInclude,
    });

    if (status === "sukses" && existing.pesanan?.status === "pending") {
      await prisma.pesanan.update({
        where: { id: existing.pesanan_id },
        data: { status: "dibayar" },
      });
    }

    res.json({
      message: "Transaksi berhasil diperbarui",
      data: serialize(formatTransaksi(updated)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markKomisiLunas = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_settlement } = req.body;

    const existing = await prisma.pembayaran.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    const updated = await prisma.pembayaran.update({
      where: { id: BigInt(id) },
      data: {
        status_komisi: "lunas",
        catatan_settlement: catatan_settlement || existing.catatan_settlement,
      },
      include: transaksiInclude,
    });

    res.json({
      message: "Komisi owner ditandai lunas",
      data: serialize(formatTransaksi(updated)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markPayoutDicairkan = async (req, res) => {
  try {
    const { id } = req.params;
    const { catatan_settlement } = req.body;

    const existing = await prisma.pembayaran.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    const updated = await prisma.pembayaran.update({
      where: { id: BigInt(id) },
      data: {
        status_payout_owner: "dicairkan",
        catatan_settlement: catatan_settlement || existing.catatan_settlement,
      },
      include: transaksiInclude,
    });

    res.json({
      message: "Pendapatan owner ditandai dicairkan",
      data: serialize(formatTransaksi(updated)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
