import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || "").trim();
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();

  if (!host || !user || !pass) return null;

  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  };
}

export function isEmailConfigured() {
  return getSmtpConfig() !== null;
}

function getMailFrom() {
  return (
    process.env.MAIL_FROM?.trim() ||
    `"TA-LAP" <${process.env.SMTP_USER || "noreply@talap.local"}>`
  );
}

function getFrontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
}

let transporterPromise = null;

async function getTransporter() {
  const config = getSmtpConfig();
  if (!config) return null;

  if (!transporterPromise) {
    transporterPromise = nodemailer.createTransport(config);
  }

  return transporterPromise;
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const subject = "Reset Password TA-LAP";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="color:#0891b2;margin:0 0 16px">Reset Password TA-LAP</h2>
      <p>Halo ${name || "Pengguna"},</p>
      <p>Kami menerima permintaan reset password untuk akun TA-LAP Anda.</p>
      <p style="margin:24px 0">
        <a href="${resetUrl}" style="background:#0891b2;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
      </p>
      <p style="font-size:13px;color:#666">Link berlaku 1 jam. Jika Anda tidak meminta reset, abaikan email ini.</p>
      <p style="font-size:12px;color:#999;word-break:break-all">${resetUrl}</p>
    </div>
  `;
  const text = `Reset password TA-LAP\n\nBuka link berikut (berlaku 1 jam):\n${resetUrl}`;

  const transporter = await getTransporter();

  if (!transporter) {
    console.warn("[email] SMTP belum dikonfigurasi. Link reset password:");
    console.warn(resetUrl);
    return { sent: false, devLink: resetUrl };
  }

  await transporter.sendMail({
    from: getMailFrom(),
    to,
    subject,
    text,
    html,
  });

  return { sent: true };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendTransactionalEmail({
  to,
  name,
  subject,
  title,
  message,
  actionUrl,
  actionLabel = "Buka TA-LAP",
}) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeName = escapeHtml(name || "Pengguna");
  const safeActionUrl = escapeHtml(actionUrl);
  const safeActionLabel = escapeHtml(actionLabel);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="color:#0891b2;margin:0 0 16px">${safeTitle}</h2>
      <p>Halo ${safeName},</p>
      <p style="line-height:1.6;color:#333">${safeMessage}</p>
      <p style="margin:24px 0">
        <a href="${safeActionUrl}" style="background:#0891b2;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          ${safeActionLabel}
        </a>
      </p>
      <p style="font-size:12px;color:#999">Email otomatis dari TA-LAP. Anda menerima ini karena ada aktivitas di akun Anda.</p>
    </div>
  `;
  const text = `${title}\n\nHalo ${name || "Pengguna"},\n\n${message}\n\n${actionUrl}`;

  const transporter = await getTransporter();

  if (!transporter) {
    console.warn("[email] SMTP belum dikonfigurasi. Notifikasi:");
    console.warn(`${title}: ${message}`);
    console.warn(actionUrl);
    return { sent: false };
  }

  await transporter.sendMail({
    from: getMailFrom(),
    to,
    subject,
    text,
    html,
  });

  return { sent: true };
}

export { getFrontendUrl };
