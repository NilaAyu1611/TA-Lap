import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath, override: true });

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import lapanganRoutes from "./routes/lapanganRoutes.js";
import pesananRoutes from "./routes/pesananRoutes.js";
import pembayaranRoutes from "./routes/pembayaranRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import laporanRoutes from "./routes/laporanRoutes.js";
import jenisRoutes from "./routes/jenisRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import ownerProfileRoutes from "./routes/ownerProfileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { processBookingPaymentReminders } from "./services/bookingPaymentReminderService.js";
import { getMidtransConfig, verifyMidtransCredentials } from "./services/payment/midtransService.js";
import { getTomtomConfig } from "./services/tomtomService.js";

const app = express();

const corsOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/[\w-]+\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }
      callback(null, true);
    },
  })
);
app.use(express.json({ limit: "3mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const midtransBoot = getMidtransConfig();
if (!midtransBoot.enabled) {
  console.warn(
    `[midtrans] Payment gateway nonaktif (${midtransBoot.configIssue || "unknown"}). Online payment disabled until .env keys are set.`
  );
} else {
  verifyMidtransCredentials()
    .then((ok) => {
      if (!ok) {
        const envHint =
          midtransBoot.inferredProduction === true &&
          !midtransBoot.envProductionFlag
            ? " Kunci format production (Mid-server) — sistem sudah auto-detect ke API production."
            : midtransBoot.inferredProduction === false
              ? " Pastikan kunci sandbox (SB-Mid-server) dari dashboard.sandbox.midtrans.com."
              : "";
        console.warn(
          `[midtrans] Kunci ditolak API Midtrans.${envHint}`
        );
      } else {
        console.log(
          `[midtrans] Kredensial ${midtransBoot.isProduction ? "production" : "sandbox"} terverifikasi.`
        );
      }
    })
    .catch(() => {});
}

const tomtomBoot = getTomtomConfig();
if (!tomtomBoot.enabled) {
  console.warn(
    "[tomtom] Autocomplete lokasi nonaktif. Isi TOMTOM_API_KEY di ta-lap-be/.env lalu restart server."
  );
} else {
  console.log("[tomtom] Search API aktif.");
}

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/lapangan", lapanganRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/pembayaran", pembayaranRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/jenis", jenisRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/owner/profile", ownerProfileRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("API berjalan...");
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);

  const REMINDER_INTERVAL_MS = 60 * 1000;
  setInterval(() => {
    processBookingPaymentReminders().catch((err) => {
      console.error("[booking-reminder]", err.message);
    });
  }, REMINDER_INTERVAL_MS);

  processBookingPaymentReminders().catch((err) => {
    console.error("[booking-reminder:init]", err.message);
  });
});
