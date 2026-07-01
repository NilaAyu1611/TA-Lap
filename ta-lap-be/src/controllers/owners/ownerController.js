import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const ownerInclude = {
  verification: true,
  lapangans: {
    select: {
      id: true,
      nama: true,
      status: true,
      kota: true,
    },
  },
};

const formatOwner = (owner, activity = null) => ({
  id: owner.id,
  name: owner.name,
  email: owner.email,
  phone: owner.phone,
  city: owner.city,
  avatar: owner.avatar,
  status: owner.status,
  email_verified: owner.email_verified,
  joined: owner.created_at,
  verificationStatus: owner.verification?.status ?? null,
  verificationNotes: owner.verification?.notes ?? null,
  registrationSource:
    owner.verification?.notes?.includes("Pendaftaran mandiri via website")
      ? "website"
      : "admin",
  totalLapangan: owner.lapangans?.length ?? 0,
  lapanganAktif:
    owner.lapangans?.filter((lapangan) => lapangan.status).length ?? 0,
  totalBooking: activity?.totalBooking ?? 0,
  transaksiSukses: activity?.transaksiSukses ?? 0,
  volumeTransaksi: activity?.volumeTransaksi ?? 0,
  pendapatanOwner: activity?.pendapatanOwner ?? 0,
  lapangans:
    owner.lapangans?.map((lapangan) => {
      const lapStats = activity?.lapanganMap?.get(String(lapangan.id));
      return {
        id: lapangan.id,
        nama: lapangan.nama,
        status: lapangan.status,
        kota: lapangan.kota,
        totalBooking: lapStats?.totalBooking ?? 0,
        transaksiSukses: lapStats?.transaksiSukses ?? 0,
        volumeTransaksi: lapStats?.volumeTransaksi ?? 0,
      };
    }) ?? [],
});

const emptyActivity = () => ({
  totalBooking: 0,
  transaksiSukses: 0,
  volumeTransaksi: 0,
  pendapatanOwner: 0,
  lapanganMap: new Map(),
});

/** Sinkronkan status akun & verifikasi agar tidak saling bertentangan. */
function resolveOwnerStatusPair({
  status,
  verificationStatus,
  existingStatus,
  existingVerificationStatus,
}) {
  let nextStatus =
    status !== undefined ? status : existingStatus ?? "pending";
  let nextVerificationStatus =
    verificationStatus !== undefined
      ? verificationStatus
      : existingVerificationStatus ?? "pending";

  if (verificationStatus !== undefined) {
    if (verificationStatus === "approved") {
      nextStatus = "active";
    } else if (verificationStatus === "rejected") {
      nextStatus = "blocked";
    }
  } else if (status === "active" && nextVerificationStatus === "pending") {
    nextVerificationStatus = "approved";
  }

  return { nextStatus, nextVerificationStatus };
}

async function saveOwnerWithVerification(
  tx,
  ownerId,
  {
    userData = {},
    verificationStatus,
    verificationNotes,
    existingVerification,
  }
) {
  if (Object.keys(userData).length > 0) {
    await tx.user.update({
      where: { id: ownerId },
      data: userData,
    });
  }

  if (verificationStatus !== undefined || verificationNotes !== undefined) {
    if (existingVerification) {
      await tx.ownerVerification.update({
        where: { owner_id: ownerId },
        data: {
          ...(verificationStatus !== undefined && { status: verificationStatus }),
          ...(verificationNotes !== undefined && {
            notes: verificationNotes || null,
          }),
        },
      });
    } else {
      await tx.ownerVerification.create({
        data: {
          owner_id: ownerId,
          status: verificationStatus || "pending",
          notes: verificationNotes || null,
        },
      });
    }
  }

  return tx.user.findFirst({
    where: { id: ownerId, role: "owner" },
    include: ownerInclude,
  });
}

