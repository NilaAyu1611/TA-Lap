import prisma from "../config/prisma.js";
import { processBookingPaymentReminders } from "../services/bookingPaymentReminderService.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const formatNotifikasi = (row) => ({
  id: row.id,
  title: row.title,
  message: row.message,
  type: row.type,
  link: row.link,
  pesanan_id: row.pesanan_id ? String(row.pesanan_id) : null,
  is_read: row.is_read,
  created_at: row.created_at,
});

export const getMyNotifications = async (req, res) => {
  try {
    await processBookingPaymentReminders();

    const userId = BigInt(req.user.id);
    const limit = Math.min(Number(req.query.limit) || 30, 50);

    const [items, unreadCount] = await Promise.all([
      prisma.notifikasi.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        take: limit,
      }),
      prisma.notifikasi.count({
        where: { user_id: userId, is_read: false },
      }),
    ]);

    res.json(
      serialize({
        unreadCount,
        data: items.map(formatNotifikasi),
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { id } = req.params;

    const existing = await prisma.notifikasi.findFirst({
      where: { id: BigInt(id), user_id: userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    const updated = await prisma.notifikasi.update({
      where: { id: BigInt(id) },
      data: { is_read: true },
    });

    res.json({
      message: "Notifikasi ditandai dibaca",
      data: serialize(formatNotifikasi(updated)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);

    await prisma.notifikasi.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });

    res.json({ message: "Semua notifikasi ditandai dibaca" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    await processBookingPaymentReminders();

    const count = await prisma.notifikasi.count({
      where: {
        user_id: BigInt(req.user.id),
        is_read: false,
      },
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
