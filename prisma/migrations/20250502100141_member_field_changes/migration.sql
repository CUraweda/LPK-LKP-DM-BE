-- AlterTable
ALTER TABLE `member` ADD COLUMN `verifiedAt` DATETIME(3) NULL,
    MODIFY `formattedAttendance` VARCHAR(191) NULL DEFAULT '0|0|0|0';
