import prisma from "../config/prisma.js";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function getMonthBounds(year, month) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);
  return { start, end };
}

export function formatMonthLabel(year, month) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}

function cashSuccessInMonthWhere(start, end, extra = {}) {
  return {
    metode: "cash",
    status: "sukses",
    tanggal_bayar: { gte: start, lt: end },
    ...extra,
  };
}

/** Agregasi komisi tunai per bulan (opsional filter owner). */
export async function aggregateMonthCashKomisi(year, month, ownerId = null) {
  const { start, end } = getMonthBounds(year, month);

  const ownerFilter = ownerId
    ? { pesanan: { lapangan: { owner_id: BigInt(ownerId) } } }
    : {};

  const payments = await prisma.pembayaran.findMany({
    where: {
      ...cashSuccessInMonthWhere(start, end),
      ...ownerFilter,
    },
    include: {
      pesanan: {
        include: {
          lapangan: {
            include: {
              owner: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: { tanggal_bayar: "asc" },
  });

  let totalKomisi = 0;
  let totalVolume = 0;
  let komisiBelumSetor = 0;
  let komisiSudahSetor = 0;
  let transaksiBelumSetor = 0;
  const byOwner = new Map();

  for (const payment of payments) {
    const komisi = Number(payment.komisi_platform);
    const volume = Number(payment.total_bayar);
    totalKomisi += komisi;
    totalVolume += volume;

    if (payment.status_komisi === "belum_lunas") {
      komisiBelumSetor += komisi;
      transaksiBelumSetor += 1;
    } else {
      komisiSudahSetor += komisi;
    }

    const owner = payment.pesanan?.lapangan?.owner;
    if (!owner) continue;

    const key = String(owner.id);
    if (!byOwner.has(key)) {
      byOwner.set(key, {
        owner_id: key,
        owner_name: owner.name,
        jumlah_transaksi: 0,
        total_volume: 0,
        total_komisi: 0,
        komisi_belum_setor: 0,
      });
    }

    const row = byOwner.get(key);
    row.jumlah_transaksi += 1;
    row.total_volume += volume;
    row.total_komisi += komisi;
    if (payment.status_komisi === "belum_lunas") {
      row.komisi_belum_setor += komisi;
    }
  }

  return {
    tahun: year,
    bulan: month,
    label: formatMonthLabel(year, month),
    jumlah_transaksi: payments.length,
    transaksi_belum_setor: transaksiBelumSetor,
    total_volume_tunai: totalVolume,
    total_komisi: totalKomisi,
    komisi_belum_setor: komisiBelumSetor,
    komisi_sudah_setor: komisiSudahSetor,
    per_owner: [...byOwner.values()].sort(
      (a, b) => b.komisi_belum_setor - a.komisi_belum_setor
    ),
  };
}

function resolveMonthStatus(agg, record) {
  if (record?.status === "disetor") return "disetor";
  if (agg.jumlah_transaksi === 0) return "kosong";
  if (agg.komisi_belum_setor > 0) return "menunggu";
  if (agg.komisi_sudah_setor > 0) return "disetor";
  return "kosong";
}

/** Ringkasan setoran per bulan (admin). */
export async function getSetoranOverview(monthsBack = 12) {
  const now = new Date();
  const periods = [];

  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push({ tahun: d.getFullYear(), bulan: d.getMonth() + 1 });
  }

  const records = await prisma.setoranKomisiTunai.findMany({
    where: {
      OR: periods.map((p) => ({ tahun: p.tahun, bulan: p.bulan })),
    },
  });
  const recordMap = new Map(
    records.map((r) => [`${r.tahun}-${r.bulan}`, r])
  );

  const rows = [];
  for (const { tahun, bulan } of periods) {
    const agg = await aggregateMonthCashKomisi(tahun, bulan);
    const record = recordMap.get(`${tahun}-${bulan}`);
    rows.push({
      ...agg,
      status: resolveMonthStatus(agg, record),
      tanggal_setor: record?.tanggal_setor ?? null,
      catatan: record?.catatan ?? null,
      setoran_id: record ? String(record.id) : null,
      is_current_month:
        tahun === now.getFullYear() && bulan === now.getMonth() + 1,
    });
  }

  return rows;
}

/** Ringkasan kewajiban setoran owner per bulan. */
export async function getOwnerSetoranOverview(ownerId, monthsBack = 6) {
  const now = new Date();
  const rows = [];

  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const tahun = d.getFullYear();
    const bulan = d.getMonth() + 1;
    const agg = await aggregateMonthCashKomisi(tahun, bulan, ownerId);

    const record = await prisma.setoranKomisiTunai.findUnique({
      where: { tahun_bulan: { tahun, bulan } },
    });

    rows.push({
      tahun,
      bulan,
      label: formatMonthLabel(tahun, bulan),
      jumlah_transaksi: agg.jumlah_transaksi,
      total_volume_tunai: agg.total_volume_tunai,
      total_komisi: agg.total_komisi,
      komisi_belum_setor: agg.komisi_belum_setor,
      komisi_sudah_setor: agg.komisi_sudah_setor,
      status:
        agg.komisi_belum_setor > 0
          ? "menunggu"
          : agg.jumlah_transaksi > 0
            ? "disetor"
            : "kosong",
      bulan_sudah_disetor_platform: record?.status === "disetor",
      is_current_month:
        tahun === now.getFullYear() && bulan === now.getMonth() + 1,
    });
  }

  return rows;
}

/** Admin: tandai semua komisi tunai bulan tersebut lunas + catat setoran. */
export async function executeMonthlySetoran(year, month, adminId, catatan) {
  const { start, end } = getMonthBounds(year, month);

  const pending = await prisma.pembayaran.findMany({
    where: {
      ...cashSuccessInMonthWhere(start, end),
      status_komisi: "belum_lunas",
    },
  });

  if (pending.length === 0) {
    throw new Error(
      "Tidak ada komisi tunai belum disetor untuk periode ini"
    );
  }

  const totalKomisi = pending.reduce(
    (sum, row) => sum + Number(row.komisi_platform),
    0
  );
  const totalVolume = pending.reduce(
    (sum, row) => sum + Number(row.total_bayar),
    0
  );

  const settlementNote = catatan?.trim()
    ? `Setoran komisi tunai ${formatMonthLabel(year, month)}: ${catatan.trim()}`
    : `Setoran komisi tunai ${formatMonthLabel(year, month)}`;

  return prisma.$transaction(async (tx) => {
    await tx.pembayaran.updateMany({
      where: { id: { in: pending.map((row) => row.id) } },
      data: {
        status_komisi: "lunas",
        catatan_settlement: settlementNote,
      },
    });

    const monthAgg = await aggregateMonthCashKomisi(year, month);

    const setoran = await tx.setoranKomisiTunai.upsert({
      where: { tahun_bulan: { tahun: year, bulan: month } },
      create: {
        tahun: year,
        bulan: month,
        total_komisi: totalKomisi,
        total_volume_tunai: totalVolume,
        jumlah_transaksi: pending.length,
        status: "disetor",
        tanggal_setor: new Date(),
        catatan: catatan?.trim() || null,
        settled_by_id: BigInt(adminId),
      },
      update: {
        total_komisi: monthAgg.total_komisi,
        total_volume_tunai: monthAgg.total_volume_tunai,
        jumlah_transaksi: monthAgg.jumlah_transaksi,
        status: "disetor",
        tanggal_setor: new Date(),
        catatan: catatan?.trim() || null,
        settled_by_id: BigInt(adminId),
      },
    });

    return {
      setoran,
      jumlah_transaksi: pending.length,
      total_komisi: totalKomisi,
    };
  });
}
