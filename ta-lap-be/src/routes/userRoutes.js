import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchCustomers,
  lookupCustomerByPhone,
} from "../controllers/users/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/customers/search",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  searchCustomers
);

router.get(
  "/customers/by-phone",
  authMiddleware,
  roleMiddleware("admin", "owner"),
  lookupCustomerByPhone
);

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
