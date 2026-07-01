-- Rekening owner untuk payout Iris + toggle auto payout platform
ALTER TABLE `OwnerProfile`
  ADD COLUMN `bank_code` VARCHAR(32) NULL,
  ADD COLUMN `bank_account_number` VARCHAR(32) NULL,
  ADD COLUMN `bank_account_holder` VARCHAR(128) NULL;

ALTER TABLE `Setting`
  ADD COLUMN `auto_payout_enabled` BOOLEAN NOT NULL DEFAULT false;
