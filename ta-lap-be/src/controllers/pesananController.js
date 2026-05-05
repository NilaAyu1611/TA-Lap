import prisma from "../config/prisma.js";

const convertBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// GET pesanan milik user login
export const getMyPesanan = async (req, res) => {
  try {
    const userId = req.user.id;

    const pesanans = await prisma.pesanan.findMany({
      where: {
        user_id: userId
      },
      include: {
        lapangan: true
      },
      orderBy: {
        tanggal_booking: "desc"
      }
    });

    res.json({
      message: "Pesanan berhasil diambil",
      data: pesanans
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ambil pesanan",
      error: error.message
    });
  }
};

// CREATE pesanan (booking)
export const createPesanan = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);

    const { lapangan_id, tanggal_booking, jam_mulai, jam_selesai } = req.body;

    const jamMulai = new Date(jam_mulai);
    const jamSelesai = new Date(jam_selesai);
    const tanggal = new Date(tanggal_booking);

    if (jamMulai >= jamSelesai) {
      return res.status(400).json({
        message: "Jam selesai harus lebih besar dari jam mulai"
      });
    }

    const conflict = await prisma.pesanan.findFirst({
      where: {
        lapangan_id: Number(lapangan_id),
        tanggal_booking: tanggal,
        OR: [
          {
            jam_mulai: { gte: jamMulai, lt: jamSelesai }
          },
          {
            jam_selesai: { gt: jamMulai, lte: jamSelesai }
          },
          {
            AND: [
              { jam_mulai: { lte: jamMulai } },
              { jam_selesai: { gte: jamSelesai } }
            ]
          }
        ]
      }
    });

    if (conflict) {
      return res.status(400).json({
        message: "Waktu booking bentrok dengan pesanan lain"
      });
    }

    const pesanan = await prisma.pesanan.create({
      data: {
        user_id: userId,
        lapangan_id: Number(lapangan_id),
        tanggal_booking: tanggal,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        status: "pending"
      }
    });

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: convertBigInt(pesanan)
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat pesanan",
      error: error.message
    });
  }
};

// export const createPesanan = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const {
//       lapangan_id,
//       tanggal_booking,
//       jam_mulai,
//       jam_selesai
//     } = req.body;

//     
//     const conflict = await prisma.pesanan.findFirst({
//       where: {
//         lapangan_id: Number(lapangan_id),
//         tanggal_booking: new Date(tanggal_booking),
//         OR: [
//           {
//             jam_mulai: {
//               gte: jam_mulai,
//               lte: jam_selesai
//             }
//           },
//           {
//             jam_selesai: {
//               gte: jam_mulai,
//               lte: jam_selesai
//             }
//           },
//           {
//             AND: [
//               { jam_mulai: { lte: jam_mulai } },
//               { jam_selesai: { gte: jam_selesai } }
//             ]
//           }
//         ]
//       }
//     });

//     if (conflict) {
//       return res.status(400).json({
//         message: "Waktu booking bentrok dengan pesanan lain"
//       });
//     }

//     const pesanan = await prisma.pesanan.create({
//       data: {
//         user_id: userId,
//         lapangan_id: Number(lapangan_id),
//         tanggal_booking: new Date(tanggal_booking),
//         jam_mulai,
//         jam_selesai,
//         status: "pending"
//       }
//     });

//     // res.status(201).json({
//     //   message: "Pesanan berhasil dibuat",
//     //   data: pesanan
//     // });
//   } catch (error) {
//     res.status(500).json({
//       message: "Gagal membuat pesanan",
//       error: error.message
//     });
//   }
// };

// ADMIN / OWNER lihat semua pesanan
export const getAllPesanan = async (req, res) => {
  try {
    const data = await prisma.pesanan.findMany({
      include: {
        user: true,
        lapangan: true
      }
    });

    res.json({
      message: "Semua pesanan",
      data
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// UPDATE status (admin/owner)
export const updateStatusPesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.pesanan.update({
      where: { id: BigInt(id) },
      data: { status }
    });

    res.json({
      message: "Status berhasil diupdate",
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};