async function buildOwnerActivityStats(ownerIds) {
  if (!ownerIds.length) return new Map();

  const map = new Map();
  for (const id of ownerIds) {
    map.set(String(id), emptyActivity());
  }

  const lapangans = await prisma.lapangan.findMany({
    where: { owner_id: { in: ownerIds } },
    select: { id: true, owner_id: true },
  });

  const lapToOwner = new Map(
    lapangans.map((lap) => [String(lap.id), String(lap.owner_id)])
  );

  const lapanganIds = lapangans.map((lap) => lap.id);

  if (lapanganIds.length > 0) {
    const [bookingGroups, suksesPembayaran] = await Promise.all([
      prisma.pesanan.groupBy({
        by: ["lapangan_id"],
        _count: { _all: true },
        where: {
          lapangan_id: { in: lapanganIds },
          status: { not: "dibatalkan" },
        },
      }),
      prisma.pembayaran.findMany({
        where: {
          status: "sukses",
          pesanan: { lapangan_id: { in: lapanganIds } },
        },
        select: {
          total_bayar: true,
          pendapatan_owner: true,
          pesanan: { select: { lapangan_id: true } },
        },
      }),
    ]);

    for (const row of bookingGroups) {
      const lapId = String(row.lapangan_id);
      const ownerId = lapToOwner.get(lapId);
      if (!ownerId || !map.has(ownerId)) continue;

      const ownerStats = map.get(ownerId);
      const lapStats = ownerStats.lapanganMap.get(lapId) || {
        totalBooking: 0,
        transaksiSukses: 0,
        volumeTransaksi: 0,
      };
      lapStats.totalBooking += row._count._all;
      ownerStats.totalBooking += row._count._all;
      ownerStats.lapanganMap.set(lapId, lapStats);
    }

    for (const pay of suksesPembayaran) {
      const lapId = String(pay.pesanan.lapangan_id);
      const ownerId = lapToOwner.get(lapId);
      if (!ownerId || !map.has(ownerId)) continue;

      const ownerStats = map.get(ownerId);
      const lapStats = ownerStats.lapanganMap.get(lapId) || {
        totalBooking: 0,
        transaksiSukses: 0,
        volumeTransaksi: 0,
      };
      lapStats.transaksiSukses += 1;
      lapStats.volumeTransaksi += Number(pay.total_bayar || 0);
      ownerStats.transaksiSukses += 1;
      ownerStats.volumeTransaksi += Number(pay.total_bayar || 0);
      ownerStats.pendapatanOwner += Number(pay.pendapatan_owner || 0);
      ownerStats.lapanganMap.set(lapId, lapStats);
    }
  }

  return map;
}

const ownerWhere = { role: "owner" };

