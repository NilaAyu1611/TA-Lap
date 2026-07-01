import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const ownerPassword = await bcrypt.hash("Owner123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  await prisma.pembayaran.deleteMany();
  await prisma.pesanan.deleteMany();
  await prisma.lapanganImage.deleteMany();
  await prisma.lapangan.deleteMany();
  await prisma.ownerProfile.deleteMany();
  await prisma.ownerVerification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.notifikasi.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.jenisOlahraga.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.backupLog.deleteMany();
  await prisma.monthlyStatistic.deleteMany();

  const jenisBadminton = await prisma.jenisOlahraga.create({
    data: {
      nama: "badminton",
      icon: "🏸",
    },
  });

  const jenisFutsal = await prisma.jenisOlahraga.create({
    data: {
      nama: "futsal",
      icon: "⚽",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin TA-LAP",
      email: "admin@talap.com",
      password: adminPassword,
      phone: "081123456789",
      city: "Jakarta",
      avatar: "https://ui-avatars.com/api/?name=Admin+TA-LAP",
      email_verified: true,
      role: "admin",
      status: "active",
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Rafi Owner",
      email: "owner@talap.com",
      password: ownerPassword,
      phone: "081987654321",
      city: "Bandung",
      avatar: "https://ui-avatars.com/api/?name=Rafi+Owner",
      email_verified: true,
      role: "owner",
      status: "active",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Nina User",
      email: "user@talap.com",
      password: userPassword,
      phone: "081234567890",
      city: "Surabaya",
      avatar: "https://ui-avatars.com/api/?name=Nina+User",
      email_verified: true,
      role: "user",
      status: "active",
    },
  });

  await prisma.ownerVerification.create({
    data: {
      owner_id: owner.id,
      ktp: "https://example.com/ktp-rafi.jpg",
      foto_usaha: "https://example.com/foto-usaha-rafi.jpg",
      status: "approved",
      notes: "Verifikasi berhasil, semua dokumen valid.",
    },
  });

  await prisma.ownerProfile.create({
    data: {
      owner_id: owner.id,
      business_name: "Rafi Sport Venue",
      business_type: "venue_multi",
      business_description:
        "Operator lapangan futsal dan badminton di Bandung dengan fasilitas lengkap.",
      address: "Jl. Merdeka No. 45, Bandung",
      province: "Jawa Barat",
      postal_code: "40111",
      website: "https://rafisport.example.com",
      instagram: "@rafisport.bdg",
      npwp: "12.345.678.9-012.000",
    },
  });

  const lapanganA = await prisma.lapangan.create({
    data: {
      owner_id: owner.id,
      nama: "Lapangan Futsal Bandung Central",
      jenis_id: jenisFutsal.id,
      kapasitas: 10,
      indoor: true,
      jumlah_court: 2,
      jam_buka: "07:00",
      jam_tutup: "23:00",
      harga: new Prisma.Decimal("180.00"),
      gambar:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
      deskripsi: "Lapangan futsal indoor premium dengan lantai berkualitas dan lampu LED.",
      status: true,
      alamat: "Jl. Asia Afrika No. 12, Bandung",
      kota: "Bandung",
      google_maps_url: "https://www.google.com/maps?q=-6.917464,107.619123",
      latitude: new Prisma.Decimal("-6.917464"),
      longitude: new Prisma.Decimal("107.619123"),
      images: {
        create: [
          {
            image_url:
              "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1200&auto=format&fit=crop",
          },
          {
            image_url:
              "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      },
    },
  });

  const lapanganB = await prisma.lapangan.create({
    data: {
      owner_id: owner.id,
      nama: "Lapangan Badminton City Arena",
      jenis_id: jenisBadminton.id,
      kapasitas: 4,
      indoor: false,
      jumlah_court: 4,
      jam_buka: "08:00",
      jam_tutup: "21:00",
      harga: new Prisma.Decimal("120.00"),
      gambar:
        "https://images.unsplash.com/photo-1626224583764-f874dbad6e1d?q=80&w=1200&auto=format&fit=crop",
      deskripsi: "Lapangan badminton outdoor yang sejuk dengan fasilitas saung dan minuman.",
      status: true,
      alamat: "Jl. Merdeka No. 45, Bandung",
      kota: "Bandung",
      google_maps_url: "https://www.google.com/maps?q=-6.917000,107.615000",
      latitude: new Prisma.Decimal("-6.917000"),
      longitude: new Prisma.Decimal("107.615000"),
      images: {
        create: [
          {
            image_url:
              "https://images.unsplash.com/photo-1622163640701-66cbedaefef6?q=80&w=1200&auto=format&fit=crop",
          },
        ],
      },
    },
  });

  const booking1 = await prisma.pesanan.create({
    data: {
      kode_booking: "BK-20260602-001",
      user_id: user.id,
      lapangan_id: lapanganA.id,
      tanggal_booking: new Date("2026-06-15"),
      jam_mulai: new Date("2026-06-15T16:00:00"),
      jam_selesai: new Date("2026-06-15T18:00:00"),
      catatan: "Butuh bola futsal tambahan dan air mineral.",
      total_harga: new Prisma.Decimal("360.00"),
      status: "dibayar",
    },
  });

  const booking2 = await prisma.pesanan.create({
    data: {
      kode_booking: "BK-20260602-002",
      user_id: user.id,
      lapangan_id: lapanganB.id,
      tanggal_booking: new Date("2026-06-20"),
      jam_mulai: new Date("2026-06-20T10:00:00"),
      jam_selesai: new Date("2026-06-20T12:00:00"),
      catatan: "Minta shuttle cock synet 10.",
      total_harga: new Prisma.Decimal("240.00"),
      status: "pending",
    },
  });

  await prisma.pembayaran.create({
    data: {
      pesanan_id: booking1.id,
      metode: "transfer",
      total_bayar: 360,
      bukti_pembayaran: new Prisma.Decimal("360.00"),
      komisi_persen: 5,
      komisi_platform: 18,
      pendapatan_owner: 342,
      status_komisi: "terpotong",
      status_payout_owner: "menunggu",
      status: "sukses",
      tanggal_bayar: new Date("2026-06-10T09:15:00.000Z"),
    },
  });

  const booking3 = await prisma.pesanan.create({
    data: {
      kode_booking: "BK-20260602-003",
      user_id: user.id,
      lapangan_id: lapanganA.id,
      tanggal_booking: new Date("2026-06-18"),
      jam_mulai: new Date("2026-06-18T14:00:00"),
      jam_selesai: new Date("2026-06-18T16:00:00"),
      total_harga: new Prisma.Decimal("360.00"),
      status: "dibayar",
    },
  });

  await prisma.pembayaran.create({
    data: {
      pesanan_id: booking3.id,
      metode: "cash",
      total_bayar: 360,
      bukti_pembayaran: new Prisma.Decimal("360.00"),
      komisi_persen: 5,
      komisi_platform: 18,
      pendapatan_owner: 342,
      status_komisi: "belum_lunas",
      status_payout_owner: "menunggu",
      status: "sukses",
      tanggal_bayar: new Date("2026-06-12T10:00:00.000Z"),
    },
  });

  await prisma.notifikasi.createMany({
    data: [
      {
        user_id: user.id,
        title: "Booking berhasil dibuat",
        message: "Pesanan Anda untuk Lapangan Futsal Bandung Central telah dicatat.",
        is_read: false,
      },
      {
        user_id: user.id,
        title: "Pembayaran sukses",
        message: "Pembayaran untuk booking BK-20260602-001 telah diterima.",
        is_read: false,
      },
      {
        user_id: owner.id,
        title: "Ada pesanan baru",
        message: "Lapangan Anda mendapatkan pesanan baru dengan kode BK-20260602-001.",
        is_read: false,
      },
      {
        user_id: admin.id,
        title: "Backup selesai",
        message: "Backup database harian selesai dengan status success.",
        is_read: true,
      },
    ],
  });

  await prisma.activityLog.createMany({
    data: [
      {
        user_id: admin.id,
        activity_type: "login",
        ip_address: "103.12.45.67",
        device: "Chrome on Windows",
      },
      {
        user_id: owner.id,
        activity_type: "Upload verifikasi KTP",
        ip_address: "103.12.45.68",
        device: "Safari on iPhone",
      },
      {
        user_id: user.id,
        activity_type: "Buat pesanan",
        ip_address: "103.12.45.69",
        device: "Firefox on Android",
      },
    ],
  });

  await prisma.setting.create({
    data: {
      id: 1,
      app_name: "TA-LAP",
      app_email: "support@talap.com",
      app_phone: "081234567890",
      logo: "/images/logo.png",
      favicon: "/images/favicon.png",
      komisi_persen: new Prisma.Decimal("5.00"),
      batal_potongan_persen: new Prisma.Decimal("25.00"),
      timezone: "Asia/Jakarta",
      language: "id",
      maintenance_mode: false,
      booking_notification: true,
      owner_notification: true,
      payment_notification: true,
      backup_notification: true,
      login_notification: true,
      auto_payout_enabled: true,
    },
  });

  await prisma.backupLog.createMany({
    data: [
      {
        file_name: "backup-2026-06-01.sql",
        size: "12MB",
        status: "success",
      },
      {
        file_name: "backup-2026-05-31.sql",
        size: "11.8MB",
        status: "failed",
      },
    ],
  });

  await prisma.monthlyStatistic.createMany({
    data: [
      {
        month: 5,
        year: 2026,
        total_booking: 42,
        total_income: new Prisma.Decimal("7320.00"),
      },
      {
        month: 6,
        year: 2026,
        total_booking: 18,
        total_income: new Prisma.Decimal("3160.00"),
      },
    ],
  });

  console.log("Seed data berhasil dimasukkan ke database.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
