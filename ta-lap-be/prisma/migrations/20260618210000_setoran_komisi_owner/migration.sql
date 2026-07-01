-- Rekening platform untuk setoran komisi owner + pengajuan setoran per owner
ALTER TABLE `Setting`
  ADD COLUMN `platform_bank_code` VARCHAR(32) NULL,
  ADD COLUMN `platform_bank_account_number` VARCHAR(32) NULL,
  ADD COLUMN `platform_bank_account_holder` VARCHAR(128) NULL,
  ADD COLUMN `platform_ewallet_note` VARCHAR(191) NULL;

CREATE TABLE `setoran_komisi_owner` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `owner_id` BIGINT NOT NULL,
    `tahun` INTEGER NOT NULL,
    `bulan` INTEGER NOT NULL,
    `total_komisi` INTEGER NOT NULL,
    `jumlah_transaksi` INTEGER NOT NULL,
    `metode` ENUM('transfer', 'ewallet') NOT NULL,
    `bukti_pembayaran` TEXT NULL,
    `catatan_owner` VARCHAR(191) NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL,
    `status` ENUM('menunggu_verifikasi', 'disetujui', 'ditolak') NOT NULL DEFAULT 'menunggu_verifikasi',
    `catatan_admin` VARCHAR(191) NULL,
    `reviewed_by_id` BIGINT NULL,
    `reviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `setoran_komisi_owner_owner_id_tahun_bulan_key`(`owner_id`, `tahun`, `bulan`),
    INDEX `setoran_komisi_owner_status_tahun_bulan_idx`(`status`, `tahun`, `bulan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `setoran_komisi_owner` ADD CONSTRAINT `setoran_komisi_owner_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
