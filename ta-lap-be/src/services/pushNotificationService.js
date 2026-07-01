import webpush from "web-push";

import prisma from "../config/prisma.js";
import { getFrontendUrl } from "./emailService.js";
import { getOrCreatePlatformSettings } from "../utils/platformSettings.js";
import { settingKeyForNotificationType } from "./emailNotificationService.js";

let vapidConfigured = false;

export function isPushConfigured() {
  const publicKey = (process.env.VAPID_PUBLIC_KEY || "").trim();
  const privateKey = (process.env.VAPID_PRIVATE_KEY || "").trim();
  return publicKey.length > 0 && privateKey.length > 0;
}

export function getVapidPublicKey() {
  return (process.env.VAPID_PUBLIC_KEY || "").trim();
}

function ensureVapidConfigured() {
  if (!isPushConfigured()) return false;
  if (vapidConfigured) return true;

  webpush.setVapidDetails(
    (process.env.VAPID_SUBJECT || process.env.MAIL_FROM || "mailto:support@talap.local").trim(),
    process.env.VAPID_PUBLIC_KEY.trim(),
    process.env.VAPID_PRIVATE_KEY.trim()
  );
  vapidConfigured = true;
  return true;
}

function resolveActionUrl(link) {
  if (!link) return getFrontendUrl();
  if (link.startsWith("http")) return link;
  return `${getFrontendUrl()}${link.startsWith("/") ? link : `/${link}`}`;
}

export async function savePushSubscription(userId, subscription, userAgent) {
  if (!prisma.pushSubscription) {
    throw new Error(
      "Push subscription belum siap. Restart backend setelah npx prisma generate."
    );
  }

  const endpoint = subscription?.endpoint?.trim();
  const p256dh = subscription?.keys?.p256dh?.trim();
  const auth = subscription?.keys?.auth?.trim();

  if (!endpoint || !p256dh || !auth) {
    throw new Error("Data subscription push tidak valid");
  }

  const existing = await prisma.pushSubscription.findFirst({
    where: {
      user_id: BigInt(userId),
      endpoint,
    },
  });

  if (existing) {
    return prisma.pushSubscription.update({
      where: { id: existing.id },
      data: { p256dh, auth, user_agent: userAgent || null },
    });
  }

  return prisma.pushSubscription.create({
    data: {
      user_id: BigInt(userId),
      endpoint,
      p256dh,
      auth,
      user_agent: userAgent || null,
    },
  });
}

export async function removePushSubscription(userId, endpoint) {
  if (!prisma.pushSubscription) return;

  if (!endpoint?.trim()) {
    await prisma.pushSubscription.deleteMany({
      where: { user_id: BigInt(userId) },
    });
    return;
  }

  await prisma.pushSubscription.deleteMany({
    where: {
      user_id: BigInt(userId),
      endpoint: endpoint.trim(),
    },
  });
}

export async function getPushSubscriptionStatus(userId) {
  if (!prisma.pushSubscription) {
    return {
      configured: isPushConfigured(),
      subscribed: false,
      subscriptionCount: 0,
    };
  }

  const count = await prisma.pushSubscription.count({
    where: { user_id: BigInt(userId) },
  });

  return {
    configured: isPushConfigured(),
    subscribed: count > 0,
    subscriptionCount: count,
  };
}

export async function maybeSendPushNotification({
  userId,
  title,
  message,
  link,
  settingKey,
  type,
}) {
  if (!ensureVapidConfigured()) {
    return { sent: 0, reason: "vapid" };
  }

  const resolvedSettingKey = settingKey || settingKeyForNotificationType(type);
  const settings = await getOrCreatePlatformSettings();
  if (resolvedSettingKey && settings[resolvedSettingKey] === false) {
    return { sent: 0, reason: "disabled" };
  }

  if (!prisma.pushSubscription) {
    console.warn(
      "[push] Model pushSubscription belum tersedia. Jalankan: npx prisma generate"
    );
    return { sent: 0, reason: "prisma_client" };
  }

  let subscriptions = [];
  try {
    subscriptions = await prisma.pushSubscription.findMany({
      where: { user_id: BigInt(userId) },
    });
  } catch (error) {
    console.warn("[push] Gagal memuat subscription:", error.message);
    return { sent: 0, reason: "error" };
  }

  if (subscriptions.length === 0) {
    return { sent: 0, reason: "no_subscription" };
  }

  const payload = JSON.stringify({
    title: title || "TA-LAP",
    body: message || "",
    url: resolveActionUrl(link),
    tag: type || title || "talap-notification",
  });

  let sent = 0;
  const staleIds = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
      sent += 1;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        staleIds.push(sub.id);
      } else {
        console.warn("[push] Gagal kirim:", error.message);
      }
    }
  }

  if (staleIds.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { id: { in: staleIds } },
    });
  }

  return { sent };
}
