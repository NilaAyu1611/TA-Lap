import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { serializeBigInt } from "../utils/serialize.js";
import {
  isValidBankCode,
  normalizeBankCode,
} from "../utils/indonesianBanks.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  city: true,
  avatar: true,
  role: true,
  status: true,
  email_verified: true,
  created_at: true,
  updated_at: true,
};

const BUSINESS_TYPES = [
  "venue_futsal",
  "venue_badminton",
  "venue_multi",
  "kompleks_olahraga",
  "klub_olahraga",
  "akademi_olahraga",
  "operator_lapangan",
  "perorangan",
  "lainnya",
];

async function getOwnerStats(ownerId) {
  const lapangans = await prisma.lapangan.findMany({
    where: { owner_id: ownerId },
    select: { id: true, status: true },
  });

  const lapanganIds = lapangans.map((l) => l.id);

  let totalBooking = 0;
  let transaksiSukses = 0;
  let volumeTransaksi = 0;

  if (lapanganIds.length > 0) {
    const [bookingCount, sukses] = await Promise.all([
      prisma.pesanan.count({
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
        select: { total_bayar: true, pendapatan_owner: true },
      }),
    ]);

    totalBooking = bookingCount;
    transaksiSukses = sukses.length;
    volumeTransaksi = sukses.reduce(
      (sum, item) => sum + Number(item.pendapatan_owner || 0),
      0
    );
  }

  return {
    totalLapangan: lapangans.length,
    lapanganAktif: lapangans.filter((l) => l.status).length,
    totalBooking,
    transaksiSukses,
    volumeTransaksi,
  };
}

async function getOwnerProfilePayload(userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: "owner" },
    select: {
      ...userSelect,
      verification: {
        select: { status: true, notes: true, ktp: true, foto_usaha: true },
      },
      ownerProfile: true,
    },
  });

  if (!user) return null;

  const [stats, lastLogin] = await Promise.all([
    getOwnerStats(userId),
    prisma.activityLog.findFirst({
      where: { user_id: userId, activity_type: "login" },
      orderBy: { created_at: "desc" },
      select: { created_at: true, ip_address: true, device: true },
    }),
  ]);

  const profile = user.ownerProfile;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    email_verified: user.email_verified,
    joined: user.created_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
    verificationStatus: user.verification?.status ?? null,
    verificationNotes: user.verification?.notes ?? null,
    business_name: profile?.business_name ?? null,
    business_type: profile?.business_type ?? null,
    business_description: profile?.business_description ?? null,
    address: profile?.address ?? null,
    province: profile?.province ?? null,
    postal_code: profile?.postal_code ?? null,
    website: profile?.website ?? null,
    instagram: profile?.instagram ?? null,
    npwp: profile?.npwp ?? null,
    bank_code: profile?.bank_code ?? null,
    bank_account_number: profile?.bank_account_number ?? null,
    bank_account_holder: profile?.bank_account_holder ?? null,
    bank_complete: Boolean(
      profile?.bank_code &&
        profile?.bank_account_number &&
        profile?.bank_account_holder
    ),
    profile_updated_at: profile?.updated_at ?? null,
    lastLogin,
    ...stats,
  };
}

function validateBusinessType(value) {
  if (value === undefined) return { skip: true };
  if (value === null || value === "") return { value: null };
  const normalized = String(value).trim().toLowerCase();
  if (!BUSINESS_TYPES.includes(normalized)) {
    return { error: "Jenis bisnis lapangan tidak valid" };
  }
  return { value: normalized };
}

