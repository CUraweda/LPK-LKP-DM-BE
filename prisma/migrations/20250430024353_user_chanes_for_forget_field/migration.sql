/*
  Warnings:

  - You are about to drop the column `forgotExpiry` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `forgotToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `forgotExpiry`,
    DROP COLUMN `forgotToken`,
    ADD COLUMN `forgetExpiry` DATETIME(3) NULL,
    ADD COLUMN `forgetToken` VARCHAR(191) NULL;
