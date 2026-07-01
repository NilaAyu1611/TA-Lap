import prisma from "../../config/prisma.js";
import { payoutMenungguWhere } from "../../utils/payout.js";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const ownerPayWhere = (ownerId) => ({
  pesanan: { lapangan: { owner_id: BigInt(ownerId) } },
});

const ownerOrderWhere = (ownerId) => ({
  lapangan: { owner_id: BigInt(ownerId) },
});

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const groupBulanan = (items) => {
  const map = new Map();
  for (const item of items) {
    const date = new Date(item.tanggal_bayar || item.created_at);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const existing = map.get(key) || {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
      pendapatan: 0,
      volume: 0,
      booking: 0,
    };
    existing.pendapatan += Number(item.pendapatan_owner || 0);
    existing.volume += Number(item.total_bayar || 0);
    existing.booking += 1;
    map.set(key, existing);
  }
  return Array.from(map.values()).sort(
    (a, b) => a.year - b.year || a.month - b.month
  );
};

const groupPerMetode = (items) => {
  const map = new Map();
  for (const item of items) {
    const key = item.metode || "unknown";
    const existing = map.get(key) || {
      metode: key,
      count: 0,
      pendapatan: 0,
    };
    existing.count += 1;
    existing.pendapatan += Number(item.pendapatan_owner || 0);
    map.set(key, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.pendapatan - a.pendapatan);
};

const groupTopLapangan = (items) => {
  const map = new Map();
  for (const item of items) {
    const lap = item.pesanan?.lapangan;
    if (!lap) continue;
    const key = String(lap.id);
    const existing = map.get(key) || {
      id: key,
      nama: lap.nama,
      jenis: lap.jenis?.nama ?? null,
      booking: 0,
      pendapatan: 0,
    };
    existing.booking += 1;
    existing.pendapatan += Number(item.pendapatan_owner || 0);
    map.set(key, existing);
  }
  return Array.from(map.values())
    .sort((a, b) => b.pendapatan - a.pendapatan)
    .slice(0, 5);
};

export const buildOwnerDashboard = async (ownerId) => {
  const ownerBigInt = BigInt(ownerId);
  const payWhere = ownerPayWhere(ownerId);
  const orderWhere = ownerOrderWhere(ownerId);
  const successWhere = { ...payWhere, status: "sukses" };

  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );
  const lastMonthEnd = monthStart;

  const [
    ownerProfile,
    setting,
    totalLapangan,
    lapanganAktif,
    totalBooking,
    bookingBulanIni,
    bookingBulanLalu,
    bookingHariIni,
    pesananStatusGroups,
    uniqueCustomers,
    pendapatanAgg,
    pendapatanHariIniAgg,
    pendapatanBulanIniAgg,
    pendapatanBulanLaluAgg,
    menungguVerifikasi,
    komisiBelumSetorCount,
    komisiBelumSetorAgg,
    payoutMenunggu,
    pembayaranSukses,
    recentPesanan,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: ownerBigInt },
      select: { id: true, name: true, email: true },
    }),
    prisma.setting.findFirst({ where: { id: 1 } }),
    prisma.lapangan.count({ where: { owner_id: ownerBigInt } }),
    prisma.lapangan.count({
      where: { owner_id: ownerBigInt, status: true },
    }),
    prisma.pesanan.count({ where: orderWhere }),
    prisma.pesanan.count({
      where: { ...orderWhere, created_at: { gte: monthStart } },
    }),
    prisma.pesanan.count({
      where: {
        ...orderWhere,
        created_at: { gte: lastMonthStart, lt: lastMonthEnd },
      },
    }),
    prisma.pesanan.count({
      where: {
        ...orderWhere,
        tanggal_booking: { gte: todayStart, lt: tomorrow },
      },
    }),
    prisma.pesanan.groupBy({
      by: ["status"],
      where: orderWhere,
      _count: { _all: true },
    }),
    prisma.pesanan.findMany({
      where: orderWhere,
      select: { user_id: true },
      distinct: ["user_id"],
    }),
    prisma.pembayaran.aggregate({
      where: successWhere,
      _sum: { pendapatan_owner: true, total_bayar: true, komisi_platform: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: todayStart, lt: tomorrow },
      },
      _sum: { pendapatan_owner: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: monthStart },
      },
      _sum: { pendapatan_owner: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: lastMonthStart, lt: lastMonthEnd },
      },
      _sum: { pendapatan_owner: true },
    }),
    prisma.pembayaran.count({
      where: { ...payWhere, status: "menunggu" },
    }),
    prisma.pembayaran.count({
      where: { ...successWhere, status_komisi: "belum_lunas" },
    }),
    prisma.pembayaran.aggregate({
      where: { ...successWhere, status_komisi: "belum_lunas" },
      _sum: { komisi_platform: true },
    }),
    prisma.pembayaran.count({
      where: { ...payoutMenungguWhere(), ...payWhere },
    }),
    prisma.pembayaran.findMany({
      where: successWhere,
      select: {
        pendapatan_owner: true,
        total_bayar: true,
        metode: true,
        tanggal_bayar: true,
        created_at: true,
        pesanan: {
          select: {
            lapangan: {
              select: { id: true, nama: true, jenis: { select: { nama: true } } },
            },
          },
        },
      },
      orderBy: { tanggal_bayar: "desc" },
    }),
    prisma.pesanan.findMany({
      where: orderWhere,
      include: {
        user: { select: { id: true, name: true, email: true } },
        lapangan: { include: { jenis: true } },
        pembayaran: { select: { status: true, metode: true } },
      },
      orderBy: { created_at: "desc" },
      take: 6,
    }),
  ]);

  const pendapatanBersih = Number(pendapatanAgg._sum.pendapatan_owner || 0);
  const pendapatanHariIni = Number(
    pendapatanHariIniAgg._sum.pendapatan_owner || 0
  );
  const pendapatanBulanIni = Number(
    pendapatanBulanIniAgg._sum.pendapatan_owner || 0
  );
  const pendapatanBulanLalu = Number(
    pendapatanBulanLaluAgg._sum.pendapatan_owner || 0
  );

  const bookingGrowth =
    bookingBulanLalu > 0
      ? Math.round(((bookingBulanIni - bookingBulanLalu) / bookingBulanLalu) * 100)
      : bookingBulanIni > 0
        ? 100
        : 0;

  const pendapatanGrowth =
    pendapatanBulanLalu > 0
      ? Math.round(
          ((pendapatanBulanIni - pendapatanBulanLalu) / pendapatanBulanLalu) * 100
        )
      : pendapatanBulanIni > 0
        ? 100
        : 0;

  const bulanan = groupBulanan(pembayaranSukses).slice(-6);
  const perMetode = groupPerMetode(pembayaranSukses);
  const topLapangan = groupTopLapangan(pembayaranSukses);

  const bookingStatus = pesananStatusGroups.map((row) => ({
    status: row.status,
    count: row._count._all,
  }));

  const komisiPersen = Number(setting?.komisi_persen ?? 5);

  return {
    generatedAt: now.toISOString(),
    komisi_persen: komisiPersen,
    owner: {
      id: String(ownerProfile?.id ?? ownerId),
      name: ownerProfile?.name ?? "Owner",
      email: ownerProfile?.email ?? "",
    },
    stats: {
      totalLapangan,
      lapanganAktif,
      totalBooking,
      bookingBulanIni,
      bookingGrowth,
      bookingHariIni,
      totalPelanggan: uniqueCustomers.length,
      pendapatanBersih,
      pendapatanHariIni,
      pendapatanBulanIni,
      pendapatanGrowth,
      volumeTransaksi: Number(pendapatanAgg._sum.total_bayar || 0),
      komisiPlatform: Number(pendapatanAgg._sum.komisi_platform || 0),
      menungguVerifikasi,
      komisiBelumSetor: komisiBelumSetorCount,
      komisiBelumSetorNominal: Number(
        komisiBelumSetorAgg._sum.komisi_platform || 0
      ),
      payoutMenunggu,
    },
    charts: {
      bulanan,
      perMetode,
      bookingStatus,
      topLapangan,
    },
    recentBookings: recentPesanan.map((item) => ({
      id: String(item.id),
      kode_booking: item.kode_booking,
      status: item.status,
      tanggal_booking: item.tanggal_booking,
      jam_mulai: item.jam_mulai,
      jam_selesai: item.jam_selesai,
      total_harga: Number(item.total_harga),
      user_name: item.user?.name ?? null,
      lapangan_nama: item.lapangan?.nama ?? null,
      lapangan_jenis: item.lapangan?.jenis?.nama ?? null,
      pembayaran_status: item.pembayaran?.status ?? null,
      pembayaran_metode: item.pembayaran?.metode ?? null,
    })),
  };
};
