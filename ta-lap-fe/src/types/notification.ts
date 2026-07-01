export type NotificationType =
  | "booking_created_unpaid"
  | "payment_reminder_1h"
  | "payment_warning_15m"
  | "booking_expired_unpaid";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType | string | null;
  link: string | null;
  pesanan_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  unreadCount: number;
  data: AppNotification[];
}
