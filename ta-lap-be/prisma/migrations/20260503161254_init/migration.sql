-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified_at` DATETIME(3) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'owner', 'user') NOT NULL DEFAULT 'user',
    `remember_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lapangan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `owner_id` BIGINT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jenis` ENUM('badminton', 'futsal') NOT NULL,
    `harga` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `gambar` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pesanan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `lapangan_id` BIGINT NOT NULL,
    `tanggal_booking` DATETIME(3) NOT NULL,
    `jam_mulai` VARCHAR(191) NOT NULL,
    `jam_selesai` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'dibayar', 'selesai') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembayaran` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `pesanan_id` BIGINT NOT NULL,
    `metode` VARCHAR(191) NOT NULL,
    `total_bayar` INTEGER NOT NULL,
    `status` ENUM('menunggu', 'sukses', 'gagal') NOT NULL DEFAULT 'menunggu',
    `tanggal_bayar` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pembayaran_pesanan_id_key`(`pesanan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lapangan` ADD CONSTRAINT `Lapangan_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesanan` ADD CONSTRAINT `Pesanan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pesanan` ADD CONSTRAINT `Pesanan_lapangan_id_fkey` FOREIGN KEY (`lapangan_id`) REFERENCES `Lapangan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_pesanan_id_fkey` FOREIGN KEY (`pesanan_id`) REFERENCES `Pesanan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
