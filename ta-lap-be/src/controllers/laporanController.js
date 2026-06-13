import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serialize.js";

export const getPendapatanBulanan = async (req, res) => {
  try {
    const data = await prisma.pembayaran.findMany({
      where: { status: "sukses" },
      select: {
        total_bayar: true,
        tanggal_bayar: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(serializeBigInt(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
