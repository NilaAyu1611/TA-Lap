import prisma from "../config/prisma.js";
import {
  buildKomisiUpdateForPembayaran,
  buildPembayaranKomisiData,
  getKomisiPersen,
} from "../utils/komisi.js";
import {
  buildOrderId,
  createSnapTransaction,
  fetchTransactionStatus,
  getEnabledPayments,
  getMidtransConfig,
  isMidtransAuthError,
  mapGatewayPaymentType,
  mapGatewayStatus,
  verifyMidtransCredentials,
} from "../services/payment/midtransService.js";
import {
  decodeMidtransMeta,
  encodeMidtransMeta,
  getOrderIdFromMeta,
} from "../utils/midtransMeta.js";
import { notifyAdminsPaymentSuccess } from "../services/adminNotificationService.js";
import { notifyOwnerPaymentSuccess } from "../services/ownerNotificationService.js";
import { notifyUserPaymentSuccess } from "../services/bookingPaymentReminderService.js";

async function notifyPaymentSuccessParties(pesananId) {
  await notifyAdminsPaymentSuccess(pesananId);
  await notifyOwnerPaymentSuccess(pesananId);
  await notifyUserPaymentSuccess(pesananId);
}

const convertBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

async function getUserPesanan(pesananId, userId) {
  return prisma.pesanan.findFirst({
    where: {
      id: BigInt(pesananId),
      user_id: BigInt(userId),
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      pembayaran: true,
    },
  });
}

export async function applyGatewaySettlement(pembayaran, notification) {
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;
  const paymentType = notification.payment_type;
  const nextStatus = mapGatewayStatus(transactionStatus, fraudStatus);
  const metode = mapGatewayPaymentType(paymentType);
  const paymentJustSucceeded =
    nextStatus === "sukses" && pembayaran.status !== "sukses";

  const updateData = {
    metode,
    status: nextStatus,
    tanggal_bayar:
      nextStatus === "sukses"
        ? pembayaran.tanggal_bayar || new Date()
        : pembayaran.tanggal_bayar,
    catatan_settlement: encodeMidtransMeta({
      orderId:
        getOrderIdFromMeta(pembayaran.catatan_settlement) ||
        notification.order_id,
      gatewayStatus: transactionStatus,
      paymentType,
      statusMessage: notification.status_message || null,
    }),
  };

  // Jangan reset komisi/payout saat sync ulang — hanya saat pertama kali sukses.
  if (paymentJustSucceeded || nextStatus !== "sukses") {
    const komisiData = await buildKomisiUpdateForPembayaran(
      pembayaran.total_bayar,
      metode,
      nextStatus
    );
    Object.assign(updateData, komisiData);
  }

  const updated = await prisma.pembayaran.update({
    where: { id: pembayaran.id },
    data: updateData,
  });

  if (nextStatus === "sukses") {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pembayaran.pesanan_id },
      select: { status: true },
    });

    await prisma.pesanan.update({
      where: { id: pembayaran.pesanan_id },
      data: { status: "dibayar" },
    });

    if (pesanan?.status === "pending" && pembayaran.status !== "sukses") {
      await notifyPaymentSuccessParties(pembayaran.pesanan_id);
    }
  }

  return updated;
}

