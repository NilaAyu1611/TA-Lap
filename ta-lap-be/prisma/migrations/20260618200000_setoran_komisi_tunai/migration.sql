-- Setoran komisi tunai bulanan (akumulasi 5% dari transaksi cash)
CREATE TABLE `setoran_komisi_tunai` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `bulan` INTEGER NOT NULL,
    `total_komisi` INTEGER NOT NULL DEFAULT 0,
    `total_volume_tunai` INTEGER NOT NULL DEFAULT 0,
    `jumlah_transaksi` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('menunggu', 'disetor') NOT NULL DEFAULT 'menunggu',
    `tanggal_setor` DATETIME(3) NULL,
    `catatan` VARCHAR(191) NULL,
    `settled_by_id` BIGINT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `setoran_komisi_tunai_tahun_bulan_key`(`tahun`, `bulan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
