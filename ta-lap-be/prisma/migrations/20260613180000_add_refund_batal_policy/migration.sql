-- Kebijakan potongan pembatalan booking (default 25%)
ALTER TABLE `Setting`
  ADD COLUMN `batal_potongan_persen` DECIMAL(5, 2) NOT NULL DEFAULT 25;

-- Audit trail refund saat booking dibatalkan
ALTER TABLE `Pembayaran`
  ADD COLUMN `jumlah_refund` INT NOT NULL DEFAULT 0,
  ADD COLUMN `jumlah_potongan` INT NOT NULL DEFAULT 0;
