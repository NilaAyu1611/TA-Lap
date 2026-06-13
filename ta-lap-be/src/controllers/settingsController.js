import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serialize.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.setting.findFirst();

    if (!settings) {
      settings = await prisma.setting.create({
        data: {
          id: 1,
          app_name: "TA-LAP",
          app_email: "support@talap.com",
          app_phone: "081234567890",
        },
      });
    }

    res.json(serializeBigInt(settings));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
