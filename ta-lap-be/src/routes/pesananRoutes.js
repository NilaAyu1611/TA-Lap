import express from "express";
import {
  getMyPesanan,
  createPesanan,
  getAllPesanan,
  updateStatusPesanan
} from "../controllers/pesananController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// USER
router.get("/me", authMiddleware, getMyPesanan);
router.post("/", authMiddleware, createPesanan);

// ADMIN & OWNER
router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getAllPesanan);
router.put("/:id/status", authMiddleware, roleMiddleware("admin", "owner"), updateStatusPesanan);

export default router;