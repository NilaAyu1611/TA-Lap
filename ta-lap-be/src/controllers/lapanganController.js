import prisma from "../config/prisma.js";
import { findOrCreateJenis } from "../utils/jenisOlahraga.js";
import { buildLapanganAvailability } from "../utils/lapanganAvailability.js";
import { blocksSlotWhere } from "../utils/pesananStatus.js";
import { searchTomTomPlaces, reverseGeocodeTomTom } from "../services/tomtomService.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const lapanganInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      ownerProfile: { select: { business_name: true } },
    },
  },
  jenis: true,
  images: {
    orderBy: { id: "asc" },
    select: { id: true, image_url: true },
  },
  _count: {
    select: { pesanans: true },
  },
};

const normalizeImageUrls = (gambar, images) => {
  const list = [];
  if (Array.isArray(images)) {
    for (const item of images) {
      const url = typeof item === "string" ? item : item?.image_url;
      if (url && String(url).trim()) list.push(String(url).trim());
    }
  }
  const cover = gambar && String(gambar).trim() ? String(gambar).trim() : null;
  return { cover, gallery: list };
};

const syncLapanganImages = async (lapanganId, gambar, images, tx = prisma) => {
  const { cover, gallery } = normalizeImageUrls(gambar, images);

  await tx.lapanganImage.deleteMany({
    where: { lapangan_id: BigInt(lapanganId) },
  });

  if (gallery.length > 0) {
    await tx.lapanganImage.createMany({
      data: gallery.map((image_url) => ({
        lapangan_id: BigInt(lapanganId),
        image_url,
      })),
    });
  }

  return cover;
};

const formatLapangan = (lapangan) => ({
  id: lapangan.id,
  nama: lapangan.nama,
  jenis: lapangan.jenis?.nama ?? null,
  jenis_id: lapangan.jenis_id,
  harga: Number(lapangan.harga),
  status: lapangan.status,
  gambar: lapangan.gambar,
  deskripsi: lapangan.deskripsi,
  alamat: lapangan.alamat,
  kota: lapangan.kota,
  kapasitas: lapangan.kapasitas,
  indoor: lapangan.indoor,
  jumlah_court: lapangan.jumlah_court,
  jam_buka: lapangan.jam_buka,
  jam_tutup: lapangan.jam_tutup,
  google_maps_url: lapangan.google_maps_url,
  latitude: lapangan.latitude != null ? Number(lapangan.latitude) : null,
  longitude: lapangan.longitude != null ? Number(lapangan.longitude) : null,
  images: (lapangan.images || []).map((img) => ({
    id: String(img.id),
    image_url: img.image_url,
  })),
  owner_id: lapangan.owner_id?.toString() ?? null,
  owner_name: lapangan.owner?.name ?? null,
  owner_business_name: lapangan.owner?.ownerProfile?.business_name ?? null,
  owner_email: lapangan.owner?.email ?? null,
  totalBooking: lapangan._count?.pesanans ?? 0,
  created_at: lapangan.created_at,
});

const resolveJenisId = async (jenis_id, jenis, { allowCreate = false } = {}) => {
  if (jenis_id) return Number(jenis_id);

  if (jenis) {
    const item = await findOrCreateJenis(jenis, { createIfMissing: allowCreate });
    if (item) return item.id;

    const existing = await prisma.jenisOlahraga.findFirst({
      where: { nama: String(jenis).trim().toLowerCase() },
    });
    if (existing) return existing.id;
  }

  const fallback = await prisma.jenisOlahraga.findFirst();
  return fallback?.id ?? 1;
};

