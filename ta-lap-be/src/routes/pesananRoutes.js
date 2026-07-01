import express from "express";
import {
  cancelPesanan,
  createPesanan,
  deletePesanan,
  getAllPesanan,
  getKebijakanBatal,
  getMyPesanan,
  getPesananById,
  updatePesanan,
  updateStatusPesanan,
} from "../controllers/pesananController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyPesanan);
router.get("/kebijakan-batal", authMiddleware, getKebijakanBatal);
router.post("/", authMiddleware, createPesanan);
router.post("/:id/batal", authMiddleware, cancelPesanan);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getAllPesanan
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getPesananById
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  updatePesanan
);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  updateStatusPesanan
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deletePesanan
);

export default router;
