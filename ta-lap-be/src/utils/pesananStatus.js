/** Status pesanan yang masih menempati slot lapangan. */
export const ACTIVE_BOOKING_STATUSES = ["pending", "dibayar", "selesai"];

export const INACTIVE_BOOKING_STATUSES = ["dibatalkan", "expired"];

export function activeBookingWhere(extra = {}) {
  return {
    ...extra,
    status: { in: ACTIVE_BOOKING_STATUSES },
  };
}

export function blocksSlotWhere(extra = {}) {
  return {
    ...extra,
    status: { notIn: INACTIVE_BOOKING_STATUSES },
  };
}
