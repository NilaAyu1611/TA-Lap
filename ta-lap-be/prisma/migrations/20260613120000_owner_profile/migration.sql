-- CreateTable
CREATE TABLE `OwnerProfile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `owner_id` BIGINT NOT NULL,
    `business_name` VARCHAR(191) NULL,
    `business_type` VARCHAR(191) NULL,
    `business_description` TEXT NULL,
    `address` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OwnerProfile_owner_id_key`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OwnerProfile` ADD CONSTRAINT `OwnerProfile_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
