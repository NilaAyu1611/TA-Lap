// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // GET semua lapangan
// export const getAllLapangan = async (req, res) => {
//   try {
//     const data = await prisma.lapangan.findMany({
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true
//           }
//         }
//       }
//     });

//     res.json({
//       message: "Data lapangan berhasil diambil",
//       data
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Terjadi error",
//       error: error.message
//     });
//   }
// };

// // CREATE lapangan
// export const createLapangan = async (req, res) => {
//   try {
//     const { nama, jenis, harga } = req.body;

//     // ambil user dari middleware auth
//     const userId = req.user.id;

//     const lapangan = await prisma.lapangan.create({
//       data: {
//         nama,
//         jenis,
//         harga: Number(harga),
//         owner_id: userId
//       }
//     });

//     res.status(201).json({
//       message: "Lapangan berhasil dibuat",
//       data: lapangan
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Gagal membuat lapangan",
//       error: error.message
//     });
//   }
// };


import prisma from "../config/prisma.js";

// helper BigInt
const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

// ✅ GET LAPANGAN (beda behavior berdasarkan role)
export const getAllLapangan = async (req, res) => {
  try {
    const user = req.user; // dari authMiddleware

    let whereClause = {};

    // logic role
    if (user.role === "owner") {
      whereClause.owner_id = BigInt(user.id);
    }

    if (user.role === "user") {
      whereClause.status = true;
    }

    const data = await prisma.lapangan.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: "Data lapangan berhasil diambil",
      data: serialize(data),
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

// ✅ CREATE LAPANGAN (owner & admin)
export const createLapangan = async (req, res) => {
  try {
    const { nama, jenis, harga, status, gambar } = req.body;

    const userId = BigInt(req.user.id);

    const lapangan = await prisma.lapangan.create({
      data: {
        nama,
        jenis,
        harga: Number(harga),
        status: status ?? true,
        gambar: gambar || null,
        owner_id: userId,
      },
    });

    res.status(201).json({
      message: "Lapangan berhasil dibuat",
      data: serialize(lapangan),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat lapangan",
      error: error.message,
    });
  }
};

// ✅ UPDATE LAPANGAN
export const updateLapangan = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(id) },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    // owner hanya boleh edit miliknya
    if (
      user.role === "owner" &&
      lapangan.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const updated = await prisma.lapangan.update({
      where: { id: BigInt(id) },
      data: req.body,
    });

    res.json({
      message: "Lapangan berhasil diupdate",
      data: serialize(updated),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update",
      error: error.message,
    });
  }
};

// ✅ DELETE LAPANGAN
export const deleteLapangan = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(id) },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      lapangan.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    await prisma.lapangan.delete({
      where: { id: BigInt(id) },
    });

    res.json({
      message: "Lapangan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal delete",
      error: error.message,
    });
  }
};