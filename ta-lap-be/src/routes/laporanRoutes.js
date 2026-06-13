import express from "express";
import { getPendapatanBulanan } from "../controllers/laporanController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/pendapatan",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  getPendapatanBulanan
);

export default router;
