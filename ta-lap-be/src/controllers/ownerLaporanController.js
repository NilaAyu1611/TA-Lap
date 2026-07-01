import prisma from "../config/prisma.js";
import { formatTransaksi, transaksiInclude } from "../utils/formatTransaksi.js";
import { payoutMenungguWhere } from "../utils/payout.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const ownerPaymentWhere = (ownerId) => ({
  pesanan: { lapangan: { owner_id: BigInt(ownerId) } },
});

const ownerPesananWhere = (ownerId) => ({
  lapangan: { owner_id: BigInt(ownerId) },
});

const groupBulananOwner = (items) => {
  const map = new Map();
  for (const item of items) {
    const date = new Date(item.tanggal_bayar || item.created_at);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const existing = map.get(key) || {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      volume: 0,
      pendapatanOwner: 0,
      komisiPlatform: 0,
      transaksi: 0,
    };
    existing.volume += Number(item.total_bayar || 0);
    existing.pendapatanOwner += Number(item.pendapatan_owner || 0);
    existing.komisiPlatform += Number(item.komisi_platform || 0);
    existing.transaksi += 1;
    map.set(key, existing);
  }
  return Array.from(map.values()).sort(
    (a, b) => b.year - a.year || b.month - a.month
  );
};

const groupTopLapangan = (items) => {
  const map = new Map();
  for (const item of items) {
    const lap = item.pesanan?.lapangan;
    if (!lap) continue;
    const key = String(lap.id);
    const existing = map.get(key) || {
      lapangan_id: key,
      nama: lap.nama,
      jenis: lap.jenis?.nama ?? null,
      booking: 0,
      volume: 0,
      pendapatanOwner: 0,
    };
    existing.booking += 1;
    existing.volume += Number(item.total_bayar || 0);
    existing.pendapatanOwner += Number(item.pendapatan_owner || 0);
    map.set(key, existing);
  }
  return Array.from(map.values()).sort(
    (a, b) => b.pendapatanOwner - a.pendapatanOwner
  );
};

