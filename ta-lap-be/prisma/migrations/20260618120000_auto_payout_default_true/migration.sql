-- Aktifkan auto payout secara default untuk transfer otomatis ke owner
ALTER TABLE `Setting` MODIFY `auto_payout_enabled` BOOLEAN NOT NULL DEFAULT true;

UPDATE `Setting`
SET `auto_payout_enabled` = true
WHERE `id` = 1;
