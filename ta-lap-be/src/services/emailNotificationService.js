import prisma from "../config/prisma.js";
import {
  getFrontendUrl,
  isEmailConfigured,
  sendTransactionalEmail,
} from "./emailService.js";
import { getOrCreatePlatformSettings } from "../utils/platformSettings.js";

function resolveActionUrl(link) {
  if (!link) return getFrontendUrl();
  if (link.startsWith("http")) return link;
  return `${getFrontendUrl()}${link.startsWith("/") ? link : `/${link}`}`;
}

function resolveActionLabel(link) {
  if (!link) return "Buka TA-LAP";
  if (link.includes("pembayaran")) return "Bayar sekarang";
  if (link.includes("pesanan")) return "Lihat pesanan";
  if (link.includes("owner")) return "Buka dashboard owner";
  return "Buka TA-LAP";
}

/**
 * Kirim email notifikasi ke user (non-blocking error — gagal email tidak mengganggu flow utama).
 * settingKey: booking_notification | payment_notification | owner_notification
 */
export async function maybeSendNotificationEmail({
  userId,
  title,
  message,
  link,
  settingKey = "booking_notification",
}) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "smtp" };
  }

  const settings = await getOrCreatePlatformSettings();
  if (settingKey && settings[settingKey] === false) {
    return { sent: false, reason: "disabled" };
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: { email: true, name: true, status: true },
  });

  if (!user?.email) {
    return { sent: false, reason: "no_email" };
  }

  if (user.status === "blocked" || user.status === "suspended") {
    return { sent: false, reason: "inactive_user" };
  }

  try {
    await sendTransactionalEmail({
      to: user.email,
      name: user.name,
      subject: `${title} — TA-LAP`,
      title,
      message,
      actionUrl: resolveActionUrl(link),
      actionLabel: resolveActionLabel(link),
    });
    return { sent: true };
  } catch (error) {
    console.warn("[email] Gagal kirim notifikasi:", error.message);
    return { sent: false, reason: "error" };
  }
}

export function settingKeyForNotificationType(type) {
  if (!type) return "booking_notification";
  if (
    type === "user_payment_success" ||
    type === "owner_payment_success" ||
    type === "admin_payment_success" ||
    type.startsWith("owner_setoran_") ||
    type === "admin_setoran_komisi"
  ) {
    return "payment_notification";
  }
  if (type === "owner_register") {
    return "owner_notification";
  }
  return "booking_notification";
}

/** Kirim notifikasi lewat email + push browser (jika user sudah subscribe). */
export async function deliverNotificationChannels({
  userId,
  title,
  message,
  link,
  settingKey,
  type,
}) {
  const resolvedSettingKey = settingKey || settingKeyForNotificationType(type);

  let email = { sent: false, reason: "error" };
  let push = { sent: 0, reason: "error" };

  try {
    email = await maybeSendNotificationEmail({
      userId,
      title,
      message,
      link,
      settingKey: resolvedSettingKey,
    });
  } catch (error) {
    console.warn("[notify] Email gagal:", error.message);
  }

  try {
    const { maybeSendPushNotification } = await import(
      "./pushNotificationService.js"
    );
    push = await maybeSendPushNotification({
      userId,
      title,
      message,
      link,
      settingKey: resolvedSettingKey,
      type,
    });
  } catch (error) {
    console.warn("[notify] Push gagal:", error.message);
  }

  return { email, push };
}
