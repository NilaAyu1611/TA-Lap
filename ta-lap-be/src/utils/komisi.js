import prisma from "../config/prisma.js";

export async function getKomisiPersen() {
  const setting = await prisma.setting.findFirst({ where: { id: 1 } });
  return Number(setting?.komisi_persen ?? 5);
}

export function hitungKomisi(totalBayar, persen = 5) {
  const amount = Number(totalBayar);
  const rate = Number(persen);
  const komisiPlatform = Math.round(amount * (rate / 100));
  const pendapatanOwner = amount - komisiPlatform;

  return {
    komisi_persen: Math.round(rate),
    komisi_platform: komisiPlatform,
    pendapatan_owner: pendapatanOwner,
  };
}

export function resolveStatusKomisi(metode, payStatus) {
  if (payStatus !== "sukses") return "terpotong";
  if (metode === "cash") return "belum_lunas";
  return "terpotong";
}

export function buildPembayaranKomisiData(totalBayar, metode, payStatus, persen) {
  const komisi = hitungKomisi(totalBayar, persen);
  const isCashSuccess = metode === "cash" && payStatus === "sukses";
  const isOnlineSuccess = payStatus === "sukses" && metode !== "cash";

  return {
    ...komisi,
    status_komisi: resolveStatusKomisi(metode, payStatus),
    // Cash: owner sudah terima uang langsung — tidak perlu transfer platform
    // Online sukses: menunggu transfer manual admin ke owner
    status_payout_owner: isCashSuccess
      ? "dicairkan"
      : isOnlineSuccess
        ? "menunggu"
        : "menunggu",
  };
}

/** Hitung ulang komisi 5% per transaksi/booking (bukan per lapangan). */
export async function buildKomisiUpdateForPembayaran(
  totalBayar,
  metode,
  payStatus
) {
  const persen = await getKomisiPersen();
  return buildPembayaranKomisiData(totalBayar, metode, payStatus, persen);
}
