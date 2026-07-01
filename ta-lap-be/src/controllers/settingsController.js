import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serialize.js";
import { notifyAdminsBackup } from "../services/adminNotificationService.js";

const LOGIN_ACTIVITY_TYPES = ["login", "Login"];

const DEFAULT_SETTINGS = {
  id: 1,
  app_name: "TA-LAP",
  app_email: "support@talap.com",
  app_phone: "081234567890",
  komisi_persen: 5,
  batal_potongan_persen: 25,
  timezone: "Asia/Jakarta",
  language: "id",
  maintenance_mode: false,
  booking_notification: true,
  owner_notification: true,
  payment_notification: true,
  backup_notification: true,
  login_notification: true,
  auto_payout_enabled: true,
  platform_bank_code: null,
  platform_bank_account_number: null,
  platform_bank_account_holder: null,
  platform_ewallet_note: null,
};

async function getOrCreateSettings() {
  let settings = await prisma.setting.findFirst({ where: { id: 1 } });

  if (!settings) {
    settings = await prisma.setting.create({
      data: DEFAULT_SETTINGS,
    });
  }

  return settings;
}

function formatSettings(settings) {
  return {
    id: settings.id,
    app_name: settings.app_name,
    app_email: settings.app_email,
    app_phone: settings.app_phone,
    logo: settings.logo,
    favicon: settings.favicon,
    komisi_persen: Number(settings.komisi_persen),
    batal_potongan_persen: Number(settings.batal_potongan_persen ?? 25),
    timezone: settings.timezone,
    language: settings.language,
    maintenance_mode: settings.maintenance_mode,
    booking_notification: settings.booking_notification,
    owner_notification: settings.owner_notification,
    payment_notification: settings.payment_notification,
    backup_notification: settings.backup_notification,
    login_notification: settings.login_notification,
    auto_payout_enabled: settings.auto_payout_enabled ?? true,
    platform_bank_code: settings.platform_bank_code ?? null,
    platform_bank_account_number: settings.platform_bank_account_number ?? null,
    platform_bank_account_holder: settings.platform_bank_account_holder ?? null,
    platform_ewallet_note: settings.platform_ewallet_note ?? null,
  };
}

