import express from "express";
import {
  getMyPembayaran,
  createPembayaran,
  getAllPembayaran,
  updateStatusPembayaran
} from "../controllers/pembayaranController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// USER
router.get("/me", authMiddleware, getMyPembayaran);
router.post("/", authMiddleware, createPembayaran);

// ADMIN / OWNER
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getAllPembayaran
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  updateStatusPembayaran
);

export default router;