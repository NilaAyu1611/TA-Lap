import express from "express";
import {
  getAllLapangan,
  createLapangan
} from "../controllers/lapanganController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllLapangan);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  createLapangan
);

export default router;