export const getAllLapangan = async (req, res) => {
  try {
    const user = req.user;
    let whereClause = {};

    if (user.role === "owner") {
      whereClause.owner_id = BigInt(user.id);
    }

    if (user.role === "user") {
      whereClause.status = true;
    }

    const data = await prisma.lapangan.findMany({
      where: whereClause,
      include: lapanganInclude,
      orderBy: { created_at: "desc" },
    });

    const formatted = data.map(formatLapangan);

    if (user.role === "admin") {
      const [total, aktif, nonaktif, tanpaOwner] = await Promise.all([
        prisma.lapangan.count(),
        prisma.lapangan.count({ where: { status: true } }),
        prisma.lapangan.count({ where: { status: false } }),
        prisma.lapangan.count({ where: { owner_id: null } }),
      ]);

      return res.json(
        serialize({
          stats: { total, aktif, nonaktif, tanpaOwner },
          data: formatted,
        })
      );
    }

    if (user.role === "owner") {
      const ownerId = BigInt(user.id);
      const ownerWhere = { owner_id: ownerId };
      const [total, aktif, nonaktif] = await Promise.all([
        prisma.lapangan.count({ where: ownerWhere }),
        prisma.lapangan.count({ where: { ...ownerWhere, status: true } }),
        prisma.lapangan.count({ where: { ...ownerWhere, status: false } }),
      ]);
      const totalBooking = formatted.reduce(
        (sum, item) => sum + item.totalBooking,
        0
      );

      return res.json(
        serialize({
          stats: { total, aktif, nonaktif, totalBooking },
          data: formatted,
        })
      );
    }

    res.json({
      message: "Data lapangan berhasil diambil",
      data: serialize(formatted),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Preview lapangan untuk halaman beranda — tanpa login */
export const getPublicLapanganPreview = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 3, 1), 6);

    const [rows, total] = await Promise.all([
      prisma.lapangan.findMany({
        where: { status: true },
        include: lapanganInclude,
        orderBy: { created_at: "desc" },
        take: limit,
      }),
      prisma.lapangan.count({ where: { status: true } }),
    ]);

    res.json({
      message: "Preview lapangan berhasil diambil",
      data: serialize(rows.map(formatLapangan)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLapanganById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(id) },
      include: lapanganInclude,
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    if (
      user.role === "owner" &&
      lapangan.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.json(serialize({ data: formatLapangan(lapangan) }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLapanganAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    const user = req.user;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({
        message: "Parameter date wajib dengan format YYYY-MM-DD",
      });
    }

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(id) },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    if (user.role === "user" && !lapangan.status) {
      return res.status(403).json({ message: "Lapangan tidak tersedia" });
    }

    if (
      user.role === "owner" &&
      lapangan.owner_id !== BigInt(user.id)
    ) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const tanggal = new Date(String(date));

    const bookings = await prisma.pesanan.findMany({
      where: blocksSlotWhere({
        lapangan_id: BigInt(id),
        tanggal_booking: tanggal,
      }),
      select: {
        id: true,
        jam_mulai: true,
        jam_selesai: true,
        status: true,
        kode_booking: true,
      },
      orderBy: { jam_mulai: "asc" },
    });

    const data = buildLapanganAvailability(lapangan, String(date), bookings);

    res.json(serialize({ data }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLapangan = async (req, res) => {
  try {
    const {
      nama,
      jenis_id,
      jenis,
      harga,
      status,
      gambar,
      deskripsi,
      alamat,
      kota,
      kapasitas,
      indoor,
      jumlah_court,
      jam_buka,
      jam_tutup,
      google_maps_url,
      latitude,
      longitude,
      images,
    } = req.body;

    if (!nama || harga === undefined || harga === "") {
      return res.status(400).json({
        message: "Nama dan harga lapangan wajib diisi",
      });
    }

    const userId = BigInt(req.user.id);
    const sportId = await resolveJenisId(jenis_id, jenis, { allowCreate: true });

    let ownerId = userId;

    if (req.user.role === "admin") {
      if (!req.body.owner_id) {
        return res.status(400).json({
          message: "Owner wajib dipilih saat admin menambah lapangan",
        });
      }

      const targetOwner = await prisma.user.findFirst({
        where: { id: BigInt(req.body.owner_id), role: "owner" },
      });

      if (!targetOwner) {
        return res.status(400).json({ message: "Owner tidak ditemukan" });
      }

      ownerId = BigInt(req.body.owner_id);
    }

    const lapangan = await prisma.$transaction(async (tx) => {
      const { cover, gallery } = normalizeImageUrls(gambar, images);

      const created = await tx.lapangan.create({
        data: {
          nama,
          jenis_id: sportId,
          harga: Number(harga),
          status: status ?? true,
          gambar: cover,
          deskripsi: deskripsi || null,
          alamat: alamat || null,
          kota: kota || null,
          kapasitas: kapasitas ? Number(kapasitas) : null,
          indoor: indoor ?? false,
          jumlah_court: jumlah_court ? Number(jumlah_court) : 1,
          jam_buka: jam_buka || null,
          jam_tutup: jam_tutup || null,
          google_maps_url: google_maps_url || null,
          latitude: latitude != null && latitude !== "" ? latitude : null,
          longitude: longitude != null && longitude !== "" ? longitude : null,
          owner_id: ownerId,
          ...(gallery.length > 0
            ? {
                images: {
                  create: gallery.map((image_url) => ({ image_url })),
                },
              }
            : {}),
        },
        include: lapanganInclude,
      });

      return created;
    });

    res.status(201).json({
      message: "Lapangan berhasil dibuat",
      data: serialize(formatLapangan(lapangan)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ALLOWED_UPDATE_FIELDS = [
  "nama",
  "harga",
  "status",
  "gambar",
  "deskripsi",
  "alamat",
  "kota",
  "kapasitas",
  "indoor",
  "jumlah_court",
  "jam_buka",
  "jam_tutup",
  "google_maps_url",
  "latitude",
  "longitude",
];

export const updateLapangan = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: BigInt(id) },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    if (user.role === "owner" && lapangan.owner_id !== BigInt(user.id)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const updateData = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (updateData.harga !== undefined) {
      updateData.harga = Number(updateData.harga);
    }

    if (req.body.jenis || req.body.jenis_id) {
      updateData.jenis_id = await resolveJenisId(
        req.body.jenis_id,
        req.body.jenis,
        { allowCreate: true }
      );
    }

    if (user.role === "admin" && req.body.owner_id !== undefined) {
      if (req.body.owner_id) {
        const targetOwner = await prisma.user.findFirst({
          where: { id: BigInt(req.body.owner_id), role: "owner" },
        });
        if (!targetOwner) {
          return res.status(400).json({ message: "Owner tidak ditemukan" });
        }
        updateData.owner_id = BigInt(req.body.owner_id);
      } else {
        updateData.owner_id = null;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const data = { ...updateData };

      if (req.body.gambar !== undefined || req.body.images !== undefined) {
        const cover = await syncLapanganImages(
          id,
          req.body.gambar ?? lapangan.gambar,
          req.body.images ??
            (await tx.lapanganImage.findMany({
              where: { lapangan_id: BigInt(id) },
              select: { image_url: true },
            })),
          tx
        );
        data.gambar = cover;
      }

      return tx.lapangan.update({
        where: { id: BigInt(id) },
        data,
        include: lapanganInclude,
      });
    });

    res.json({
      message: "Lapangan berhasil diperbarui",
      data: serialize(formatLapangan(updated)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLapangan = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const lapanganId = BigInt(id);

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: lapanganId },
      include: { pesanans: { select: { id: true } } },
    });

    if (!lapangan) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    if (user.role === "owner" && lapangan.owner_id !== BigInt(user.id)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    await prisma.$transaction(async (tx) => {
      const pesananIds = lapangan.pesanans.map((p) => p.id);

      if (pesananIds.length > 0) {
        await tx.pembayaran.deleteMany({
          where: { pesanan_id: { in: pesananIds } },
        });
        await tx.pesanan.deleteMany({
          where: { lapangan_id: lapanganId },
        });
      }

      await tx.lapanganImage.deleteMany({
        where: { lapangan_id: lapanganId },
      });
      await tx.lapangan.delete({ where: { id: lapanganId } });
    });

    res.json({ message: "Lapangan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Autocomplete lokasi via TomTom Search (public, untuk owner & user). */
export const searchPlaces = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(Number(req.query.limit) || 6, 10);
    const kind = req.query.kind === "area" ? "area" : "all";
    const lat = req.query.lat != null ? Number(req.query.lat) : undefined;
    const lon = req.query.lon != null ? Number(req.query.lon) : undefined;

    if (q.length < 2) {
      return res.json({ data: [] });
    }

    const data = await searchTomTomPlaces(q, {
      limit,
      kind,
      lat: Number.isFinite(lat) ? lat : undefined,
      lon: Number.isFinite(lon) ? lon : undefined,
    });
    res.json({ data });
  } catch (error) {
    const isConfig = error.message.includes("belum dikonfigurasi");
    res.status(isConfig ? 503 : 500).json({ message: error.message });
  }
};

/** Reverse geocode koordinat → nama kota/area. */
export const reversePlace = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ message: "Parameter lat dan lon wajib diisi" });
    }

    const data = await reverseGeocodeTomTom(lat, lon);
    res.json({ data });
  } catch (error) {
    const isConfig = error.message.includes("belum dikonfigurasi");
    res.status(isConfig ? 503 : 500).json({ message: error.message });
  }
};
