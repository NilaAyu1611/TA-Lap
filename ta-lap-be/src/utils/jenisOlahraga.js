import prisma from "../config/prisma.js";

export function normalizeJenisName(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function formatJenisLabel(nama) {
  if (!nama) return "";
  return nama
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function findOrCreateJenis(nama, { createIfMissing = false } = {}) {
  const normalized = normalizeJenisName(nama);
  if (!normalized) return null;

  let item = await prisma.jenisOlahraga.findFirst({
    where: { nama: normalized },
  });

  if (!item && createIfMissing) {
    item = await prisma.jenisOlahraga.create({
      data: { nama: normalized },
    });
  }

  return item;
}
