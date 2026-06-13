import prisma from "../config/prisma.js";

const convertBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

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

export const getMyPesanan = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);

    const pesanans = await prisma.pesanan.findMany({
      where: { user_id: userId },
      include: {
        lapangan: {
          include: {
            jenis: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
        pembayaran: true,
      },
      orderBy: { tanggal_booking: "desc" },
    });

    res.json({
      message: "Pesanan berhasil diambil",
      data: convertBigInt(pesanans),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ambil pesanan",
      error: error.message,
    });
  }
};

export const createPesanan = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { lapangan_id, tanggal_booking, jam_mulai, jam_selesai, catatan } = req.body;

    const jamMulai = new Date(jam_mulai);
    const jamSelesai = new Date(jam_selesai);
    const tanggal = new Date(tanggal_booking);

    if (jamMulai >= jamSelesai) {
      return res.status(400).json({
        message: "Jam selesai harus lebih besar dari jam mulai",
      });
    }

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(lapangan_id) },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    const conflict = await prisma.pesanan.findFirst({
      where: {
        lapangan_id: BigInt(lapangan_id),
        tanggal_booking: tanggal,
        status: { not: "dibatalkan" },
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
      },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Waktu booking bentrok dengan pesanan lain",
      });
    }

    const totalHarga = calcTotalHarga(lapangan.harga, jamMulai, jamSelesai);

    const pesanan = await prisma.pesanan.create({
      data: {
        kode_booking: generateKodeBooking(),
        user_id: userId,
        lapangan_id: BigInt(lapangan_id),
        tanggal_booking: tanggal,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        catatan: catatan || null,
        total_harga: totalHarga,
        status: "pending",
      },
      include: {
        lapangan: {
          include: {
            jenis: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: convertBigInt(pesanan),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat pesanan",
      error: error.message,
    });
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
      include: {
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
      },
      orderBy: { created_at: "desc" },
    });

    res.json({
      message: "Semua pesanan",
      data: convertBigInt(data),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStatusPesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.pesanan.update({
      where: { id: BigInt(id) },
      data: { status },
      include: {
        lapangan: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({
      message: "Status berhasil diupdate",
      data: convertBigInt(updated),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
