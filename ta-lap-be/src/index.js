import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import lapanganRoutes from "./routes/lapanganRoutes.js";
import pesananRoutes from "./routes/pesananRoutes.js";
import pembayaranRoutes from "./routes/pembayaranRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import laporanRoutes from "./routes/laporanRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/lapangan", lapanganRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/pembayaran", pembayaranRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/laporan", laporanRoutes);

app.get("/", (req, res) => {
  res.send("API berjalan...");
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
