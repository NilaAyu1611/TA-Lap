// export const getAdminDashboard = async (req, res) => {
//   try {
//     const totalUsers = await prisma.user.count({
//       where: {
//         role: "user"
//       }
//     });

//     const totalOwners = await prisma.user.count({
//       where: {
//         role: "owner"
//       }
//     });

//     const totalBooking = await prisma.pesanan.count();

//     const totalTransaksi = await prisma.pembayaran.aggregate({
//       _sum: {
//         total_bayar: true
//       }
//     });

//     res.json({
//       totalUsers,
//       totalOwners,
//       totalBooking,
//       totalPemasukan:
//         totalTransaksi._sum.total_bayar || 0
//     });

//   } catch (error) {
//     res.status(500).json({
//       error: error.message
//     });
//   }
// };

// import {
//   adminDashboardService
// } from "../../services/dashboard/dashboardService.js";

// export const getAdminDashboard = async (req, res) => {
//   try {
//     const data = await adminDashboardService();

//     res.json(data);

//   } catch (error) {
//     res.status(500).json({
//       error: error.message
//     });
//   }
// };




import prisma from "../../config/prisma.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value
    )
  );


// ================= ADMIN =================

export const getAdminDashboard =
  async (req, res) => {
    try {
      const totalUsers =
        await prisma.user.count({
          where: {
            role: "user",
          },
        });

      const totalOwners =
        await prisma.user.count({
          where: {
            role: "owner",
          },
        });

      const totalBooking =
        await prisma.pesanan.count();

      const totalLapangan =
        await prisma.lapangan.count();

      const pemasukan =
        await prisma.pembayaran.aggregate({
          _sum: {
            total_bayar: true,
          },
        });

      res.json({
        totalUsers,
        totalOwners,
        totalBooking,
        totalLapangan,
        totalPemasukan: Number(pemasukan._sum.total_bayar || 0),
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };


// ================= OWNER =================

export const getOwnerDashboard =
  async (req, res) => {
    try {
      const ownerId = BigInt(req.user.id);

      const totalLapangan =
        await prisma.lapangan.count({
          where: {
            owner_id: ownerId,
          },
        });

      const totalBooking =
        await prisma.pesanan.count({
          where: {
            lapangan: {
              owner_id: ownerId,
            },
          },
        });

      res.json({
        totalLapangan,
        totalBooking,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };


// ================= USER =================

export const getUserDashboard =
  async (req, res) => {
    try {
      const userId = BigInt(req.user.id);

      const totalPesanan =
        await prisma.pesanan.count({
          where: {
            user_id: userId,
          },
        });

      const totalPembayaran =
        await prisma.pembayaran.count({
          where: {
            pesanan: {
              user_id: userId,
            },
          },
        });

      res.json({
        totalPesanan,
        totalPembayaran,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };