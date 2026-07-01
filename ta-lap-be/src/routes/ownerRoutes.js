import express from "express";

import {
  approveOwner,
  createOwner,
  deleteOwner,
  getAllOwners,
  getOwnerById,
  rejectOwner,
  updateOwner,
} from "../controllers/owners/ownerController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getAllOwners);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getOwnerById);
router.post("/", authMiddleware, roleMiddleware("admin"), createOwner);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateOwner);
router.post("/:id/approve", authMiddleware, roleMiddleware("admin"), approveOwner);
router.post("/:id/reject", authMiddleware, roleMiddleware("admin"), rejectOwner);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteOwner);

export default router;
