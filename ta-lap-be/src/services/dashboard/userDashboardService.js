import prisma from "../../config/prisma.js";
import { unpaidPesananWhere } from "../bookingPaymentReminderService.js";

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

const userOrderWhere = (userId) => ({
  user_id: BigInt(userId),
});

const userPayWhere = (userId) => ({
  pesanan: { user_id: BigInt(userId) },
});

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const groupBulanan = (pesananList, pembayaranSukses) => {
  const map = new Map();

  for (const item of pesananList) {
    const date = new Date(item.created_at);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const existing = map.get(key) || {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
      pengeluaran: 0,
      booking: 0,
    };
    existing.booking += 1;
    map.set(key, existing);
  }

  for (const pay of pembayaranSukses) {
    const date = new Date(pay.tanggal_bayar || pay.created_at);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const existing = map.get(key) || {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
      pengeluaran: 0,
      booking: 0,
    };
    existing.pengeluaran += Number(pay.total_bayar || 0);
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
      total: 0,
    };
    existing.count += 1;
    existing.total += Number(item.total_bayar || 0);
    map.set(key, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
};

const groupTopLapangan = (pesananList) => {
  const map = new Map();
  for (const item of pesananList) {
    const lap = item.lapangan;
    if (!lap) continue;
    const key = String(lap.id);
    const existing = map.get(key) || {
      id: key,
      nama: lap.nama,
      jenis: lap.jenis?.nama ?? null,
      kota: lap.kota ?? null,
      booking: 0,
      total: 0,
    };
    existing.booking += 1;
    existing.total += Number(item.total_harga || 0);
    map.set(key, existing);
  }
  return Array.from(map.values())
    .sort((a, b) => b.booking - a.booking)
    .slice(0, 5);
};

const groupPerJenis = (pesananList) => {
  const map = new Map();
  for (const item of pesananList) {
    const jenis = item.lapangan?.jenis?.nama || "Lainnya";
    const existing = map.get(jenis) || { jenis, count: 0 };
    existing.count += 1;
    map.set(jenis, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
};

const formatBooking = (item) => ({
  id: String(item.id),
  kode_booking: item.kode_booking,
  status: item.status,
  tanggal_booking: item.tanggal_booking,
  jam_mulai: item.jam_mulai,
  jam_selesai: item.jam_selesai,
  total_harga: Number(item.total_harga),
  lapangan_id: item.lapangan_id ? String(item.lapangan_id) : null,
  lapangan_nama: item.lapangan?.nama ?? null,
  lapangan_jenis: item.lapangan?.jenis?.nama ?? null,
  lapangan_kota: item.lapangan?.kota ?? null,
  lapangan_gambar: item.lapangan?.gambar ?? null,
  pembayaran_status: item.pembayaran?.status ?? null,
  pembayaran_metode: item.pembayaran?.metode ?? null,
});

export const buildUserDashboard = async (userId) => {
  const userBigInt = BigInt(userId);
  const orderWhere = userOrderWhere(userId);
  const payWhere = userPayWhere(userId);
  const successPayWhere = { ...payWhere, status: "sukses" };

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
    userProfile,
    setting,
    totalLapanganTersedia,
    totalBooking,
    bookingBulanIni,
    bookingBulanLalu,
    bookingHariIni,
    bookingMendatang,
    pesananStatusGroups,
    menungguBayar,
    pembayaranMenunggu,
    pengeluaranAgg,
    pengeluaranBulanIniAgg,
    pengeluaranBulanLaluAgg,
    bookingSelesai,
    bookingDibatalkan,
    allPesanan,
    pembayaranSukses,
    upcomingPesanan,
    recentPesanan,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userBigInt },
      select: { id: true, name: true, email: true, city: true, created_at: true },
    }),
    prisma.setting.findFirst({ where: { id: 1 } }),
    prisma.lapangan.count({ where: { status: true } }),
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
        status: { not: "dibatalkan" },
      },
    }),
    prisma.pesanan.count({
      where: {
        ...orderWhere,
        tanggal_booking: { gte: todayStart },
        status: { in: ["pending", "dibayar"] },
      },
    }),
    prisma.pesanan.groupBy({
      by: ["status"],
      where: orderWhere,
      _count: { _all: true },
    }),
    prisma.pesanan.count({
      where: unpaidPesananWhere(orderWhere),
    }),
    prisma.pembayaran.count({
      where: { ...payWhere, status: "menunggu" },
    }),
    prisma.pembayaran.aggregate({
      where: successPayWhere,
      _sum: { total_bayar: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successPayWhere,
        tanggal_bayar: { gte: monthStart },
      },
      _sum: { total_bayar: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successPayWhere,
        tanggal_bayar: { gte: lastMonthStart, lt: lastMonthEnd },
      },
      _sum: { total_bayar: true },
    }),
    prisma.pesanan.count({
      where: { ...orderWhere, status: "selesai" },
    }),
    prisma.pesanan.count({
      where: { ...orderWhere, status: "dibatalkan" },
    }),
    prisma.pesanan.findMany({
      where: orderWhere,
      include: {
        lapangan: { include: { jenis: true } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.pembayaran.findMany({
      where: successPayWhere,
      select: {
        total_bayar: true,
        metode: true,
        tanggal_bayar: true,
        created_at: true,
      },
      orderBy: { tanggal_bayar: "desc" },
    }),
    prisma.pesanan.findMany({
      where: {
        ...orderWhere,
        tanggal_booking: { gte: todayStart },
        status: { in: ["pending", "dibayar", "selesai"] },
      },
      include: {
        lapangan: { include: { jenis: true } },
        pembayaran: { select: { status: true, metode: true } },
      },
      orderBy: [{ tanggal_booking: "asc" }, { jam_mulai: "asc" }],
      take: 5,
    }),
    prisma.pesanan.findMany({
      where: orderWhere,
      include: {
        lapangan: { include: { jenis: true } },
        pembayaran: { select: { status: true, metode: true } },
      },
      orderBy: { created_at: "desc" },
      take: 6,
    }),
  ]);

  const totalPengeluaran = Number(pengeluaranAgg._sum.total_bayar || 0);
  const pengeluaranBulanIni = Number(
    pengeluaranBulanIniAgg._sum.total_bayar || 0
  );
  const pengeluaranBulanLalu = Number(
    pengeluaranBulanLaluAgg._sum.total_bayar || 0
  );

  const bookingGrowth =
    bookingBulanLalu > 0
      ? Math.round(((bookingBulanIni - bookingBulanLalu) / bookingBulanLalu) * 100)
      : bookingBulanIni > 0
        ? 100
        : 0;

  const pengeluaranGrowth =
    pengeluaranBulanLalu > 0
      ? Math.round(
          ((pengeluaranBulanIni - pengeluaranBulanLalu) / pengeluaranBulanLalu) *
            100
        )
      : pengeluaranBulanIni > 0
        ? 100
        : 0;

  const bulanan = groupBulanan(allPesanan, pembayaranSukses).slice(-6);
  const perMetode = groupPerMetode(pembayaranSukses);
  const topLapangan = groupTopLapangan(allPesanan);
  const perJenis = groupPerJenis(allPesanan);

  const bookingStatus = pesananStatusGroups.map((row) => ({
    status: row.status,
    count: row._count._all,
  }));

  const avgPerBooking =
    totalBooking > 0 ? Math.round(totalPengeluaran / totalBooking) : 0;

  return {
    generatedAt: now.toISOString(),
    maintenance_mode: Boolean(setting?.maintenance_mode),
    user: {
      id: String(userProfile?.id ?? userId),
      name: userProfile?.name ?? "User",
      email: userProfile?.email ?? "",
      city: userProfile?.city ?? null,
      memberSince: userProfile?.created_at ?? null,
    },
    stats: {
      totalBooking,
      bookingBulanIni,
      bookingGrowth,
      bookingHariIni,
      bookingMendatang,
      bookingSelesai,
      bookingDibatalkan,
      menungguBayar,
      pembayaranMenunggu,
      totalPengeluaran,
      pengeluaranBulanIni,
      pengeluaranGrowth,
      avgPerBooking,
      totalLapanganTersedia,
    },
    charts: {
      bulanan,
      bookingStatus,
      perMetode,
      topLapangan,
      perJenis,
    },
    upcomingBookings: upcomingPesanan.map(formatBooking),
    recentBookings: recentPesanan.map(formatBooking),
  };
};
