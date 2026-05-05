import prisma from "../config/prisma.js";

// helper BigInt
const convertBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );


//  USER: lihat pembayaran miliknya
export const getMyPembayaran = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await prisma.pembayaran.findMany({
      where: {
        pesanan: {
          user_id: userId
        }
      },
      include: {
        pesanan: {
          include: {
            lapangan: true
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    });

    res.json({
      message: "Data pembayaran user",
      data: convertBigInt(data)
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// USER: buat pembayaran
export const createPembayaran = async (req, res) => {
  try {
    const userId = req.user.id;

    const { pesanan_id, metode, total_bayar } = req.body;

    // ambil pesanan
    const pesanan = await prisma.pesanan.findFirst({
      where: {
        id: BigInt(pesanan_id),
        user_id: userId
      }
    });

    if (!pesanan) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan"
      });
    }

    if (pesanan.status !== "pending") {
      return res.status(400).json({
        message: "Pesanan sudah dibayar / tidak valid"
      });
    }

    // cek sudah ada pembayaran belum
    const existing = await prisma.pembayaran.findUnique({
      where: {
        pesanan_id: BigInt(pesanan_id)
      }
    });

    if (existing) {
      return res.status(400).json({
        message: "Pesanan sudah memiliki pembayaran"
      });
    }

    // simpan pembayaran
    const pembayaran = await prisma.pembayaran.create({
      data: {
        pesanan_id: BigInt(pesanan_id),
        metode,
        total_bayar: Number(total_bayar),
        status: "menunggu",
        tanggal_bayar: new Date()
      }
    });

    // update status pesanan → dibayar
    await prisma.pesanan.update({
      where: { id: BigInt(pesanan_id) },
      data: {
        status: "dibayar"
      }
    });

    res.status(201).json({
      message: "Pembayaran berhasil",
      data: convertBigInt(pembayaran)
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal pembayaran",
      error: error.message
    });
  }
};


// ADMIN / OWNER: lihat semua pembayaran
export const getAllPembayaran = async (req, res) => {
  try {
    const data = await prisma.pembayaran.findMany({
      include: {
        pesanan: {
          include: {
            user: true,
            lapangan: true
          }
        }
      }
    });

    res.json({
      message: "Semua pembayaran",
      data: convertBigInt(data)
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// ADMIN / OWNER: update status pembayaran
export const updateStatusPembayaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.pembayaran.update({
      where: { id: BigInt(id) },
      data: { status }
    });

    res.json({
      message: "Status pembayaran diupdate",
      data: convertBigInt(updated)
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};