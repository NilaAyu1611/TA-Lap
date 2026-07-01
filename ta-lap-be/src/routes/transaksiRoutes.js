import express from "express";
import {
  getAllTransaksi,
  getMyTransaksi,
  getMyTransaksiById,
  getTransaksiById,
  updateTransaksi,
  markKomisiLunas,
  markPayoutDicairkan,
} from "../controllers/transaksiController.js";
import {
  getSetoranTunaiOverview,
  getSetoranTunaiDetail,
  getOwnerKewajibanSetoran,
  markSetoranTunaiDisetor,
  submitSetoranTunaiOwner,
  getSetoranPengajuan,
  approveSetoranPengajuanHandler,
  rejectSetoranPengajuanHandler,
} from "../controllers/setoranTunaiController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyTransaksi);
router.get("/me/:id", authMiddleware, getMyTransaksiById);

router.get(
  "/setoran-tunai",
  authMiddleware,
  roleMiddleware("admin"),
  getSetoranTunaiOverview
);

router.get(
  "/setoran-pengajuan",
  authMiddleware,
  roleMiddleware("admin"),
  getSetoranPengajuan
);

router.put(
  "/setoran-pengajuan/:id/setujui",
  authMiddleware,
  roleMiddleware("admin"),
  approveSetoranPengajuanHandler
);

router.put(
  "/setoran-pengajuan/:id/tolak",
  authMiddleware,
  roleMiddleware("admin"),
  rejectSetoranPengajuanHandler
);

router.post(
  "/setoran-tunai/:tahun/:bulan/ajukan",
  authMiddleware,
  roleMiddleware("owner"),
  submitSetoranTunaiOwner
);

router.get(
  "/kewajiban-setoran-tunai",
  authMiddleware,
  roleMiddleware("owner"),
  getOwnerKewajibanSetoran
);

router.get(
  "/setoran-tunai/:tahun/:bulan",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getSetoranTunaiDetail
);

router.post(
  "/setoran-tunai/:tahun/:bulan/disetor",
  authMiddleware,
  roleMiddleware("admin"),
  markSetoranTunaiDisetor
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getAllTransaksi
);

router.put(
  "/:id/komisi-lunas",
  authMiddleware,
  roleMiddleware("admin"),
  markKomisiLunas
);

router.put(
  "/:id/payout",
  authMiddleware,
  roleMiddleware("admin"),
  markPayoutDicairkan
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getTransaksiById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  updateTransaksi
);

export default router;
