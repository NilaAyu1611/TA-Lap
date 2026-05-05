// import express from "express";
// import {
//   getAllLapangan,
//   createLapangan
// } from "../controllers/lapanganController.js";

// import { authMiddleware } from "../middlewares/authMiddleware.js";
// import { roleMiddleware } from "../middlewares/roleMiddleware.js";

// const router = express.Router();

// router.get("/", getAllLapangan);

// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("owner", "admin"),
//   createLapangan
// );

// export default router;


import express from "express";
import {
  getAllLapangan,
  createLapangan,
  updateLapangan,
  deleteLapangan,
} from "../controllers/lapanganController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// GET → semua role boleh
router.get("/", authMiddleware, getAllLapangan);

// CREATE → owner & admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  createLapangan
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  updateLapangan
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("owner", "admin"),
  deleteLapangan
);

export default router;