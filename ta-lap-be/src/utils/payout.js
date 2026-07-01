/** Filter transaksi online yang perlu transfer ke owner (bukan cash). */
export const ONLINE_PAYOUT_WHERE = {
  status: "sukses",
  metode: { not: "cash" },
};

export function payoutMenungguWhere(extra = {}) {
  return {
    ...ONLINE_PAYOUT_WHERE,
    status_payout_owner: "menunggu",
    ...extra,
  };
}

export function mergeSettlementMeta(catatan, patch) {
  let base = {};
  if (catatan && typeof catatan === "string") {
    try {
      base = JSON.parse(catatan);
    } catch {
      base = { legacy_note: catatan };
    }
  }
  return JSON.stringify({ ...base, ...patch });
}

export function decodeSettlementMeta(catatan) {
  if (!catatan || typeof catatan !== "string") return {};
  try {
    return JSON.parse(catatan);
  } catch {
    return { legacy_note: catatan };
  }
}