export const getMyOwnerProfile = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const profile = await getOwnerProfilePayload(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profil owner tidak ditemukan" });
    }

    res.json(serializeBigInt({ data: profile }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyOwnerProfile = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const {
      name,
      email,
      phone,
      city,
      avatar,
      business_name,
      business_type,
      business_description,
      address,
      province,
      postal_code,
      website,
      instagram,
      npwp,
      bank_code,
      bank_account_number,
      bank_account_holder,
    } = req.body;

    const existing = await prisma.user.findFirst({
      where: { id: userId, role: "owner" },
      include: { ownerProfile: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Profil owner tidak ditemukan" });
    }

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ message: "Nama wajib diisi" });
    }

    if (email !== undefined) {
      const trimmedEmail = String(email).trim().toLowerCase();
      if (!trimmedEmail) {
        return res.status(400).json({ message: "Email wajib diisi" });
      }
      if (trimmedEmail !== existing.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: trimmedEmail },
        });
        if (emailTaken) {
          return res.status(400).json({ message: "Email sudah digunakan" });
        }
      }
    }

    if (phone !== undefined && String(phone).trim()) {
      const phoneValue = String(phone).trim();
      if (!/^[\d\s+\-()]{8,20}$/.test(phoneValue)) {
        return res.status(400).json({
          message: "Format nomor telepon tidak valid",
        });
      }
    }

    const typeCheck = validateBusinessType(business_type);
    if (typeCheck?.error) {
      return res.status(400).json({ message: typeCheck.error });
    }

    if (bank_code !== undefined && bank_code !== null && bank_code !== "") {
      const normalizedBank = normalizeBankCode(bank_code);
      if (!isValidBankCode(normalizedBank)) {
        return res.status(400).json({ message: "Kode bank tidak valid" });
      }
    }

    if (bank_account_number !== undefined && bank_account_number !== null && bank_account_number !== "") {
      const digits = String(bank_account_number).replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 20) {
        return res.status(400).json({
          message: "Nomor rekening harus 8–20 digit",
        });
      }
    }

    if (bank_account_holder !== undefined && bank_account_holder !== null && bank_account_holder !== "") {
      if (String(bank_account_holder).trim().length < 3) {
        return res.status(400).json({
          message: "Nama pemilik rekening minimal 3 karakter",
        });
      }
    }

    const userUpdate = {};
    if (name !== undefined) userUpdate.name = String(name).trim();
    if (email !== undefined) userUpdate.email = String(email).trim().toLowerCase();
    if (phone !== undefined) userUpdate.phone = phone?.trim() || null;
    if (city !== undefined) userUpdate.city = city?.trim() || null;
    if (avatar !== undefined) userUpdate.avatar = avatar?.trim() || null;

    if (name !== undefined && !userUpdate.avatar && !existing.avatar) {
      userUpdate.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userUpdate.name)}&background=7c3aed&color=fff`;
    }

    const profileFields = {
      business_name,
      business_description,
      address,
      province,
      postal_code,
      website,
      instagram,
      npwp,
      bank_code,
      bank_account_number,
      bank_account_holder,
    };

    const profileUpdate = {};
    for (const [key, value] of Object.entries(profileFields)) {
      if (value !== undefined) {
        if (key === "bank_code") {
          profileUpdate[key] =
            value === null || value === "" ? null : normalizeBankCode(value);
        } else if (key === "bank_account_number") {
          profileUpdate[key] =
            value === null || value === ""
              ? null
              : String(value).replace(/\D/g, "");
        } else {
          profileUpdate[key] =
            value === null || value === "" ? null : String(value).trim();
        }
      }
    }

    if (!typeCheck?.skip && business_type !== undefined) {
      profileUpdate.business_type = typeCheck?.value ?? null;
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(userUpdate).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdate,
        });
      }

      if (Object.keys(profileUpdate).length > 0) {
        if (existing.ownerProfile) {
          await tx.ownerProfile.update({
            where: { owner_id: userId },
            data: profileUpdate,
          });
        } else {
          await tx.ownerProfile.create({
            data: {
              owner_id: userId,
              ...profileUpdate,
            },
          });
        }
      }
    });

    const profile = await getOwnerProfilePayload(userId);

    res.json({
      message: "Profil bisnis berhasil diperbarui",
      profile: serializeBigInt(profile),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeMyOwnerPassword = async (req, res) => {
  try {
    const userId = BigInt(req.user.id);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Konfirmasi password tidak cocok",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, role: "owner" },
    });

    if (!user) {
      return res.status(404).json({ message: "Owner tidak ditemukan" });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await prisma.activityLog.create({
      data: {
        user_id: userId,
        activity_type: "password_changed",
        ip_address: req.ip || null,
        device: req.headers["user-agent"] || null,
      },
    });

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
