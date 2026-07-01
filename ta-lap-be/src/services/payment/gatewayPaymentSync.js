import prisma from "../../config/prisma.js";
import { applyGatewaySettlement } from "../../controllers/pembayaranController.js";
import { fetchTransactionStatus } from "./midtransService.js";
import {
  getOrderIdFromMeta,
} from "../../utils/midtransMeta.js";

const ONLINE_METODE = ["transfer", "qris", "ewallet"];

export async function syncPembayaranFromGateway(pembayaran) {
  const orderId = getOrderIdFromMeta(pembayaran.catatan_settlement);
  if (!orderId) return pembayaran;

  const verified = await fetchTransactionStatus(orderId);
  return applyGatewaySettlement(pembayaran, verified);
}

function shouldAttemptGatewaySync(pembayaran) {
  if (!pembayaran || pembayaran.status !== "menunggu") return false;
  if (!ONLINE_METODE.includes(pembayaran.metode)) return false;
  return Boolean(getOrderIdFromMeta(pembayaran.catatan_settlement));
}

export async function syncUserPendingGatewayPayments(userId) {
  const pending = await prisma.pembayaran.findMany({
    where: {
      status: "menunggu",
      metode: { in: ONLINE_METODE },
      pesanan: { user_id: BigInt(userId) },
    },
  });

  for (const pembayaran of pending) {
    if (!shouldAttemptGatewaySync(pembayaran)) continue;
    try {
      await syncPembayaranFromGateway(pembayaran);
    } catch (error) {
      console.warn(
        `[gateway-sync] skip pesanan ${pembayaran.pesanan_id}:`,
        error.message
      );
    }
  }
}

/** Perbaiki pesanan pending yang pembayarannya sudah sukses. */
export async function fixPesananPaidMismatch(userId) {
  const mismatched = await prisma.pesanan.findMany({
    where: {
      user_id: BigInt(userId),
      status: "pending",
      pembayaran: { status: "sukses" },
    },
    select: { id: true },
  });

  if (mismatched.length === 0) return;

  await prisma.pesanan.updateMany({
    where: {
      id: { in: mismatched.map((p) => p.id) },
      status: "pending",
    },
    data: { status: "dibayar" },
  });
}
