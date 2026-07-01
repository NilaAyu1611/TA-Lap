export function inferMidtransProduction(serverKey, clientKey) {
  const serverSandbox = /^SB-Mid-server-/i.test(serverKey);
  const clientSandbox = /^SB-Mid-client-/i.test(clientKey);

  // Prefix SB- = sandbox (format lama Midtrans)
  if (serverSandbox && clientSandbox) return false;

  // Mid- tanpa SB- dipakai sandbox DAN production (UI dashboard.sandbox.midtrans.com
  // juga menampilkan Mid-server-/Mid-client-). Jangan infer — pakai MIDTRANS_IS_PRODUCTION.
  return null;
}

function keysShareSameFormat(serverKey, clientKey) {
  const serverSandbox = /^SB-Mid-server-/i.test(serverKey);
  const clientSandbox = /^SB-Mid-client-/i.test(clientKey);
  if (serverSandbox || clientSandbox) return serverSandbox && clientSandbox;

  const serverMid =
    /^Mid-server-/i.test(serverKey) && !/^SB-Mid-server-/i.test(serverKey);
  const clientMid =
    /^Mid-client-/i.test(clientKey) && !/^SB-Mid-client-/i.test(clientKey);
  return serverMid && clientMid;
}

export function getMidtransConfig() {
  const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
  const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
  const inferred = inferMidtransProduction(serverKey, clientKey);
  const envFlag = process.env.MIDTRANS_IS_PRODUCTION === "true";
  // SB- → sandbox; Mid- → ikuti MIDTRANS_IS_PRODUCTION (.env)
  const isProduction = inferred !== null ? inferred : envFlag;

  let configIssue = resolveMidtransConfigIssue(serverKey, clientKey);
  if (!configIssue && !keysShareSameFormat(serverKey, clientKey)) {
    configIssue = "key_pair_mismatch";
  }

  return {
    serverKey,
    clientKey,
    isProduction,
    inferredProduction: inferred,
    envProductionFlag: envFlag,
    enabled: configIssue === null,
    configIssue,
  };
}

/** null = OK; otherwise human-readable issue code for API/UI */
export function resolveMidtransConfigIssue(serverKey, clientKey) {
  if (!serverKey || !clientKey) return "missing";

  if (isPlaceholderMidtransKey(serverKey) || isPlaceholderMidtransKey(clientKey)) {
    return "placeholder";
  }

  const serverOk = /^SB-Mid-server-/i.test(serverKey) || /^Mid-server-/i.test(serverKey);
  const clientOk = /^SB-Mid-client-/i.test(clientKey) || /^Mid-client-/i.test(clientKey);

  if (!serverOk || !clientOk) return "invalid_format";

  return null;
}

function isPlaceholderMidtransKey(key) {
  const k = String(key || "").trim().toLowerCase();
  if (!k) return true;
  if (/x{4,}/.test(k)) return true;
  if (k.includes("your") || k.includes("ganti") || k.includes("example")) return true;
  return false;
}

const SNAP_URL = {
  sandbox: "https://app.sandbox.midtrans.com/snap/v1/transactions",
  production: "https://app.midtrans.com/snap/v1/transactions",
};

const API_URL = {
  sandbox: "https://api.sandbox.midtrans.com",
  production: "https://api.midtrans.com",
};

function authHeader(serverKey) {
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
}

export async function createSnapTransaction({
  orderId,
  amount,
  customer,
  enabledPayments,
}) {
  const { serverKey, isProduction } = getMidtransConfig();
  if (!serverKey) {
    throw new Error("Midtrans belum dikonfigurasi");
  }

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: customer,
    credit_card: { secure: true },
  };

  if (enabledPayments?.length) {
    payload.enabled_payments = enabledPayments;
  }

  const url = isProduction ? SNAP_URL.production : SNAP_URL.sandbox;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(serverKey),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data?.error_messages?.join(", ") ||
        data?.status_message ||
        "Gagal membuat transaksi Midtrans"
    );
  }

  return data;
}

export async function fetchTransactionStatus(orderId) {
  const { serverKey, isProduction } = getMidtransConfig();
  if (!serverKey) {
    throw new Error("Midtrans belum dikonfigurasi");
  }

  const base = isProduction ? API_URL.production : API_URL.sandbox;
  const response = await fetch(`${base}/v2/${orderId}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader(serverKey),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.status_message || "Gagal cek status transaksi");
  }

  return data;
}

// Midtrans Snap payment channel codes — https://docs.midtrans.com/reference/snap
const QRIS_PAYMENTS = ["other_qris", "gopay"];
const TRANSFER_PAYMENTS = [
  "bca_va",
  "bni_va",
  "bri_va",
  "permata_va",
  "other_va",
  "echannel",
];
const EWALLET_PAYMENTS = [
  "gopay",
  "shopeepay",
  "dana",
  "linkaja",
  "ovo",
  "other_qris",
];

export function getEnabledPayments(channel) {
  // Tampilkan semua metode aktif di dashboard jika tidak ingin filter per channel
  if (process.env.MIDTRANS_SNAP_SHOW_ALL === "true") {
    return undefined;
  }

  switch (channel) {
    case "qris":
      return QRIS_PAYMENTS;
    case "transfer":
      return TRANSFER_PAYMENTS;
    case "ewallet":
      return EWALLET_PAYMENTS;
    default:
      return undefined;
  }
}

export function mapGatewayPaymentType(paymentType = "") {
  const type = paymentType.toLowerCase();
  if (type === "qris") return "qris";
  if (
    ["bank_transfer", "echannel", "permata_va", "bca_va", "bni_va", "bri_va", "other_va"].includes(
      type
    )
  ) {
    return "transfer";
  }
  if (["cash", "cstore"].includes(type)) return "cash";
  return "ewallet";
}

export function mapGatewayStatus(transactionStatus, fraudStatus) {
  const status = (transactionStatus || "").toLowerCase();

  if (["capture", "settlement"].includes(status)) {
    if (fraudStatus === "deny") return "gagal";
    return "sukses";
  }

  if (status === "pending") return "menunggu";
  if (["deny", "expire", "cancel", "failure"].includes(status)) return "gagal";
  if (["refund", "partial_refund"].includes(status)) return "refund";

  return "menunggu";
}

export async function verifyMidtransCredentials() {
  const { enabled } = getMidtransConfig();
  if (!enabled) return false;

  try {
    const snap = await createSnapTransaction({
      orderId: `TALAP-VERIFY-${Date.now()}`,
      amount: 10000,
      customer: {
        first_name: "Verify",
        email: "verify@talap.local",
      },
    });
    return Boolean(snap?.token);
  } catch (error) {
    return !isMidtransAuthError(error.message);
  }
}

export function buildOrderId(pesananId) {
  return `TALAP-${pesananId}-${Date.now()}`;
}

export function isMidtransAuthError(message = "") {
  const msg = message.toLowerCase();
  return (
    msg.includes("access denied") ||
    msg.includes("unauthorized") ||
    msg.includes("unknown merchant") ||
    msg.includes("401")
  );
}
