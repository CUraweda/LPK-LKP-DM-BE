/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `role_identifier_key` ON `role`(`identifier`);
