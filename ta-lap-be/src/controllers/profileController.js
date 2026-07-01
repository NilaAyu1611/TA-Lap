import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serialize.js";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  city: true,
  avatar: true,
  role: true,
  status: true,
  email_verified: true,
  created_at: true,
  updated_at: true,
};

async function getUserProfilePayload(userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: "user" },
    select: profileSelect,
  });

  if (!user) return null;

  const [totalBooking, totalSpending, lastLogin] = await Promise.all([
    prisma.pesanan.count({
      where: { user_id: userId, status: { not: "dibatalkan" } },
    }),
    prisma.pembayaran.aggregate({
      _sum: { total_bayar: true },
      where: {
        status: "sukses",
        pesanan: { user_id: userId },
      },
    }),
    prisma.activityLog.findFirst({
      where: { user_id: userId, activity_type: "login" },
      orderBy: { created_at: "desc" },
      select: {
        created_at: true,
        ip_address: true,
        device: true,
      },
    }),
  ]);

  return {
    ...user,
    joined: user.created_at,
    totalBooking,
    totalSpending: Number(totalSpending._sum.total_bayar || 0),
    lastLogin,
  };
}

export const getMyProfile = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const profile = await getUserProfilePayload(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profil user tidak ditemukan" });
    }

    res.json(serializeBigInt({ data: profile }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { name, email, phone, city, avatar } = req.body;

    const existing = await prisma.user.findFirst({
      where: { id: userId, role: "user" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Profil user tidak ditemukan" });
    }

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ message: "Nama wajib diisi" });
    }

    if (email !== undefined) {
      const trimmedEmail = String(email).trim().toLowerCase();
      if (!trimmedEmail) {
        return res.status(400).json({ message: "Email wajib diisi" });
      }
      if (trimmedEmail !== existing.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: trimmedEmail },
        });
        if (emailTaken) {
          return res.status(400).json({ message: "Email sudah digunakan" });
        }
      }
    }

    if (phone !== undefined && String(phone).trim()) {
      const phoneValue = String(phone).trim();
      if (!/^[\d\s+\-()]{8,20}$/.test(phoneValue)) {
        return res.status(400).json({
          message: "Format nomor telepon tidak valid",
        });
      }
    }

    const updateData = {};

    if (name !== undefined) updateData.name = String(name).trim();
    if (email !== undefined) updateData.email = String(email).trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (city !== undefined) updateData.city = city?.trim() || null;
    if (avatar !== undefined) updateData.avatar = avatar?.trim() || null;

    if (name !== undefined && !updateData.avatar && !existing.avatar) {
      updateData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updateData.name)}&background=0891b2&color=fff`;
    }

    const profile = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: profileSelect,
    });

    res.json({
      message: "Profil berhasil diperbarui",
      profile: serializeBigInt(profile),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Konfirmasi password tidak cocok",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, role: "user" },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "Akun ini belum punya password lokal. Gunakan menu Lupa Password untuk membuat password.",
      });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await prisma.activityLog.create({
      data: {
        user_id: userId,
        activity_type: "password_changed",
        ip_address: req.ip || null,
        device: req.headers["user-agent"] || null,
      },
    });

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
