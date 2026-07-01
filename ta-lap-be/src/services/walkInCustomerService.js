import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

/** Normalisasi nomor telepon Indonesia ke digit (62...). */
export function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  if (digits.length >= 9 && digits.length <= 12) return `62${digits}`;
  return digits;
}

function phoneLookupVariants(normalized) {
  if (!normalized) return [];
  const variants = new Set([normalized]);
  if (normalized.startsWith("62")) {
    variants.add(`0${normalized.slice(2)}`);
    variants.add(normalized.slice(2));
  }
  return [...variants];
}

function buildGuestEmail(phoneNorm) {
  return `walkin+${phoneNorm}@guest.talap.local`;
}

function isGuestEmail(email) {
  return typeof email === "string" && email.endsWith("@guest.talap.local");
}

/** Email untuk ditampilkan di UI — guest/walk-in dikembalikan null. */
export function formatDisplayEmail(email) {
  if (!email || isGuestEmail(email)) return null;
  return email;
}

export { isGuestEmail };

/**
 * Cari pelanggan by telepon atau buat akun pemain baru (walk-in venue).
 * Telepon wajib; email opsional.
 */
export async function findOrCreateWalkInUser(
  { name, phone, email },
  tx = prisma
) {
  const phoneNorm = normalizePhone(phone);
  if (!phoneNorm || phoneNorm.length < 10 || phoneNorm.length > 15) {
    throw new Error("Nomor telepon wajib diisi dan valid (10–15 digit)");
  }

  const trimmedName = String(name || "").trim();
  if (!trimmedName) {
    throw new Error("Nama pelanggan wajib diisi");
  }

  const emailTrim = email?.trim() || null;
  if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
    throw new Error("Format email tidak valid");
  }

  const variants = phoneLookupVariants(phoneNorm);
  const existing = await tx.user.findFirst({
    where: {
      role: "user",
      OR: variants.map((p) => ({ phone: p })),
    },
  });

  if (existing) {
    const updates = {};
    if (existing.name !== trimmedName) updates.name = trimmedName;
    if (phoneNorm && existing.phone !== phoneNorm) updates.phone = phoneNorm;

    if (emailTrim) {
      const emailTaken = await tx.user.findFirst({
        where: { email: emailTrim, id: { not: existing.id } },
      });
      if (emailTaken) {
        throw new Error("Email sudah dipakai akun lain");
      }
      if (isGuestEmail(existing.email) || existing.email !== emailTrim) {
        updates.email = emailTrim;
      }
    }

    if (Object.keys(updates).length > 0) {
      return tx.user.update({
        where: { id: existing.id },
        data: updates,
      });
    }
    return existing;
  }

  if (emailTrim) {
    const emailTaken = await tx.user.findUnique({
      where: { email: emailTrim },
    });
    if (emailTaken) {
      throw new Error("Email sudah terdaftar");
    }
  }

  let finalEmail = emailTrim || buildGuestEmail(phoneNorm);
  if (!emailTrim) {
    const clash = await tx.user.findUnique({ where: { email: finalEmail } });
    if (clash) {
      finalEmail = `walkin+${phoneNorm}+${Date.now()}@guest.talap.local`;
    }
  }

  const randomPass = crypto.randomBytes(18).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPass, 10);

  return tx.user.create({
    data: {
      name: trimmedName,
      email: finalEmail,
      phone: phoneNorm,
      password: hashedPassword,
      role: "user",
      status: "active",
    },
  });
}

/** Lookup pelanggan aktif by telepon (untuk autofill form owner). */
export async function findCustomerByPhone(phone) {
  const phoneNorm = normalizePhone(phone);
  if (!phoneNorm || phoneNorm.length < 10) return null;

  const variants = phoneLookupVariants(phoneNorm);
  return prisma.user.findFirst({
    where: {
      role: "user",
      status: "active",
      OR: variants.map((p) => ({ phone: p })),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
}
