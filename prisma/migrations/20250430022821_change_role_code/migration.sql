/*
  Warnings:

  - The values [SUPERADMIN] on the enum `role_code` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `role` MODIFY `code` ENUM('ADMIN', 'SISWA', 'ANY') NOT NULL;
