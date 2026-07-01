import prisma from "../config/prisma.js";
import { formatTransaksi, transaksiInclude } from "../utils/formatTransaksi.js";
import { payoutMenungguWhere } from "../utils/payout.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const successPaymentWhere = { status: "sukses" };

export const getLaporanKeuangan = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const [
      volumeAgg,
      komisiTerkumpulAgg,
      komisiPiutangAgg,
      refundAgg,
      payoutMenungguAgg,
      payoutDicairkanAgg,
      bookingSukses,
      komisiBelumLunasCount,
      pengeluaranManualAgg,
      pembayaranSukses,
      pengeluaranList,
      setting,
      totalUsers,
      totalOwners,
      totalLapangan,
      lapanganAktif,
      totalPesanan,
      pesananPending,
      pesananDibayar,
      pesananSelesai,
      pesananDibatalkan,
      totalTransaksi,
      transaksiMenunggu,
      transaksiGagal,
    ] = await Promise.all([
      prisma.pembayaran.aggregate({
        where: successPaymentWhere,
        _sum: { total_bayar: true },
      }),
      prisma.pembayaran.aggregate({
        where: {
          ...successPaymentWhere,
          status_komisi: { in: ["terpotong", "lunas"] },
        },
        _sum: { komisi_platform: true },
      }),
      prisma.pembayaran.aggregate({
        where: {
          ...successPaymentWhere,
          status_komisi: "belum_lunas",
        },
        _sum: { komisi_platform: true },
      }),
      prisma.pembayaran.aggregate({
        where: { status: "refund" },
        _sum: { total_bayar: true },
      }),
      prisma.pembayaran.aggregate({
        where: payoutMenungguWhere(),
        _sum: { pendapatan_owner: true },
      }),
      prisma.pembayaran.aggregate({
        where: {
          ...successPaymentWhere,
          status_payout_owner: "dicairkan",
        },
        _sum: { pendapatan_owner: true },
      }),
      prisma.pembayaran.count({ where: successPaymentWhere }),
      prisma.pembayaran.count({
        where: { status_komisi: "belum_lunas", status: "sukses" },
      }),
      prisma.pengeluaranPlatform.aggregate({ _sum: { jumlah: true } }),
      prisma.pembayaran.findMany({
        where: successPaymentWhere,
        select: {
          komisi_platform: true,
          total_bayar: true,
          tanggal_bayar: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.pengeluaranPlatform.findMany({
        orderBy: { tanggal: "desc" },
      }),
      prisma.setting.findFirst({ where: { id: 1 } }),
      prisma.user.count({ where: { role: "user" } }),
      prisma.user.count({ where: { role: "owner" } }),
      prisma.lapangan.count(),
      prisma.lapangan.count({ where: { status: true } }),
      prisma.pesanan.count(),
      prisma.pesanan.count({ where: { status: "pending" } }),
      prisma.pesanan.count({ where: { status: "dibayar" } }),
      prisma.pesanan.count({ where: { status: "selesai" } }),
      prisma.pesanan.count({ where: { status: "dibatalkan" } }),
      prisma.pembayaran.count(),
      prisma.pembayaran.count({ where: { status: "menunggu" } }),
      prisma.pembayaran.count({
        where: { status: { in: ["gagal", "refund"] } },
      }),
    ]);

    const volumeTransaksi = Number(volumeAgg._sum.total_bayar || 0);
    const pendapatanAdmin = Number(komisiTerkumpulAgg._sum.komisi_platform || 0);
    const piutangKomisi = Number(komisiPiutangAgg._sum.komisi_platform || 0);
    const pengeluaranRefund = Number(refundAgg._sum.total_bayar || 0);
    const pengeluaranOperasional = Number(pengeluaranManualAgg._sum.jumlah || 0);
    const totalPengeluaran = pengeluaranRefund + pengeluaranOperasional;
    const labaBersih = pendapatanAdmin - totalPengeluaran;
    const kewajibanPayout = Number(payoutMenungguAgg._sum.pendapatan_owner || 0);
    const payoutDicairkan = Number(payoutDicairkanAgg._sum.pendapatan_owner || 0);
    const komisiPersen = Number(setting?.komisi_persen ?? 5);
    const totalPemasukanPotensial = pendapatanAdmin + piutangKomisi;

    const bulananMap = new Map();
    for (const item of pembayaranSukses) {
      const date = new Date(item.tanggal_bayar || item.created_at);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const existing = bulananMap.get(key) || {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        volume: 0,
        pemasukan: 0,
        transaksi: 0,
      };
      existing.volume += Number(item.total_bayar || 0);
      existing.pemasukan += Number(item.komisi_platform || 0);
      existing.transaksi += 1;
      bulananMap.set(key, existing);
    }

    const bulanan = Array.from(bulananMap.values())
      .sort((a, b) => b.year - a.year || b.month - a.month)
      .slice(0, 12);

    res.json(
      serialize({
        generatedAt: new Date().toISOString(),
        komisi_persen: komisiPersen,
        operasional: {
          totalUsers,
          totalOwners,
          totalLapangan,
          lapanganAktif,
          totalPesanan,
          pesananPending,
          pesananDibayar,
          pesananSelesai,
          pesananDibatalkan,
          totalTransaksi,
          transaksiSukses: bookingSukses,
          transaksiMenunggu,
          transaksiGagal,
        },
        ringkasan: {
          volumeTransaksi,
          pendapatanAdmin,
          piutangKomisi,
          totalPemasukanPotensial,
          pengeluaranRefund,
          pengeluaranOperasional,
          totalPengeluaran,
          labaBersih,
          kewajibanPayout,
          payoutDicairkan,
          totalBookingSukses: bookingSukses,
          ownerBelumBayarKomisi: komisiBelumLunasCount,
        },
        labaRugi: {
          pendapatan: [
            {
              label: "Komisi platform terkumpul",
              amount: pendapatanAdmin,
              note: "QRIS / Transfer / E-Wallet terpotong otomatis + tunai sudah disetor",
            },
            {
              label: "Piutang komisi (tunai belum disetor owner)",
              amount: piutangKomisi,
              note: "Belum masuk laba — dicatat sebagai piutang",
              isReceivable: true,
            },
          ],
          totalPendapatanRealisasi: pendapatanAdmin,
          totalPendapatanPotensial: totalPemasukanPotensial,
          pengeluaran: [
            {
              label: "Refund ke pelanggan",
              amount: pengeluaranRefund,
            },
            {
              label: "Biaya operasional platform",
              amount: pengeluaranOperasional,
            },
          ],
          totalPengeluaran,
          labaBersih,
          posisiKeuangan: [
            {
              label: "Kewajiban payout owner (belum dicairkan)",
              amount: kewajibanPayout,
              type: "liability",
            },
            {
              label: "Payout owner sudah dicairkan",
              amount: payoutDicairkan,
              type: "info",
            },
            {
              label: "Volume transaksi bruto (GMV)",
              amount: volumeTransaksi,
              type: "info",
            },
          ],
        },
        breakdown: {
          pemasukan: [
            {
              label: "Komisi terkumpul (QRIS/Transfer/Lunas)",
              amount: pendapatanAdmin,
              type: "income",
            },
            {
              label: "Piutang komisi owner (Tunai belum setor)",
              amount: piutangKomisi,
              type: "receivable",
            },
          ],
          pengeluaran: [
            {
              label: "Refund ke customer",
              amount: pengeluaranRefund,
              type: "expense",
            },
            {
              label: "Biaya operasional platform",
              amount: pengeluaranOperasional,
              type: "expense",
            },
          ],
          kewajiban: [
            {
              label: "Payout owner belum dicairkan",
              amount: kewajibanPayout,
              type: "liability",
            },
            {
              label: "Payout owner sudah dicairkan",
              amount: payoutDicairkan,
              type: "info",
            },
          ],
        },
        bulanan,
        pengeluaran: pengeluaranList.map((item) => ({
          id: item.id,
          kategori: item.kategori,
          deskripsi: item.deskripsi,
          jumlah: item.jumlah,
          tanggal: item.tanggal,
        })),
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLaporanTransaksi = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const data = await prisma.pembayaran.findMany({
      include: transaksiInclude,
      orderBy: { created_at: "desc" },
    });

    res.json(
      serialize({
        total: data.length,
        data: data.map(formatTransaksi),
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendapatanBulanan = async (req, res) => {
  try {
    const data = await prisma.pembayaran.findMany({
      where: { status: "sukses" },
      select: {
        total_bayar: true,
        komisi_platform: true,
        tanggal_bayar: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json(serialize(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPengeluaran = async (req, res) => {
  try {
    const { kategori, deskripsi, jumlah, tanggal } = req.body;

    if (!deskripsi || !jumlah) {
      return res.status(400).json({
        message: "Deskripsi dan jumlah wajib diisi",
      });
    }

    const item = await prisma.pengeluaranPlatform.create({
      data: {
        kategori: kategori || "operasional",
        deskripsi,
        jumlah: Number(jumlah),
        tanggal: tanggal ? new Date(tanggal) : new Date(),
      },
    });

    res.status(201).json({
      message: "Pengeluaran berhasil dicatat",
      data: serialize(item),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePengeluaran = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pengeluaranPlatform.delete({
      where: { id: BigInt(id) },
    });
    res.json({ message: "Pengeluaran dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
