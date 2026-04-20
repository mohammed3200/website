/*
  Warnings:

  - You are about to alter the column `type` on the `LegalContent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(16))`.
  - You are about to alter the column `locale` on the `LegalContent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(17))`.

*/
-- DropIndex
DROP INDEX `LegalContent_type_locale_idx` ON `LegalContent`;

-- AlterTable
ALTER TABLE `LegalContent` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `type` ENUM('privacy', 'terms') NOT NULL,
    MODIFY `locale` ENUM('en', 'ar') NOT NULL;
