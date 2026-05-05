import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serializeBigInt } from "../utils/serialize.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user"
      }
    });

    res.status(201).json({
      message: "Register berhasil",
      data: serializeBigInt(user)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Password salah"
      });
    }

    const token = jwt.sign(
      {
        id: user.id.toString(), // 🔥 penting (hindari BigInt di token)
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: serializeBigInt(user)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.json({ message: "Logout berhasil" });
};