const groupPerMetode = (items) => {
  const map = new Map();
  for (const item of items) {
    const key = item.metode || "unknown";
    const existing = map.get(key) || {
      metode: key,
      count: 0,
      volume: 0,
      pendapatanOwner: 0,
      komisiPlatform: 0,
    };
    existing.count += 1;
    existing.volume += Number(item.total_bayar || 0);
    existing.pendapatanOwner += Number(item.pendapatan_owner || 0);
    existing.komisiPlatform += Number(item.komisi_platform || 0);
    map.set(key, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.volume - a.volume);
};

const groupPerJenis = (items) => {
  const map = new Map();
  for (const item of items) {
    const jenis = item.pesanan?.lapangan?.jenis?.nama || "lainnya";
    const existing = map.get(jenis) || {
      jenis,
      count: 0,
      volume: 0,
      pendapatanOwner: 0,
    };
    existing.count += 1;
    existing.volume += Number(item.total_bayar || 0);
    existing.pendapatanOwner += Number(item.pendapatan_owner || 0);
    map.set(jenis, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.pendapatanOwner - a.pendapatanOwner);
};

export const getLaporanOwnerKeuangan = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "owner") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const ownerId = user.id;
    const payWhere = ownerPaymentWhere(ownerId);
    const orderWhere = ownerPesananWhere(ownerId);
    const successWhere = { ...payWhere, status: "sukses" };

    const [
      ownerProfile,
      setting,
      volumeAgg,
      pendapatanAgg,
      komisiAgg,
      komisiPiutangAgg,
      komisiBelumSetorCount,
      payoutMenungguAgg,
      payoutDicairkanAgg,
      refundAgg,
      potonganAgg,
      bookingSukses,
      pembayaranSukses,
      pembayaranAll,
      totalLapangan,
      lapanganAktif,
      totalPesanan,
      pesananPending,
      pesananDibayar,
      pesananSelesai,
      pesananDibatalkan,
      totalTransaksi,
      transaksiMenunggu,
      transaksiGagalRefund,
      uniqueCustomers,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: BigInt(ownerId) },
        select: { id: true, name: true, email: true, phone: true, city: true },
      }),
      prisma.setting.findFirst({ where: { id: 1 } }),
      prisma.pembayaran.aggregate({
        where: successWhere,
        _sum: { total_bayar: true },
      }),
      prisma.pembayaran.aggregate({
        where: successWhere,
        _sum: { pendapatan_owner: true },
      }),
      prisma.pembayaran.aggregate({
        where: successWhere,
        _sum: { komisi_platform: true },
      }),
      prisma.pembayaran.aggregate({
        where: { ...successWhere, status_komisi: "belum_lunas" },
        _sum: { komisi_platform: true },
      }),
      prisma.pembayaran.count({
        where: { ...successWhere, status_komisi: "belum_lunas" },
      }),
      prisma.pembayaran.aggregate({
        where: { ...payoutMenungguWhere(), ...successWhere },
        _sum: { pendapatan_owner: true },
      }),
      prisma.pembayaran.aggregate({
        where: { ...successWhere, status_payout_owner: "dicairkan" },
        _sum: { pendapatan_owner: true },
      }),
      prisma.pembayaran.aggregate({
        where: { ...payWhere, status: "refund" },
        _sum: { jumlah_refund: true },
      }),
      prisma.pembayaran.aggregate({
        where: { ...payWhere, status: "refund" },
        _sum: { jumlah_potongan: true },
      }),
      prisma.pembayaran.count({ where: successWhere }),
      prisma.pembayaran.findMany({
        where: successWhere,
        select: {
          total_bayar: true,
          pendapatan_owner: true,
          komisi_platform: true,
          metode: true,
          tanggal_bayar: true,
          created_at: true,
          pesanan: {
            include: {
              lapangan: { include: { jenis: true } },
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.pembayaran.findMany({
        where: payWhere,
        select: { status: true },
      }),
      prisma.lapangan.count({ where: { owner_id: BigInt(ownerId) } }),
      prisma.lapangan.count({
        where: { owner_id: BigInt(ownerId), status: true },
      }),
      prisma.pesanan.count({ where: orderWhere }),
      prisma.pesanan.count({ where: { ...orderWhere, status: "pending" } }),
      prisma.pesanan.count({ where: { ...orderWhere, status: "dibayar" } }),
      prisma.pesanan.count({ where: { ...orderWhere, status: "selesai" } }),
      prisma.pesanan.count({ where: { ...orderWhere, status: "dibatalkan" } }),
      prisma.pembayaran.count({ where: payWhere }),
      prisma.pembayaran.count({ where: { ...payWhere, status: "menunggu" } }),
      prisma.pembayaran.count({
        where: { ...payWhere, status: { in: ["gagal", "refund"] } },
      }),
      prisma.pesanan.findMany({
        where: orderWhere,
        select: { user_id: true },
        distinct: ["user_id"],
      }),
    ]);

    const volumeTransaksi = Number(volumeAgg._sum.total_bayar || 0);
    const pendapatanBersih = Number(pendapatanAgg._sum.pendapatan_owner || 0);
    const komisiPlatform = Number(komisiAgg._sum.komisi_platform || 0);
    const komisiBelumSetor = Number(komisiPiutangAgg._sum.komisi_platform || 0);
    const payoutMenunggu = Number(payoutMenungguAgg._sum.pendapatan_owner || 0);
    const payoutDicairkan = Number(payoutDicairkanAgg._sum.pendapatan_owner || 0);
    const totalRefundKeCustomer = Number(refundAgg._sum.jumlah_refund || 0);
    const totalPotonganBatal = Number(potonganAgg._sum.jumlah_potongan || 0);
    const komisiPersen = Number(setting?.komisi_persen ?? 5);
    const batalPotonganPersen = Number(setting?.batal_potongan_persen ?? 25);
    const rataRataTransaksi =
      bookingSukses > 0 ? Math.round(volumeTransaksi / bookingSukses) : 0;

    const transaksiSukses = pembayaranAll.filter((p) => p.status === "sukses").length;

    const bulanan = groupBulananOwner(pembayaranSukses).slice(0, 12);
    const topLapangan = groupTopLapangan(pembayaranSukses).slice(0, 10);
    const perMetode = groupPerMetode(pembayaranSukses);
    const perJenis = groupPerJenis(pembayaranSukses);

    const totalPengeluaran = komisiPlatform + totalRefundKeCustomer;
    const labaBersihEstimasi = pendapatanBersih - komisiBelumSetor;

    res.json(
      serialize({
        generatedAt: new Date().toISOString(),
        owner: {
          id: ownerProfile?.id,
          name: ownerProfile?.name,
          email: ownerProfile?.email,
          phone: ownerProfile?.phone,
          city: ownerProfile?.city,
        },
        komisi_persen: komisiPersen,
        batal_potongan_persen: batalPotonganPersen,
        ringkasan: {
          volumeTransaksi,
          pendapatanBersih,
          komisiPlatform,
          komisiBelumSetor,
          komisiBelumSetorCount,
          payoutMenunggu,
          payoutDicairkan,
          totalRefundKeCustomer,
          totalPotonganBatal,
          labaBersihEstimasi,
          totalBookingSukses: bookingSukses,
          rataRataTransaksi,
          transaksiSukses,
        },
        operasional: {
          totalLapangan,
          lapanganAktif,
          totalPesanan,
          pesananPending,
          pesananDibayar,
          pesananSelesai,
          pesananDibatalkan,
          totalTransaksi,
          transaksiSukses,
          transaksiMenunggu,
          transaksiGagalRefund,
          totalCustomerUnik: uniqueCustomers.length,
        },
        labaRugi: {
          pendapatan: [
            {
              label: "Pendapatan kotor venue (GMV)",
              amount: volumeTransaksi,
              note: "Total pembayaran sukses dari customer",
            },
            {
              label: "Pendapatan bersih owner",
              amount: pendapatanBersih,
              note: `Setelah komisi platform ${komisiPersen}%`,
            },
            {
              label: "Sudah dicairkan ke rekening",
              amount: payoutDicairkan,
            },
            {
              label: "Menunggu pencairan admin",
              amount: payoutMenunggu,
              type: "info",
            },
          ],
          totalPendapatanPotensial: volumeTransaksi,
          totalPendapatanRealisasi: pendapatanBersih,
          pengeluaran: [
            {
              label: "Komisi platform terpotong",
              amount: komisiPlatform,
            },
            {
              label: "Refund ke customer (pembatalan)",
              amount: totalRefundKeCustomer,
            },
            {
              label: "Potongan batal (retensi, tidak refund)",
              amount: totalPotonganBatal,
              note: `Kebijakan potong ${batalPotonganPersen}%`,
              type: "info",
            },
          ],
          totalPengeluaran: komisiPlatform + totalRefundKeCustomer,
          labaBersih: labaBersihEstimasi,
          posisiKeuangan: [
            {
              label: "Komisi tunai belum disetor",
              amount: komisiBelumSetor,
              type: "liability",
            },
            {
              label: "Pendapatan menunggu cair",
              amount: payoutMenunggu,
              type: "liability",
            },
            {
              label: "Pendapatan sudah dicairkan",
              amount: payoutDicairkan,
              type: "info",
            },
          ],
        },
        breakdown: {
          pemasukan: [
            {
              label: "Volume transaksi (GMV)",
              amount: volumeTransaksi,
              type: "income",
            },
            {
              label: "Pendapatan bersih owner",
              amount: pendapatanBersih,
              type: "income",
            },
            {
              label: "Payout sudah dicairkan",
              amount: payoutDicairkan,
              type: "info",
            },
          ],
          pengeluaran: [
            {
              label: "Komisi platform",
              amount: komisiPlatform,
              type: "expense",
            },
            {
              label: "Refund customer",
              amount: totalRefundKeCustomer,
              type: "expense",
            },
            {
              label: "Komisi belum setor (tunai)",
              amount: komisiBelumSetor,
              type: "liability",
            },
          ],
          kewajiban: [
            {
              label: "Menunggu pencairan",
              amount: payoutMenunggu,
              type: "liability",
            },
            {
              label: "Komisi tunai belum setor",
              amount: komisiBelumSetor,
              type: "liability",
            },
          ],
        },
        bulanan,
        topLapangan,
        perMetode,
        perJenis,
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLaporanOwnerTransaksi = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "owner") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const data = await prisma.pembayaran.findMany({
      where: ownerPaymentWhere(user.id),
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