export const getMyPembayaran = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);

    const data = await prisma.pembayaran.findMany({
      where: {
        pesanan: { user_id: userId },
      },
      include: {
        pesanan: {
          include: {
            lapangan: { include: { jenis: true } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({
      message: "Data pembayaran user",
      data: convertBigInt(data),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentConfig = async (_req, res) => {
  const config = getMidtransConfig();
  const keysVerified =
    config.enabled && (await verifyMidtransCredentials());

  let configIssue = !config.enabled
    ? config.configIssue
    : keysVerified
      ? null
      : "invalid_credentials";

  if (
    configIssue === "invalid_credentials" &&
    config.inferredProduction === true &&
    !config.envProductionFlag
  ) {
    configIssue = "production_keys_sandbox_mode";
  }

  res.json({
    data: {
      snapEnabled: keysVerified,
      clientKey: keysVerified ? config.clientKey : null,
      isSandbox: !config.isProduction,
      configIssue,
      keyEnvironment: config.isProduction ? "production" : "sandbox",
    },
  });
};

export const createSnapPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pesanan_id, channel = "all" } = req.body;

    if (!getMidtransConfig().enabled) {
      return res.status(503).json({
        message:
          "Payment gateway belum dikonfigurasi. Hubungi admin untuk mengaktifkan Midtrans.",
      });
    }

    const pesanan = await getUserPesanan(pesanan_id, userId);
    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (pesanan.status !== "pending") {
      return res.status(400).json({
        message: "Pesanan sudah dibayar atau tidak valid",
      });
    }

    if (pesanan.pembayaran?.status === "sukses") {
      return res.status(400).json({ message: "Pesanan sudah lunas" });
    }

    const amount = Number(pesanan.total_harga);
    const orderId = buildOrderId(pesanan_id);
    const enabledPayments = getEnabledPayments(
      channel === "all" ? undefined : channel
    );

    const snap = await createSnapTransaction({
      orderId,
      amount,
      enabledPayments,
      customer: {
        first_name: pesanan.user.name,
        email: pesanan.user.email,
        phone: pesanan.user.phone || undefined,
      },
    });

    const persen = await getKomisiPersen();
    const placeholderMetode =
      channel === "transfer"
        ? "transfer"
        : channel === "ewallet"
          ? "ewallet"
          : "qris";
    const komisiData = buildPembayaranKomisiData(
      amount,
      placeholderMetode,
      "menunggu",
      persen
    );

    const paymentData = {
      metode: placeholderMetode,
      total_bayar: amount,
      bukti_pembayaran: amount,
      status: "menunggu",
      catatan_settlement: encodeMidtransMeta({
        orderId,
        gatewayStatus: "snap_created",
      }),
      ...komisiData,
    };

    if (pesanan.pembayaran) {
      await prisma.pembayaran.update({
        where: { id: pesanan.pembayaran.id },
        data: paymentData,
      });
    } else {
      await prisma.pembayaran.create({
        data: {
          pesanan_id: BigInt(pesanan_id),
          ...paymentData,
        },
      });
    }

    res.status(201).json({
      message: "Token pembayaran berhasil dibuat",
      data: {
        snap_token: snap.token,
        redirect_url: snap.redirect_url,
        order_id: orderId,
        client_key: getMidtransConfig().clientKey,
        is_sandbox: !getMidtransConfig().isProduction,
      },
    });
  } catch (error) {
    console.error("[pembayaran/snap]", error.message);
    const authError = isMidtransAuthError(error.message);
    res.status(authError ? 502 : 500).json({
      message: authError
        ? "Kunci Midtrans ditolak API. Untuk development gunakan kunci sandbox (SB-Mid-server / SB-Mid-client) dari dashboard.sandbox.midtrans.com."
        : "Gagal membuat pembayaran",
      error: error.message,
    });
  }
};

export const createCashPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pesanan_id } = req.body;

    const pesanan = await getUserPesanan(pesanan_id, userId);
    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (pesanan.status !== "pending") {
      return res.status(400).json({
        message: "Pesanan sudah dibayar atau tidak valid",
      });
    }

    if (pesanan.pembayaran?.status === "sukses") {
      return res.status(400).json({ message: "Pesanan sudah lunas" });
    }

    const amount = Number(pesanan.total_harga);
    const persen = await getKomisiPersen();
    const komisiData = buildPembayaranKomisiData(amount, "cash", "menunggu", persen);

    const paymentData = {
      metode: "cash",
      total_bayar: amount,
      bukti_pembayaran: amount,
      status: "menunggu",
      catatan_settlement: "manual:cash:menunggu",
      ...komisiData,
    };

    let pembayaran;
    if (pesanan.pembayaran) {
      pembayaran = await prisma.pembayaran.update({
        where: { id: pesanan.pembayaran.id },
        data: paymentData,
      });
    } else {
      pembayaran = await prisma.pembayaran.create({
        data: {
          pesanan_id: BigInt(pesanan_id),
          ...paymentData,
        },
      });
    }

    res.status(201).json({
      message:
        "Pembayaran tunai dicatat. Bayar langsung di venue; owner akan konfirmasi.",
      data: convertBigInt(pembayaran),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mencatat pembayaran tunai",
      error: error.message,
    });
  }
};

/** @deprecated — gunakan /snap atau /cash */
export const createPembayaran = async (req, res) => {
  const { metode } = req.body;
  if (metode === "cash") {
    return createCashPayment(req, res);
  }
  req.body.channel = metode === "transfer" ? "transfer" : metode === "ewallet" ? "ewallet" : "qris";
  return createSnapPayment(req, res);
};

export const handleMidtransWebhook = async (req, res) => {
  try {
    const notification = req.body;
    const orderId = notification.order_id;

    if (!orderId) {
      return res.status(400).json({ message: "order_id tidak ditemukan" });
    }

    let verified;
    try {
      verified = await fetchTransactionStatus(orderId);
    } catch {
      verified = notification;
    }

    const pembayaran = await prisma.pembayaran.findFirst({
      where: { catatan_settlement: { contains: orderId } },
    });

    if (!pembayaran || getOrderIdFromMeta(pembayaran.catatan_settlement) !== orderId) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    await applyGatewaySettlement(pembayaran, verified);

    res.json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const syncPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pesanan_id } = req.params;

    const pesanan = await getUserPesanan(pesanan_id, userId);
    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    if (!pesanan.pembayaran) {
      return res.status(404).json({ message: "Pembayaran belum dibuat" });
    }

    const orderId = getOrderIdFromMeta(pesanan.pembayaran.catatan_settlement);
    if (!orderId) {
      return res.status(404).json({ message: "Transaksi gateway tidak ditemukan" });
    }

    const verified = await fetchTransactionStatus(orderId);
    const updated = await applyGatewaySettlement(pesanan.pembayaran, verified);

    const refreshed = await getUserPesanan(pesanan_id, userId);

    res.json({
      message: "Status pembayaran diperbarui",
      data: convertBigInt(updated),
      pesanan_status: refreshed?.status ?? null,
      pembayaran_status: updated.status,
    });
  } catch (error) {
    console.error("[pembayaran/sync]", error.message);
    res.status(500).json({
      message: "Gagal memperbarui status pembayaran",
      error: error.message,
    });
  }
};

export const getAllPembayaran = async (req, res) => {
  try {
    const user = req.user;
    let whereClause = {};

    if (user.role === "owner") {
      whereClause = {
        pesanan: {
          lapangan: { owner_id: BigInt(user.id) },
        },
      };
    }

    const data = await prisma.pembayaran.findMany({
      where: whereClause,
      include: {
        pesanan: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            lapangan: { include: { jenis: true } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({
      message: "Semua pembayaran",
      data: convertBigInt(data),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStatusPembayaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const existing = await prisma.pembayaran.findUnique({
      where: { id: BigInt(id) },
      include: {
        pesanan: { include: { lapangan: true } },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      existing.pesanan?.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const nextStatus = status ?? existing.status;
    const komisiData = await buildKomisiUpdateForPembayaran(
      existing.total_bayar,
      existing.metode,
      nextStatus
    );

    const updated = await prisma.pembayaran.update({
      where: { id: BigInt(id) },
      data: {
        status: nextStatus,
        ...komisiData,
        tanggal_bayar:
          nextStatus === "sukses"
            ? existing.tanggal_bayar || new Date()
            : existing.tanggal_bayar,
      },
    });

    if (nextStatus === "sukses" && existing.pesanan?.status === "pending") {
      await prisma.pesanan.update({
        where: { id: existing.pesanan_id },
        data: { status: "dibayar" },
      });
      if (existing.status !== "sukses") {
        await notifyPaymentSuccessParties(existing.pesanan_id);
      }
    }

    res.json({
      message: "Status pembayaran diupdate",
      data: convertBigInt(updated),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const VALID_METODE = ["transfer", "qris", "cash", "ewallet"];
const VALID_PEMBAYARAN_STATUS = ["menunggu", "sukses", "gagal", "refund"];

export const upsertPembayaranByPesanan = async (req, res) => {
  try {
    const { pesananId } = req.params;
    const { metode, status, total_bayar } = req.body;
    const user = req.user;

    if (!metode || !VALID_METODE.includes(metode)) {
      return res.status(400).json({ message: "Metode pembayaran tidak valid" });
    }

    const payStatus = status || "sukses";
    if (!VALID_PEMBAYARAN_STATUS.includes(payStatus)) {
      return res.status(400).json({ message: "Status pembayaran tidak valid" });
    }

    const pesanan = await prisma.pesanan.findUnique({
      where: { id: BigInt(pesananId) },
      include: { lapangan: true, pembayaran: true },
    });

    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      pesanan.lapangan?.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const amount = Number(total_bayar ?? pesanan.total_harga);
    const persen = await getKomisiPersen();
    const komisiData = buildPembayaranKomisiData(amount, metode, payStatus, persen);

    const data = {
      metode,
      total_bayar: amount,
      bukti_pembayaran: amount,
      status: payStatus,
      tanggal_bayar: payStatus === "sukses" ? new Date() : null,
      ...komisiData,
    };

    let pembayaran;
    if (pesanan.pembayaran) {
      pembayaran = await prisma.pembayaran.update({
        where: { id: pesanan.pembayaran.id },
        data,
      });
    } else {
      pembayaran = await prisma.pembayaran.create({
        data: {
          pesanan_id: BigInt(pesananId),
          ...data,
        },
      });
    }

    if (payStatus === "sukses" && pesanan.status === "pending") {
      await prisma.pesanan.update({
        where: { id: BigInt(pesananId) },
        data: { status: "dibayar" },
      });
      const wasSuccess = pesanan.pembayaran?.status === "sukses";
      if (!wasSuccess) {
        await notifyPaymentSuccessParties(pesananId);
      }
    }

    res.json({
      message: "Pembayaran berhasil disimpan",
      data: convertBigInt(pembayaran),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ONLINE_METODE = ["transfer", "qris", "ewallet"];

function isAbortableSnapAttempt(pembayaran) {
  if (!pembayaran || pembayaran.status !== "menunggu") return false;
  if (!ONLINE_METODE.includes(pembayaran.metode)) return false;
  const meta = decodeMidtransMeta(pembayaran.catatan_settlement);
  if (!meta) return true;
  const status = meta.gateway_status;
  return status === "snap_created" || status === "pending";
}

/** Batalkan percobaan Snap yang belum selesai (tutup modal / error simulator). */
export const abortSnapPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pesanan_id } = req.params;

    const pesanan = await getUserPesanan(pesanan_id, userId);
    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (pesanan.status !== "pending") {
      return res.status(400).json({ message: "Pesanan tidak dapat diubah" });
    }

    if (!isAbortableSnapAttempt(pesanan.pembayaran)) {
      return res.status(400).json({
        message: "Pembayaran sudah diproses di gateway atau tidak dapat dibatalkan",
      });
    }

    await prisma.pembayaran.delete({
      where: { id: pesanan.pembayaran.id },
    });

    res.json({ message: "Percobaan pembayaran dibatalkan. Silakan pilih metode lain." });
  } catch (error) {
    console.error("[pembayaran/abort]", error.message);
    res.status(500).json({ message: "Gagal membatalkan pembayaran" });
  }
};

/** Tandai pembayaran online sedang menunggu konfirmasi gateway (Snap onPending). */
export const markGatewayAwaiting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pesanan_id } = req.params;

    const pesanan = await getUserPesanan(pesanan_id, userId);
    if (!pesanan?.pembayaran) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    const { pembayaran } = pesanan;
    if (
      pembayaran.status !== "menunggu" ||
      !ONLINE_METODE.includes(pembayaran.metode)
    ) {
      return res.status(400).json({ message: "Status pembayaran tidak valid" });
    }

    const meta = decodeMidtransMeta(pembayaran.catatan_settlement) || {};
    await prisma.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        catatan_settlement: encodeMidtransMeta({
          orderId: meta.order_id || buildOrderId(pesanan_id),
          gatewayStatus: "awaiting_settlement",
          paymentType: meta.payment_type,
          statusMessage: meta.status_message,
        }),
      },
    });

    res.json({ message: "Pembayaran menunggu konfirmasi gateway" });
  } catch (error) {
    console.error("[pembayaran/awaiting]", error.message);
    res.status(500).json({ message: "Gagal memperbarui status pembayaran" });
  }
};
