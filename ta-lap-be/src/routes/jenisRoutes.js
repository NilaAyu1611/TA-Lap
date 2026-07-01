import express from "express";
import {
  createJenisOlahraga,
  deleteJenisOlahraga,
  getAllJenisOlahraga,
} from "../controllers/jenisOlahragaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllJenisOlahraga);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  createJenisOlahraga
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteJenisOlahraga
);

export default router;
