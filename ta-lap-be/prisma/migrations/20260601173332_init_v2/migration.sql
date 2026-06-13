/*
  Warnings:

  - You are about to drop the column `jenis` on the `lapangan` table. All the data in the column will be lost.
  - You are about to alter the column `harga` on the `lapangan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `metode` on the `pembayaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `jam_mulai` on the `pesanan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `jam_selesai` on the `pesanan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to drop the column `email_verified_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `remember_token` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kode_booking]` on the table `Pesanan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jenis_id` to the `Lapangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bukti_pembayaran` to the `Pembayaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kode_booking` to the `Pesanan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_harga` to the `Pesanan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lapangan` DROP FOREIGN KEY `Lapangan_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_pesanan_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanan` DROP FOREIGN KEY `Pesanan_lapangan_id_fkey`;

-- DropForeignKey
ALTER TABLE `pesanan` DROP FOREIGN KEY `Pesanan_user_id_fkey`;

-- DropIndex
DROP INDEX `Lapangan_owner_id_fkey` ON `lapangan`;

-- DropIndex
DROP INDEX `Pesanan_lapangan_id_fkey` ON `pesanan`;

-- DropIndex
DROP INDEX `Pesanan_user_id_fkey` ON `pesanan`;

-- AlterTable
ALTER TABLE `lapangan` DROP COLUMN `jenis`,
    ADD COLUMN `alamat` VARCHAR(191) NULL,
    ADD COLUMN `deskripsi` VARCHAR(191) NULL,
    ADD COLUMN `google_maps_url` VARCHAR(191) NULL,
    ADD COLUMN `indoor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `jam_buka` VARCHAR(191) NULL,
    ADD COLUMN `jam_tutup` VARCHAR(191) NULL,
    ADD COLUMN `jenis_id` INTEGER NOT NULL,
    ADD COLUMN `jumlah_court` INTEGER NULL DEFAULT 1,
    ADD COLUMN `kapasitas` INTEGER NULL,
    ADD COLUMN `kota` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DECIMAL(10, 8) NULL,
    ADD COLUMN `longitude` DECIMAL(11, 8) NULL,
    MODIFY `harga` DECIMAL(12, 2) NOT NULL;

-- AlterTable
ALTER TABLE `pembayaran` ADD COLUMN `bukti_pembayaran` DECIMAL(12, 2) NOT NULL,
    ADD COLUMN `refund_reason` VARCHAR(191) NULL,
    MODIFY `metode` ENUM('transfer', 'qris', 'cash', 'ewallet') NOT NULL,
    MODIFY `status` ENUM('menunggu', 'sukses', 'gagal', 'refund') NOT NULL DEFAULT 'menunggu';

-- AlterTable
ALTER TABLE `pesanan` ADD COLUMN `catatan` VARCHAR(191) NULL,
    ADD COLUMN `kode_booking` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_harga` DECIMAL(12, 2) NOT NULL,
    MODIFY `jam_mulai` DATETIME(3) NOT NULL,
    MODIFY `jam_selesai` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('pending', 'dibayar', 'selesai', 'dibatalkan', 'expired') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email_verified_at`,
    DROP COLUMN `remember_token`,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `email_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('active', 'pending', 'blocked', 'suspended') NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE `JenisOlahraga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `JenisOlahraga_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LapanganImage` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `lapangan_id` BIGINT NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OwnerVerification` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `owner_id` BIGINT NOT NULL,
    `ktp` VARCHAR(191) NULL,
    `foto_usaha` VARCHAR(191) NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `OwnerVerification_owner_id_key`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `activity_type` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `device` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `app_name` VARCHAR(191) NOT NULL,
    `app_email` VARCHAR(191) NULL,
    `app_phone` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `favicon` VARCHAR(191) NULL,
    `maintenance_mode` BOOLEAN NOT NULL DEFAULT false,
    `booking_notification` BOOLEAN NOT NULL DEFAULT true,
    `owner_notification` BOOLEAN NOT NULL DEFAULT true,
    `payment_notification` BOOLEAN NOT NULL DEFAULT true,
    `backup_notification` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BackupLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NULL,
    `status` ENUM('success', 'failed') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifikasi` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonthlyStatistic` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `total_booking` INTEGER NOT NULL,
    `total_income` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Pesanan_kode_booking_key` ON `Pesanan`(`kode_booking`);

-- AddForeignKey
ALTER TABLE `Lapangan` ADD CONSTRAINT `Lapangan_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lapangan` ADD CONSTRAINT `Lapangan_jenis_id_fkey` FOREIGN KEY (`jenis_id`) REFERENCES `JenisOlahraga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LapanganImage` ADD CONSTRAINT `LapanganImage_lapangan_id_fkey` FOREIGN KEY (`lapangan_id`) REFERENCES `Lapangan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesanan` ADD CONSTRAINT `Pesanan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesanan` ADD CONSTRAINT `Pesanan_lapangan_id_fkey` FOREIGN KEY (`lapangan_id`) REFERENCES `Lapangan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_pesanan_id_fkey` FOREIGN KEY (`pesanan_id`) REFERENCES `Pesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OwnerVerification` ADD CONSTRAINT `OwnerVerification_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
