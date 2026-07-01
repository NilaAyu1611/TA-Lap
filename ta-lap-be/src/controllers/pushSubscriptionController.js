import {
  getPushSubscriptionStatus,
  getVapidPublicKey,
  isPushConfigured,
  removePushSubscription,
  savePushSubscription,
} from "../services/pushNotificationService.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export const getPushConfig = async (_req, res) => {
  res.json({
    enabled: isPushConfigured(),
    publicKey: isPushConfigured() ? getVapidPublicKey() : null,
  });
};

export const getPushStatus = async (req, res) => {
  try {
    const status = await getPushSubscriptionStatus(req.user.id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const subscribePush = async (req, res) => {
  try {
    if (!isPushConfigured()) {
      return res.status(503).json({
        message: "Push notification belum dikonfigurasi di server.",
      });
    }

    const { subscription } = req.body;
    const userAgent = req.headers["user-agent"] || null;

    const row = await savePushSubscription(
      req.user.id,
      subscription,
      userAgent
    );

    res.status(201).json({
      message: "Notifikasi push aktif untuk perangkat ini.",
      data: serialize({ id: row.id }),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const unsubscribePush = async (req, res) => {
  try {
    const endpoint = req.body?.endpoint;
    await removePushSubscription(req.user.id, endpoint);
    res.json({ message: "Notifikasi push dinonaktifkan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
