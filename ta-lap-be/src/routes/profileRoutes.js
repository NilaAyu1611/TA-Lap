import express from "express";

import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("user"));

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.put("/password", changeMyPassword);

export default router;
