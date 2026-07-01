import express from "express";
import {
  changeAdminPassword,
  createSystemBackup,
  getBackupLogs,
  getPublicSettings,
  getSettings,
  updateAdminProfile,
  updateSettings,
} from "../controllers/settingsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/public", getPublicSettings);
router.get("/", authMiddleware, roleMiddleware("admin"), getSettings);
router.put("/", authMiddleware, roleMiddleware("admin"), updateSettings);
router.put("/profile", authMiddleware, roleMiddleware("admin"), updateAdminProfile);
router.put("/password", authMiddleware, roleMiddleware("admin"), changeAdminPassword);
router.get("/backups", authMiddleware, roleMiddleware("admin"), getBackupLogs);
router.post("/backup", authMiddleware, roleMiddleware("admin"), createSystemBackup);

export default router;
