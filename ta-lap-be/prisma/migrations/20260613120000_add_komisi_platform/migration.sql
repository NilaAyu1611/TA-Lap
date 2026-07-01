-- Komisi platform & settlement owner
ALTER TABLE `Setting` ADD COLUMN `komisi_persen` DECIMAL(5, 2) NOT NULL DEFAULT 5;

ALTER TABLE `Pembayaran`
  ADD COLUMN `komisi_persen` INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN `komisi_platform` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `pendapatan_owner` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `status_komisi` ENUM('terpotong', 'belum_lunas', 'lunas') NOT NULL DEFAULT 'terpotong',
  ADD COLUMN `status_payout_owner` ENUM('menunggu', 'dicairkan') NOT NULL DEFAULT 'menunggu',
  ADD COLUMN `catatan_settlement` VARCHAR(191) NULL;

-- Backfill komisi dari transaksi sukses yang sudah ada
UPDATE `Pembayaran`
SET
  `komisi_platform` = ROUND(`total_bayar` * 0.05),
  `pendapatan_owner` = `total_bayar` - ROUND(`total_bayar` * 0.05),
  `status_komisi` = CASE
    WHEN `metode` = 'cash' AND `status` = 'sukses' THEN 'belum_lunas'
    WHEN `status` = 'sukses' THEN 'terpotong'
    ELSE 'terpotong'
  END
WHERE `total_bayar` > 0;
