import express from "express";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";
import {
  getPushConfig,
  getPushStatus,
  subscribePush,
  unsubscribePush,
} from "../controllers/pushSubscriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/push/config", getPushConfig);

router.use(authMiddleware, roleMiddleware("user", "admin", "owner"));

router.get("/push/status", getPushStatus);
router.post("/push/subscribe", subscribePush);
router.delete("/push/unsubscribe", unsubscribePush);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadNotificationCount);
router.put("/read-all", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);

export default router;
