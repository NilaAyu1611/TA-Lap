import express from "express";
import {
  getMyPembayaran,
  createPembayaran,
  createSnapPayment,
  createCashPayment,
  abortSnapPayment,
  markGatewayAwaiting,
  getPaymentConfig,
  syncPaymentStatus,
  handleMidtransWebhook,
  getAllPembayaran,
  updateStatusPembayaran,
  upsertPembayaranByPesanan,
} from "../controllers/pembayaranController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/config", getPaymentConfig);
router.post("/webhook/midtrans", handleMidtransWebhook);

// USER
router.get("/me", authMiddleware, getMyPembayaran);
router.post("/snap", authMiddleware, createSnapPayment);
router.post("/cash", authMiddleware, createCashPayment);
router.post("/abort/:pesanan_id", authMiddleware, abortSnapPayment);
router.post("/awaiting/:pesanan_id", authMiddleware, markGatewayAwaiting);
router.post("/sync/:pesanan_id", authMiddleware, syncPaymentStatus);
router.post("/", authMiddleware, createPembayaran);

// ADMIN / OWNER
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getAllPembayaran
);

router.put(
  "/pesanan/:pesananId",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  upsertPembayaranByPesanan
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  updateStatusPembayaran
);

export default router;
