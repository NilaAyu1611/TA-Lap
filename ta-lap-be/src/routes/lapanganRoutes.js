import express from "express";
import {
  createLapangan,
  deleteLapangan,
  getAllLapangan,
  getLapanganAvailability,
  getLapanganById,
  getPublicLapanganPreview,
  reversePlace,
  searchPlaces,
  updateLapangan,
} from "../controllers/lapanganController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/public", getPublicLapanganPreview);
router.get("/places/search", searchPlaces);
router.get("/places/reverse", reversePlace);
router.get("/", authMiddleware, getAllLapangan);
router.get("/:id/availability", authMiddleware, getLapanganAvailability);
router.get("/:id", authMiddleware, getLapanganById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  createLapangan
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  updateLapangan
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  deleteLapangan
);

export default router;