export const getAllOwners = async (req, res) => {
  try {
    const owners = await prisma.user.findMany({
      where: ownerWhere,
      include: ownerInclude,
      orderBy: { created_at: "desc" },
    });

    const ownerIds = owners.map((owner) => owner.id);
    const activityMap = await buildOwnerActivityStats(ownerIds);

    const formattedOwners = owners
      .map((owner) =>
        formatOwner(owner, activityMap.get(String(owner.id)))
      )
      .sort((a, b) => {
        const aNeedsReview =
          a.status === "pending" && a.verificationStatus === "pending";
        const bNeedsReview =
          b.status === "pending" && b.verificationStatus === "pending";
        if (aNeedsReview && !bNeedsReview) return -1;
        if (!aNeedsReview && bNeedsReview) return 1;
        return new Date(b.joined).getTime() - new Date(a.joined).getTime();
      });

    const belumLaku = formattedOwners.filter(
      (owner) => owner.totalLapangan > 0 && owner.transaksiSukses === 0
    ).length;
    const sudahLaku = formattedOwners.filter(
      (owner) => owner.transaksiSukses > 0
    ).length;
    const tanpaLapangan = formattedOwners.filter(
      (owner) => owner.totalLapangan === 0
    ).length;

    const statsWhere = ownerWhere;

    const [total, active, pending, blocked, pendingReview, totalVenues] =
      await Promise.all([
        prisma.user.count({ where: statsWhere }),
        prisma.user.count({ where: { ...statsWhere, status: "active" } }),
        prisma.user.count({ where: { ...statsWhere, status: "pending" } }),
        prisma.user.count({ where: { ...statsWhere, status: "blocked" } }),
        prisma.ownerVerification.count({
          where: {
            status: "pending",
            owner: ownerWhere,
          },
        }),
        prisma.lapangan.count({
          where: {
            owner_id: { not: null },
            owner: ownerWhere,
          },
        }),
      ]);

    res.json(
      serialize({
        stats: {
          total,
          active,
          pending,
          blocked,
          pendingReview,
          totalVenues,
          sudahLaku,
          belumLaku,
          tanpaLapangan,
        },
        data: formattedOwners,
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await prisma.user.findFirst({
      where: { id: BigInt(id), role: "owner" },
      include: ownerInclude,
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    const activityMap = await buildOwnerActivityStats([owner.id]);

    res.json(
      serialize({
        data: formatOwner(owner, activityMap.get(String(owner.id))),
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOwner = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      city,
      status,
      verificationStatus,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { nextStatus, nextVerificationStatus } = resolveOwnerStatusPair({
      status: status || "active",
      verificationStatus: verificationStatus || "pending",
      existingStatus: status || "active",
      existingVerificationStatus: verificationStatus || "pending",
    });

    const owner = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        city: city || null,
        status: nextStatus,
        role: "owner",
        verification: {
          create: {
            status: nextVerificationStatus,
          },
        },
      },
      include: ownerInclude,
    });

    const activityMap = await buildOwnerActivityStats([owner.id]);

    res.status(201).json({
      message: "Owner berhasil ditambahkan",
      data: serialize(
        formatOwner(owner, activityMap.get(String(owner.id)) || emptyActivity())
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      phone,
      city,
      status,
      verificationStatus,
      verificationNotes,
    } = req.body;

    const existing = await prisma.user.findFirst({
      where: { id: BigInt(id), role: "owner" },
      include: { verification: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
    }

    const { nextStatus, nextVerificationStatus } = resolveOwnerStatusPair({
      status,
      verificationStatus,
      existingStatus: existing.status,
      existingVerificationStatus: existing.verification?.status ?? null,
    });

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (city !== undefined) updateData.city = city || null;

    if (
      status !== undefined ||
      verificationStatus !== undefined
    ) {
      updateData.status = nextStatus;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const ownerId = BigInt(id);
    const shouldUpdateVerification =
      verificationStatus !== undefined ||
      verificationNotes !== undefined ||
      (status === "active" &&
        (existing.verification?.status ?? "pending") === "pending");

    const owner = await prisma.$transaction(async (tx) =>
      saveOwnerWithVerification(tx, ownerId, {
        userData: updateData,
        verificationStatus: shouldUpdateVerification
          ? nextVerificationStatus
          : undefined,
        verificationNotes,
        existingVerification: existing.verification,
      })
    );

    const activityMap = await buildOwnerActivityStats([owner.id]);

    res.json({
      message: "Owner berhasil diperbarui",
      data: serialize(
        formatOwner(owner, activityMap.get(String(owner.id)) || emptyActivity())
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body ?? {};
    const ownerId = BigInt(id);

    const existing = await prisma.user.findFirst({
      where: { id: ownerId, role: "owner" },
      include: { verification: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    const mergedNotes =
      notes !== undefined
        ? notes || null
        : existing.verification?.notes ?? null;

    const owner = await prisma.$transaction(async (tx) =>
      saveOwnerWithVerification(tx, ownerId, {
        userData: { status: "active" },
        verificationStatus: "approved",
        verificationNotes: mergedNotes,
        existingVerification: existing.verification,
      })
    );

    const activityMap = await buildOwnerActivityStats([owner.id]);

    res.json({
      message: "Owner disetujui. Akun aktif dan owner sudah bisa login.",
      data: serialize(
        formatOwner(owner, activityMap.get(String(owner.id)) || emptyActivity())
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body ?? {};

    if (!notes?.trim()) {
      return res.status(400).json({
        message: "Catatan penolakan wajib diisi",
      });
    }

    const ownerId = BigInt(id);

    const existing = await prisma.user.findFirst({
      where: { id: ownerId, role: "owner" },
      include: { verification: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    const owner = await prisma.$transaction(async (tx) =>
      saveOwnerWithVerification(tx, ownerId, {
        userData: { status: "blocked" },
        verificationStatus: "rejected",
        verificationNotes: notes.trim(),
        existingVerification: existing.verification,
      })
    );

    const activityMap = await buildOwnerActivityStats([owner.id]);

    res.json({
      message: "Pendaftaran owner ditolak. Akun diblokir.",
      data: serialize(
        formatOwner(owner, activityMap.get(String(owner.id)) || emptyActivity())
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = BigInt(id);

    const existing = await prisma.user.findFirst({
      where: { id: ownerId, role: "owner" },
      include: { pesanans: { select: { id: true } } },
    });

    if (!existing) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    await prisma.$transaction(async (tx) => {
      const pesananIds = existing.pesanans.map((pesanan) => pesanan.id);

      if (pesananIds.length > 0) {
        await tx.pembayaran.deleteMany({
          where: { pesanan_id: { in: pesananIds } },
        });
        await tx.pesanan.deleteMany({
          where: { user_id: ownerId },
        });
      }

      await tx.lapangan.updateMany({
        where: { owner_id: ownerId },
        data: { owner_id: null },
      });

      await tx.ownerVerification.deleteMany({
        where: { owner_id: ownerId },
      });
      await tx.activityLog.deleteMany({ where: { user_id: ownerId } });
      await tx.notifikasi.deleteMany({ where: { user_id: ownerId } });
      await tx.user.delete({ where: { id: ownerId } });
    });

    res.json({ message: "Owner berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
