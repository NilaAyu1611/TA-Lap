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
      volume: 0,
      komisi: 0,
      booking: 0,
    };
    existing.volume += Number(item.total_bayar || 0);
    existing.komisi += Number(item.komisi_platform || 0);
    existing.booking += 1;
    map.set(key, existing);
  }
  return Array.from(map.values()).sort(
    (a, b) => a.year - b.year || a.month - b.month
  );
};

export const buildAdminDashboard = async () => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );
  const lastMonthEnd = monthStart;
  const chartSince = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 5, 1)
  );

  const successWhere = { status: "sukses" };

  const [
    setting,
    totalUsers,
    totalOwners,
    totalLapangan,
    lapanganAktif,
    totalBooking,
    bookingBulanIni,
    bookingBulanLalu,
    bookingHariIni,
    pesananStatusGroups,
    volumeAgg,
    komisiAgg,
    volumeHariIniAgg,
    volumeBulanIniAgg,
    volumeBulanLaluAgg,
    pendingOwnerReview,
    pembayaranMenunggu,
    komisiBelumSetorCount,
    komisiBelumSetorAgg,
    payoutMenunggu,
    pembayaranChartRows,
    metodeGroups,
  ] = await Promise.all([
    prisma.setting.findFirst({ where: { id: 1 } }),
    prisma.user.count({ where: { role: "user", status: "active" } }),
    prisma.user.count({ where: { role: "owner", status: "active" } }),
    prisma.lapangan.count(),
    prisma.lapangan.count({ where: { status: true } }),
    prisma.pesanan.count(),
    prisma.pesanan.count({
      where: { created_at: { gte: monthStart } },
    }),
    prisma.pesanan.count({
      where: {
        created_at: { gte: lastMonthStart, lt: lastMonthEnd },
      },
    }),
    prisma.pesanan.count({
      where: {
        tanggal_booking: { gte: todayStart, lt: tomorrow },
      },
    }),
    prisma.pesanan.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.pembayaran.aggregate({
      where: successWhere,
      _sum: { total_bayar: true, komisi_platform: true },
    }),
    prisma.pembayaran.aggregate({
      where: successWhere,
      _sum: { komisi_platform: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: todayStart, lt: tomorrow },
      },
      _sum: { total_bayar: true, komisi_platform: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: monthStart },
      },
      _sum: { total_bayar: true, komisi_platform: true },
    }),
    prisma.pembayaran.aggregate({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: lastMonthStart, lt: lastMonthEnd },
      },
      _sum: { total_bayar: true, komisi_platform: true },
    }),
    prisma.ownerVerification.count({
      where: {
        status: "pending",
        owner: { role: "owner", status: "pending" },
      },
    }),
    prisma.pembayaran.count({ where: { status: "menunggu" } }),
    prisma.pembayaran.count({
      where: { ...successWhere, status_komisi: "belum_lunas" },
    }),
    prisma.pembayaran.aggregate({
      where: { ...successWhere, status_komisi: "belum_lunas" },
      _sum: { komisi_platform: true },
    }),
    prisma.pembayaran.count({
      where: payoutMenungguWhere(),
    }),
    prisma.pembayaran.findMany({
      where: {
        ...successWhere,
        tanggal_bayar: { gte: chartSince },
      },
      select: {
        total_bayar: true,
        komisi_platform: true,
        tanggal_bayar: true,
        created_at: true,
      },
      orderBy: { tanggal_bayar: "asc" },
    }),
    prisma.pembayaran.groupBy({
      by: ["metode"],
      where: successWhere,
      _count: { _all: true },
      _sum: { total_bayar: true, komisi_platform: true },
    }),
  ]);

  const volumeTransaksi = Number(volumeAgg._sum.total_bayar || 0);
  const komisiPlatform = Number(komisiAgg._sum.komisi_platform || 0);
  const volumeHariIni = Number(volumeHariIniAgg._sum.total_bayar || 0);
  const komisiHariIni = Number(volumeHariIniAgg._sum.komisi_platform || 0);
  const volumeBulanIni = Number(volumeBulanIniAgg._sum.total_bayar || 0);
  const komisiBulanIni = Number(volumeBulanIniAgg._sum.komisi_platform || 0);
  const volumeBulanLalu = Number(volumeBulanLaluAgg._sum.total_bayar || 0);

  const bookingGrowth =
    bookingBulanLalu > 0
      ? Math.round(((bookingBulanIni - bookingBulanLalu) / bookingBulanLalu) * 100)
      : bookingBulanIni > 0
        ? 100
        : 0;

  const volumeGrowth =
    volumeBulanLalu > 0
      ? Math.round(((volumeBulanIni - volumeBulanLalu) / volumeBulanLalu) * 100)
      : volumeBulanIni > 0
        ? 100
        : 0;

  const bulanan = groupBulanan(pembayaranChartRows).slice(-6);
  const perMetode = metodeGroups
    .map((row) => ({
      metode: row.metode || "unknown",
      count: row._count._all,
      volume: Number(row._sum.total_bayar || 0),
      komisi: Number(row._sum.komisi_platform || 0),
    }))
    .sort((a, b) => b.volume - a.volume);

  const bookingStatus = pesananStatusGroups.map((row) => ({
    status: row.status,
    count: row._count._all,
  }));

  const komisiPersen = Number(setting?.komisi_persen ?? 5);

  return {
    generatedAt: now.toISOString(),
    komisi_persen: komisiPersen,
    stats: {
      totalUsers,
      totalOwners,
      totalLapangan,
      lapanganAktif,
      totalBooking,
      bookingBulanIni,
      bookingGrowth,
      bookingHariIni,
      volumeTransaksi,
      komisiPlatform,
      volumeHariIni,
      komisiHariIni,
      volumeBulanIni,
      komisiBulanIni,
      volumeGrowth,
      pendingOwnerReview,
      pembayaranMenunggu,
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
    },
  };
};
