-- Pengeluaran operasional platform (manual admin)
CREATE TABLE `PengeluaranPlatform` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `kategori` ENUM('operasional', 'refund_manual', 'marketing', 'lainnya') NOT NULL DEFAULT 'operasional',
  `deskripsi` VARCHAR(191) NOT NULL,
  `jumlah` INTEGER NOT NULL,
  `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
