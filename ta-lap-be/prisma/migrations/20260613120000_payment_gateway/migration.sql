-- AlterTable
ALTER TABLE `Pembayaran` ADD COLUMN `gateway_order_id` VARCHAR(191) NULL,
    ADD COLUMN `snap_token` TEXT NULL,
    ADD COLUMN `gateway_provider` VARCHAR(191) NULL,
    ADD COLUMN `gateway_status` VARCHAR(191) NULL,
    ADD COLUMN `gateway_payment_type` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pembayaran_gateway_order_id_key` ON `Pembayaran`(`gateway_order_id`);
