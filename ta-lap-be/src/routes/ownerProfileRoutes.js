import express from "express";

import {
  changeMyOwnerPassword,
  getMyOwnerProfile,
  updateMyOwnerProfile,
} from "../controllers/ownerProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("owner"));

router.get("/me", getMyOwnerProfile);
router.put("/me", updateMyOwnerProfile);
router.put("/password", changeMyOwnerPassword);

export default router;
