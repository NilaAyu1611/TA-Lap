import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { serializeBigInt } from "./serialize.js";
import { shouldLogLoginActivity } from "./platformSettings.js";

export function getLoginBlockReason(user) {
  if (!user) return "User tidak ditemukan";

  if (user.status === "blocked" || user.status === "suspended") {
    return "Akun Anda diblokir. Hubungi admin TA-Lap.";
  }

  if (user.role === "owner" && user.status === "pending") {
    return "Akun owner masih menunggu verifikasi admin. Kami akan menghubungi Anda setelah disetujui.";
  }

  return null;
}

export async function issueAuthResponse(user, req) {
  const blockReason = getLoginBlockReason(user);
  if (blockReason) {
    const err = new Error(blockReason);
    err.statusCode = 403;
    throw err;
  }

  const token = jwt.sign(
    {
      id: user.id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  if (await shouldLogLoginActivity()) {
    await prisma.activityLog.create({
      data: {
        user_id: user.id,
        activity_type: "login",
        ip_address: req.ip || null,
        device: req.headers["user-agent"] || null,
      },
    });
  }

  const { password: _, ...safeUser } = serializeBigInt(user);

  return {
    message: "Login berhasil",
    token,
    user: safeUser,
  };
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}
