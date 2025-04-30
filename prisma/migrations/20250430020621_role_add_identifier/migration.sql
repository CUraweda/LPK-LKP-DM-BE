/*
  Warnings:

  - Added the required column `identifier` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `identifier` VARCHAR(191) NOT NULL;
