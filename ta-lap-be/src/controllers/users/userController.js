import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  avatar: user.avatar,
  status: user.status,
  email_verified: user.email_verified,
  joined: user.created_at,
  totalBooking: user.pesanans?.length ?? 0,
  totalPayment:
    user.pesanans?.reduce(
      (total, booking) =>
        total + Number(booking.pembayaran?.total_bayar || 0),
      0
    ) ?? 0,
});

const userInclude = {
  pesanans: {
    include: {
      pembayaran: true,
    },
  },
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "user" },
      include: userInclude,
      orderBy: { created_at: "desc" },
    });

    const formattedUsers = users.map(formatUser);

    const statsWhere = { role: "user" };

    const [total, active, pending, blocked, suspended] = await Promise.all([
      prisma.user.count({ where: statsWhere }),
      prisma.user.count({ where: { ...statsWhere, status: "active" } }),
      prisma.user.count({ where: { ...statsWhere, status: "pending" } }),
      prisma.user.count({ where: { ...statsWhere, status: "blocked" } }),
      prisma.user.count({ where: { ...statsWhere, status: "suspended" } }),
    ]);

    res.json(
      serialize({
        stats: { total, active, pending, blocked, suspended },
        data: formattedUsers,
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: { id: BigInt(id), role: "user" },
      include: userInclude,
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(serialize({ data: formatUser(user) }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, city, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        city: city || null,
        status: status || "active",
        role: "user",
      },
      include: userInclude,
    });

    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: serialize(formatUser(user)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, city, status } = req.body;

    const existing = await prisma.user.findFirst({
      where: { id: BigInt(id), role: "user" },
    });

    if (!existing) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (city !== undefined) updateData.city = city || null;
    if (status !== undefined) updateData.status = status;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: userInclude,
    });

    res.json({
      message: "User berhasil diperbarui",
      data: serialize(formatUser(user)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = BigInt(id);

    const existing = await prisma.user.findFirst({
      where: { id: userId, role: "user" },
      include: { pesanans: { select: { id: true } } },
    });

    if (!existing) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await prisma.$transaction(async (tx) => {
      const pesananIds = existing.pesanans.map((p) => p.id);

      if (pesananIds.length > 0) {
        await tx.pembayaran.deleteMany({
          where: { pesanan_id: { in: pesananIds } },
        });
        await tx.pesanan.deleteMany({
          where: { user_id: userId },
        });
      }

      await tx.activityLog.deleteMany({ where: { user_id: userId } });
      await tx.notifikasi.deleteMany({ where: { user_id: userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
