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




import { buildAdminDashboard } from "../../services/dashboard/adminDashboardService.js";
import { buildOwnerDashboard } from "../../services/dashboard/ownerDashboardService.js";
import { buildUserDashboard } from "../../services/dashboard/userDashboardService.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value
    )
  );


// ================= ADMIN =================

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await buildAdminDashboard();
    res.json(serialize(data));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// ================= OWNER =================

export const getOwnerDashboard = async (req, res) => {
  try {
    const data = await buildOwnerDashboard(req.user.id);
    res.json(serialize(data));
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
      const data = await buildUserDashboard(req.user.id);
      res.json(serialize(data));
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };