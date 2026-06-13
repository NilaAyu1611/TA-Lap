import prisma from "../config/prisma.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const resolveJenisId = async (jenis_id, jenis) => {
  if (jenis_id) return Number(jenis_id);

  if (jenis) {
    const sport = await prisma.jenisOlahraga.findFirst({
      where: { nama: jenis.toLowerCase() },
    });
    if (sport) return sport.id;
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
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        jenis: true,
      },
    });

    res.json({
      message: "Data lapangan berhasil diambil",
      data: serialize(data),
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
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
    } = req.body;

    const userId = BigInt(req.user.id);
    const sportId = await resolveJenisId(jenis_id, jenis);

    const lapangan = await prisma.lapangan.create({
      data: {
        nama,
        jenis_id: sportId,
        harga: Number(harga),
        status: status ?? true,
        gambar: gambar || null,
        deskripsi: deskripsi || null,
        alamat: alamat || null,
        kota: kota || null,
        kapasitas: kapasitas ? Number(kapasitas) : null,
        indoor: indoor ?? false,
        jumlah_court: jumlah_court ? Number(jumlah_court) : 1,
        jam_buka: jam_buka || null,
        jam_tutup: jam_tutup || null,
        owner_id: userId,
      },
      include: { jenis: true },
    });

    res.status(201).json({
      message: "Lapangan berhasil dibuat",
      data: serialize(lapangan),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat lapangan",
      error: error.message,
    });
  }
};

const ALLOWED_UPDATE_FIELDS = [
  "nama",
  "jenis_id",
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

    const updated = await prisma.lapangan.update({
      where: { id: BigInt(id) },
      data: updateData,
      include: { jenis: true },
    });

    res.json({
      message: "Lapangan berhasil diupdate",
      data: serialize(updated),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update",
      error: error.message,
    });
  }
};

export const deleteLapangan = async (req, res) => {
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

    await prisma.lapangan.delete({
      where: { id: BigInt(id) },
    });

    res.json({ message: "Lapangan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal delete",
      error: error.message,
    });
  }
};
