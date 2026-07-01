-- Add timezone, language, login_notification to Setting
ALTER TABLE `Setting`
  ADD COLUMN `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Jakarta',
  ADD COLUMN `language` VARCHAR(191) NOT NULL DEFAULT 'id',
  ADD COLUMN `login_notification` BOOLEAN NOT NULL DEFAULT true;
