-- AlterTable
ALTER TABLE `Notifikasi` ADD COLUMN `type` VARCHAR(191) NULL,
    ADD COLUMN `link` VARCHAR(191) NULL,
    ADD COLUMN `pesanan_id` BIGINT NULL;

CREATE INDEX `Notifikasi_user_id_is_read_idx` ON `Notifikasi`(`user_id`, `is_read`);
CREATE INDEX `Notifikasi_pesanan_id_type_idx` ON `Notifikasi`(`pesanan_id`, `type`);
