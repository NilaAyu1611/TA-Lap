import crypto from "crypto";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { serializeBigInt } from "../utils/serialize.js";
import { notifyAdminsOwnerRegistration } from "../services/adminNotificationService.js";
import {
  issueAuthResponse,
  normalizeEmail,
} from "../utils/authHelpers.js";
import {
  getGoogleConfig,
  verifyGoogleCredential,
} from "../services/googleAuthService.js";
import {
  getFrontendUrl,
  isEmailConfigured,
  sendPasswordResetEmail,
} from "../services/emailService.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function authError(res, error) {
  const status = error.statusCode || 500;
  return res.status(status).json({
    message: error.message || "Terjadi kesalahan server",
  });
}

// REGISTER USER (pemain)
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Nama, email, nomor telepon, dan password wajib diisi",
      });
    }

    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return res.status(400).json({ message: "Nomor telepon tidak valid" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phoneDigits || phone,
        city: city || null,
        role: "user",
        status: "active",
        auth_provider: "local",
        email_verified: false,
      },
    });

    const { password: _, ...safeUser } = serializeBigInt(user);

    res.status(201).json({
      message: "Registrasi berhasil. Silakan login dan mulai booking.",
      data: safeUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REGISTER OWNER (mitra venue — verifikasi admin)
export const registerOwner = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      city,
      nama_usaha,
      catatan,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({ message: "Nomor telepon wajib diisi" });
    }

    if (!city?.trim()) {
      return res.status(400).json({ message: "Kota wajib diisi" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationNotes = [
      nama_usaha?.trim() ? `Usaha: ${nama_usaha.trim()}` : null,
      catatan?.trim() ? `Catatan: ${catatan.trim()}` : null,
      "Pendaftaran mandiri via website",
    ]
      .filter(Boolean)
      .join(" · ");

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone.trim(),
        city: city.trim(),
        role: "owner",
        status: "pending",
        auth_provider: "local",
        verification: {
          create: {
            status: "pending",
            notes: verificationNotes || null,
          },
        },
        ownerProfile: {
          create: {
            business_name: nama_usaha?.trim() || null,
            business_description: catatan?.trim() || null,
          },
        },
      },
      include: { verification: true, ownerProfile: true },
    });

    await notifyAdminsOwnerRegistration({
      name,
      email: normalizedEmail,
      city: city.trim(),
    });

    const { password: _, ...safeUser } = serializeBigInt(user);

    res.status(201).json({
      message:
        "Pendaftaran owner berhasil. Tim admin akan memverifikasi akun Anda. Silakan login setelah disetujui.",
      data: safeUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN email + password
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "Akun ini menggunakan Google. Silakan masuk dengan tombol Google, atau gunakan Lupa Password untuk membuat password.",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    const payload = await issueAuthResponse(user, req);
    res.json(payload);
  } catch (error) {
    return authError(res, error);
  }
};

// LOGIN via Google ID token
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Token Google wajib diisi" });
    }

    const googleUser = await verifyGoogleCredential(credential);

    let user =
      (await prisma.user.findUnique({
        where: { google_id: googleUser.googleId },
      })) ||
      (await prisma.user.findUnique({
        where: { email: googleUser.email },
      }));

    if (user) {
      if (user.role === "admin") {
        return res.status(403).json({
          message: "Admin harus login dengan email dan password.",
        });
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          google_id: user.google_id || googleUser.googleId,
          email_verified: true,
          name: user.name || googleUser.name,
          avatar: user.avatar || googleUser.picture,
          auth_provider: user.password ? user.auth_provider : "google",
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          google_id: googleUser.googleId,
          avatar: googleUser.picture,
          role: "user",
          status: "active",
          auth_provider: "google",
          email_verified: true,
          password: null,
        },
      });
    }

    const payload = await issueAuthResponse(user, req);
    res.json(payload);
  } catch (error) {
    if (error.message?.includes("Google")) {
      return res.status(503).json({ message: error.message });
    }
    return authError(res, error);
  }
};

export const getGoogleAuthConfig = async (_req, res) => {
  const config = getGoogleConfig();
  res.json({
    enabled: config.enabled,
    clientId: config.enabled ? config.clientId : null,
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const genericMessage =
      "Jika email terdaftar, link reset password telah dikirim. Cek inbox atau folder spam.";

    if (!user) {
      return res.json({ message: genericMessage });
    }

    if (user.role === "admin") {
      return res.json({ message: genericMessage });
    }

    await prisma.passwordResetToken.updateMany({
      where: {
        user_id: user.id,
        used_at: null,
        expires_at: { gt: new Date() },
      },
      data: { used_at: new Date() },
    });

    const token = createResetToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.passwordResetToken.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt,
      },
    });

    const resetUrl = `${getFrontendUrl()}/reset-password?token=${token}`;

    const mailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    if (!mailResult.sent && process.env.NODE_ENV !== "production") {
      return res.json({
        message: genericMessage,
        devResetUrl: mailResult.devLink,
        emailConfigured: isEmailConfigured(),
      });
    }

    res.json({
      message: genericMessage,
      emailConfigured: isEmailConfigured(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ valid: false, message: "Token wajib diisi" });
    }

    const row = await prisma.passwordResetToken.findUnique({
      where: { token: String(token) },
    });

    if (!row) {
      return res.status(400).json({
        valid: false,
        message: "Link reset password tidak valid",
      });
    }

    if (row.used_at) {
      return res.status(400).json({
        valid: false,
        message:
          "Link reset sudah tidak aktif. Jika Anda minta link baru, hanya email terbaru yang bisa dipakai.",
      });
    }

    if (row.expires_at < new Date()) {
      return res.status(400).json({
        valid: false,
        message: "Link reset sudah kadaluarsa (lebih dari 1 jam).",
      });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token dan password baru wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const row = await prisma.passwordResetToken.findUnique({
      where: { token: String(token) },
      include: { user: true },
    });

    if (!row || row.used_at || row.expires_at < new Date()) {
      return res.status(400).json({
        message: "Link reset password tidak valid atau sudah kadaluarsa",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.user_id },
        data: {
          password: hashed,
          auth_provider: row.user.google_id ? row.user.auth_provider : "local",
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: row.id },
        data: { used_at: new Date() },
      }),
    ]);

    res.json({
      message: "Password berhasil diubah. Silakan login dengan password baru.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = async (_req, res) => {
  res.json({ message: "Logout berhasil" });
};
