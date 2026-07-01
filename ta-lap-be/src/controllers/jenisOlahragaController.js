import prisma from "../config/prisma.js";
import {
  findOrCreateJenis,
  formatJenisLabel,
  normalizeJenisName,
} from "../utils/jenisOlahraga.js";

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

export const getAllJenisOlahraga = async (req, res) => {
  try {
    const data = await prisma.jenisOlahraga.findMany({
      orderBy: { nama: "asc" },
      include: {
        _count: { select: { lapangans: true } },
      },
    });

    res.json(
      serialize({
        data: data.map((item) => ({
          id: item.id,
          nama: item.nama,
          label: formatJenisLabel(item.nama),
          icon: item.icon,
          totalLapangan: item._count.lapangans,
          created_at: item.created_at,
        })),
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJenisOlahraga = async (req, res) => {
  try {
    const { nama, icon } = req.body;
    const normalized = normalizeJenisName(nama);

    if (!normalized || normalized.length < 2) {
      return res.status(400).json({
        message: "Nama jenis olahraga minimal 2 karakter (huruf/angka)",
      });
    }

    if (normalized.length > 40) {
      return res.status(400).json({
        message: "Nama jenis olahraga maksimal 40 karakter",
      });
    }

    const existing = await prisma.jenisOlahraga.findFirst({
      where: { nama: normalized },
    });

    if (existing) {
      return res.status(200).json({
        message: "Jenis olahraga sudah ada",
        data: serialize({
          id: existing.id,
          nama: existing.nama,
          label: formatJenisLabel(existing.nama),
          icon: existing.icon,
        }),
      });
    }

    const created = await findOrCreateJenis(normalized, { createIfMissing: true });

    if (icon && created) {
      await prisma.jenisOlahraga.update({
        where: { id: created.id },
        data: { icon },
      });
    }

    res.status(201).json({
      message: "Jenis olahraga berhasil ditambahkan",
      data: serialize({
        id: created.id,
        nama: created.nama,
        label: formatJenisLabel(created.nama),
        icon: icon || created.icon,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJenisOlahraga = async (req, res) => {
  try {
    const { id } = req.params;
    const jenisId = Number(id);

    const used = await prisma.lapangan.count({
      where: { jenis_id: jenisId },
    });

    if (used > 0) {
      return res.status(400).json({
        message: `Jenis masih dipakai ${used} lapangan — tidak bisa dihapus`,
      });
    }

    await prisma.jenisOlahraga.delete({ where: { id: jenisId } });
    res.json({ message: "Jenis olahraga dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
