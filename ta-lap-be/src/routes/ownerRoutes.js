import express from "express";

import {
  getAllOwners,
  deleteOwner
} from "../controllers/owners/ownerController.js";

import {
  authMiddleware
} from "../middlewares/authMiddleware.js";

import {
  roleMiddleware
} from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOwners
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteOwner
);

export default router;