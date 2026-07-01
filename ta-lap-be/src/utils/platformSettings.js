import prisma from "../config/prisma.js";

export async function getOrCreatePlatformSettings() {
  let settings = await prisma.setting.findFirst({ where: { id: 1 } });

  if (!settings) {
    settings = await prisma.setting.create({
      data: {
        id: 1,
        app_name: "TA-LAP",
        app_email: "support@talap.com",
        app_phone: "081234567890",
      },
    });
  }

  return settings;
}

export async function isMaintenanceMode() {
  const settings = await getOrCreatePlatformSettings();
  return Boolean(settings.maintenance_mode);
}

export async function getKomisiPersenFromSettings() {
  const settings = await getOrCreatePlatformSettings();
  return Number(settings.komisi_persen ?? 5);
}

export async function shouldLogLoginActivity() {
  const settings = await getOrCreatePlatformSettings();
  return settings.login_notification !== false;
}
