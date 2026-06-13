import express from "express";

import {
  getAdminDashboard,
  getOwnerDashboard,
  getUserDashboard,
} from "../controllers/dashboard/dashboardController.js";

import {
  authMiddleware,
} from "../middlewares/authMiddleware.js";

import {
  roleMiddleware,
} from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminDashboard
);

router.get(
  "/owner",
  authMiddleware,
  roleMiddleware("owner"),
  getOwnerDashboard
);

router.get(
  "/user",
  authMiddleware,
  roleMiddleware("user"),
  getUserDashboard
);

export default router;