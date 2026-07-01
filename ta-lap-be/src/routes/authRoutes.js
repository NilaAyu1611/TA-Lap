import express from "express";
import {
  register,
  registerOwner,
  login,
  logout,
  googleLogin,
  getGoogleAuthConfig,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/google/config", getGoogleAuthConfig);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/verify", verifyResetToken);
router.post("/reset-password", resetPassword);
router.post("/register", register);
router.post("/register/owner", registerOwner);
router.post("/login", login);
router.post("/logout", logout);

export default router;
