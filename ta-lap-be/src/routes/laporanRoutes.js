import express from "express";
import {
  createPengeluaran,
  deletePengeluaran,
  getLaporanKeuangan,
  getLaporanTransaksi,
  getPendapatanBulanan,
} from "../controllers/laporanController.js";
import {
  getLaporanOwnerKeuangan,
  getLaporanOwnerTransaksi,
} from "../controllers/ownerLaporanController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/keuangan",
  authMiddleware,
  roleMiddleware("admin"),
  getLaporanKeuangan
);

router.get(
  "/transaksi",
  authMiddleware,
  roleMiddleware("admin"),
  getLaporanTransaksi
);

router.get(
  "/owner/keuangan",
  authMiddleware,
  roleMiddleware("owner"),
  getLaporanOwnerKeuangan
);

router.get(
  "/owner/transaksi",
  authMiddleware,
  roleMiddleware("owner"),
  getLaporanOwnerTransaksi
);

router.get(
  "/pendapatan",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getPendapatanBulanan
);

router.post(
  "/pengeluaran",
  authMiddleware,
  roleMiddleware("admin"),
  createPengeluaran
);

router.delete(
  "/pengeluaran/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deletePengeluaran
);

export default router;