export const getSettings = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const sessionStartedAt = req.user.iat
      ? new Date(req.user.iat * 1000).toISOString()
      : null;
    const currentIp = req.ip || req.headers["x-forwarded-for"] || null;

    const [settings, profile, loginLogs, backups] = await Promise.all([
      getOrCreateSettings(),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          avatar: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.activityLog.findMany({
        where: {
          user_id: userId,
          activity_type: { in: LOGIN_ACTIVITY_TYPES },
        },
        orderBy: { created_at: "desc" },
        take: 2,
        select: {
          created_at: true,
          ip_address: true,
          device: true,
          activity_type: true,
        },
      }),
      prisma.backupLog.findMany({
        orderBy: { created_at: "desc" },
        take: 10,
      }),
    ]);

    const lastLogin = loginLogs[0] ?? null;
    const previousLogin = loginLogs[1] ?? null;

    res.json(
      serializeBigInt({
        fetchedAt: new Date().toISOString(),
        sessionStartedAt,
        currentIp,
        settings: formatSettings(settings),
        profile,
        lastLogin,
        previousLogin,
        backups,
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      app_name,
      app_email,
      app_phone,
      logo,
      favicon,
      komisi_persen,
      batal_potongan_persen,
      timezone,
      language,
      maintenance_mode,
      booking_notification,
      owner_notification,
      payment_notification,
      backup_notification,
      login_notification,
      auto_payout_enabled,
      platform_bank_code,
      platform_bank_account_number,
      platform_bank_account_holder,
      platform_ewallet_note,
    } = req.body;

    if (app_name !== undefined && !String(app_name).trim()) {
      return res.status(400).json({ message: "Nama platform wajib diisi" });
    }

    if (komisi_persen !== undefined) {
      const komisi = Number(komisi_persen);
      if (Number.isNaN(komisi) || komisi < 0 || komisi > 100) {
        return res.status(400).json({
          message: "Komisi platform harus antara 0–100%",
        });
      }
    }

    if (batal_potongan_persen !== undefined) {
      const potongan = Number(batal_potongan_persen);
      if (Number.isNaN(potongan) || potongan < 0 || potongan > 100) {
        return res.status(400).json({
          message: "Potongan pembatalan harus antara 0–100%",
        });
      }
    }

    await getOrCreateSettings();

    const data = {};
    if (app_name !== undefined) data.app_name = String(app_name).trim();
    if (app_email !== undefined) data.app_email = app_email || null;
    if (app_phone !== undefined) data.app_phone = app_phone || null;
    if (logo !== undefined) data.logo = logo || null;
    if (favicon !== undefined) data.favicon = favicon || null;
    if (komisi_persen !== undefined) data.komisi_persen = Number(komisi_persen);
    if (batal_potongan_persen !== undefined) {
      data.batal_potongan_persen = Number(batal_potongan_persen);
    }
    if (timezone !== undefined) data.timezone = timezone;
    if (language !== undefined) data.language = language;
    if (maintenance_mode !== undefined) data.maintenance_mode = Boolean(maintenance_mode);
    if (booking_notification !== undefined) {
      data.booking_notification = Boolean(booking_notification);
    }
    if (owner_notification !== undefined) {
      data.owner_notification = Boolean(owner_notification);
    }
    if (payment_notification !== undefined) {
      data.payment_notification = Boolean(payment_notification);
    }
    if (backup_notification !== undefined) {
      data.backup_notification = Boolean(backup_notification);
    }
    if (login_notification !== undefined) {
      data.login_notification = Boolean(login_notification);
    }
    if (auto_payout_enabled !== undefined) {
      data.auto_payout_enabled = Boolean(auto_payout_enabled);
    }
    if (platform_bank_code !== undefined) {
      data.platform_bank_code = platform_bank_code?.trim() || null;
    }
    if (platform_bank_account_number !== undefined) {
      data.platform_bank_account_number =
        platform_bank_account_number?.trim() || null;
    }
    if (platform_bank_account_holder !== undefined) {
      data.platform_bank_account_holder =
        platform_bank_account_holder?.trim() || null;
    }
    if (platform_ewallet_note !== undefined) {
      data.platform_ewallet_note = platform_ewallet_note?.trim() || null;
    }

    const updated = await prisma.setting.update({
      where: { id: 1 },
      data,
    });

    res.json({
      message: "Pengaturan berhasil disimpan",
      fetchedAt: new Date().toISOString(),
      settings: formatSettings(updated),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Konfirmasi password tidak cocok",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await prisma.activityLog.create({
      data: {
        user_id: userId,
        activity_type: "password_changed",
        ip_address: req.ip || null,
        device: req.headers["user-agent"] || null,
      },
    });

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { name, phone, city } = req.body;

    const data = {};
    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: "Nama wajib diisi" });
      }
      data.name = String(name).trim();
    }
    if (phone !== undefined) data.phone = phone || null;
    if (city !== undefined) data.city = city || null;

    const profile = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        avatar: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.json({
      message: "Profil admin berhasil diperbarui",
      profile: serializeBigInt(profile),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBackupLogs = async (req, res) => {
  try {
    const backups = await prisma.backupLog.findMany({
      orderBy: { created_at: "desc" },
      take: 20,
    });
    res.json(serializeBigInt({ data: backups }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSystemBackup = async (req, res) => {
  try {
    const [
      settings,
      totalUsers,
      totalOwners,
      totalLapangan,
      totalPesanan,
      totalTransaksi,
    ] = await Promise.all([
      getOrCreateSettings(),
      prisma.user.count({ where: { role: "user" } }),
      prisma.user.count({ where: { role: "owner" } }),
      prisma.lapangan.count(),
      prisma.pesanan.count(),
      prisma.pembayaran.count(),
    ]);

    const timestamp = new Date();
    const fileName = `talap-backup_${timestamp.toISOString().slice(0, 10)}_${String(timestamp.getHours()).padStart(2, "0")}${String(timestamp.getMinutes()).padStart(2, "0")}.json`;

    const payload = serializeBigInt({
      generatedAt: timestamp.toISOString(),
      type: "system_backup",
      settings: formatSettings(settings),
      summary: {
        totalUsers,
        totalOwners,
        totalLapangan,
        totalPesanan,
        totalTransaksi,
      },
    });

    const jsonString = JSON.stringify(payload, null, 2);
    const sizeKb = Math.max(1, Math.round(jsonString.length / 1024));
    const sizeLabel = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)}MB` : `${sizeKb}KB`;

    const backup = await prisma.backupLog.create({
      data: {
        file_name: fileName,
        size: sizeLabel,
        status: "success",
      },
    });

    await notifyAdminsBackup({ success: true, fileName });

    res.json({
      message: "Backup berhasil dibuat",
      backup: serializeBigInt(backup),
      download: payload,
      fileName,
    });
  } catch (error) {
    try {
      await prisma.backupLog.create({
        data: {
          file_name: `backup-failed_${Date.now()}.json`,
          size: "0KB",
          status: "failed",
        },
      });
      await notifyAdminsBackup({ success: false, fileName: "backup-failed" });
    } catch {
      // ignore secondary failure
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPublicSettings = async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      app_name: settings.app_name || "TA-LAP",
      app_email: settings.app_email || null,
      app_phone: settings.app_phone || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
