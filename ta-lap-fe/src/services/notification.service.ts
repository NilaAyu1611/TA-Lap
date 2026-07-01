import api from "@/lib/api";
import {
  AppNotification,
  NotificationListResponse,
} from "@/types/notification";

export async function getMyNotifications(limit = 30) {
  const res = await api.get<NotificationListResponse>("/notifications", {
    params: { limit },
  });
  return res.data;
}

export async function getUnreadNotificationCount() {
  const res = await api.get<{ unreadCount: number }>(
    "/notifications/unread-count"
  );
  return res.data.unreadCount;
}

export async function markNotificationRead(id: string) {
  const res = await api.put<{ data: AppNotification }>(
    `/notifications/${id}/read`
  );
  return res.data;
}

export async function markAllNotificationsRead() {
  await api.put("/notifications/read-all");
}

export type PushConfigResponse = {
  enabled: boolean;
  publicKey: string | null;
};

export type PushStatusResponse = {
  configured: boolean;
  subscribed: boolean;
  subscriptionCount: number;
};

export async function getPushConfig() {
  const res = await api.get<PushConfigResponse>("/notifications/push/config");
  return res.data;
}

export async function getPushStatus() {
  const res = await api.get<PushStatusResponse>("/notifications/push/status");
  return res.data;
}

export async function subscribePushSubscription(
  subscription: PushSubscriptionJSON
) {
  const res = await api.post<{ message: string }>(
    "/notifications/push/subscribe",
    { subscription }
  );
  return res.data;
}

export async function unsubscribePushSubscription(endpoint?: string) {
  const res = await api.delete<{ message: string }>(
    "/notifications/push/unsubscribe",
    endpoint ? { data: { endpoint } } : undefined
  );
  return res.data;
}
