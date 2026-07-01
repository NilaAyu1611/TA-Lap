import prisma from "../config/prisma.js";
import { getKomisiPersen, hitungKomisi } from "./komisi.js";

export const CANCELLABLE_PESANAN_STATUSES = ["pending", "dibayar"];

export async function getBatalPotonganPersen() {
  const setting = await prisma.setting.findFirst({ where: { id: 1 } });
  return Number(setting?.batal_potongan_persen ?? 25);
}

export function hitungRefundBatal(totalBayar, potonganPersen = 25) {
  const total = Math.round(Number(totalBayar));
  const rate = Math.min(100, Math.max(0, Number(potonganPersen)));
  const jumlahPotongan = Math.round(total * (rate / 100));
  const jumlahRefund = Math.max(0, total - jumlahPotongan);

  return {
    potongan_persen: rate,
    refund_persen: 100 - rate,
    jumlah_potongan: jumlahPotongan,
    jumlah_refund: jumlahRefund,
  };
}

export async function buildKebijakanBatal() {
  const potongan_persen = await getBatalPotonganPersen();
  const refund_persen = 100 - potongan_persen;

  return {
    potongan_persen,
    refund_persen,
    deskripsi: `Potongan ${potongan_persen}% hanya berlaku jika booking sudah dibayar (pembayaran sukses) lalu dibatalkan — sisa ${refund_persen}% dikembalikan ke customer. Pembatalan sebelum pembayaran sukses tidak dikenakan potongan.`,
  };
}

/**
 * Batalkan pesanan + proses refund parsial jika sudah dibayar sukses.
 * Potongan (mis. 25%) tetap di sistem; komisi platform dihitung ulang dari nilai potongan.
 */
export async function processPesananCancellation(
  pesanan,
  { alasan = null, actorRole = "user" } = {},
  tx = prisma
) {
  if (pesanan.status === "dibatalkan") {
    throw new Error("Pesanan sudah dibatalkan");
  }

  if (!CANCELLABLE_PESANAN_STATUSES.includes(pesanan.status)) {
    throw new Error(
      `Pesanan berstatus "${pesanan.status}" tidak dapat dibatalkan`
    );
  }

  const potonganPersen = await getBatalPotonganPersen();
  const pembayaran = pesanan.pembayaran
    ? pesanan.pembayaran
    : await tx.pembayaran.findUnique({
        where: { pesanan_id: pesanan.id },
      });

  let refundInfo = null;

  if (pembayaran?.status === "sukses") {
    const breakdown = hitungRefundBatal(pembayaran.total_bayar, potonganPersen);
    const komisiPersen = await getKomisiPersen();
    const komisiRetained = hitungKomisi(breakdown.jumlah_potongan, komisiPersen);

    const refundReason =
      alasan?.trim() ||
      `Pembatalan booking — potongan ${breakdown.potongan_persen}% (oleh ${actorRole})`;

    await tx.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        status: "refund",
        jumlah_refund: breakdown.jumlah_refund,
        jumlah_potongan: breakdown.jumlah_potongan,
        refund_reason: refundReason,
        komisi_persen: komisiRetained.komisi_persen,
        komisi_platform: komisiRetained.komisi_platform,
        pendapatan_owner: komisiRetained.pendapatan_owner,
        status_komisi:
          pembayaran.metode === "cash" ? "belum_lunas" : "terpotong",
        status_payout_owner: "menunggu",
      },
    });

    refundInfo = breakdown;
  } else if (pembayaran) {
    await tx.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        status: pembayaran.status === "menunggu" ? "gagal" : pembayaran.status,
        refund_reason: alasan?.trim() || "Pesanan dibatalkan sebelum pembayaran sukses",
        jumlah_refund: 0,
        jumlah_potongan: 0,
      },
    });
  }

  const updated = await tx.pesanan.update({
    where: { id: pesanan.id },
    data: { status: "dibatalkan" },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      lapangan: {
        include: {
          jenis: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      },
      pembayaran: true,
    },
  });

  return { pesanan: updated, refundInfo, potongan_persen: potonganPersen };
}
