-- AlterTable: User — Google OAuth + nullable password
ALTER TABLE `User` MODIFY `password` VARCHAR(191) NULL;

ALTER TABLE `User`
  ADD COLUMN `google_id` VARCHAR(191) NULL,
  ADD COLUMN `auth_provider` VARCHAR(191) NOT NULL DEFAULT 'local';

CREATE UNIQUE INDEX `User_google_id_key` ON `User`(`google_id`);

-- CreateTable: password reset tokens
CREATE TABLE `password_reset_tokens` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `used_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
  INDEX `password_reset_tokens_user_id_idx`(`user_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
