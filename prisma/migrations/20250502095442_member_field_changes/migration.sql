/*
  Warnings:

  - You are about to drop the column `alumniComment` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `isAlumni` on the `member` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `member_currentCourseId_key` ON `member`;

-- AlterTable
ALTER TABLE `member` DROP COLUMN `alumniComment`,
    DROP COLUMN `isAlumni`,
    MODIFY `totalCourses` INTEGER NULL DEFAULT 0,
    MODIFY `totalCoursePrice` DOUBLE NULL DEFAULT 0,
    MODIFY `totalCourseHours` INTEGER NULL DEFAULT 0,
    MODIFY `totalExamsCompleted` INTEGER NULL DEFAULT 0,
    MODIFY `totalMaterials` INTEGER NULL DEFAULT 0,
    MODIFY `totalCareers` INTEGER NULL DEFAULT 0,
    MODIFY `formattedAttendance` VARCHAR(191) NULL DEFAULT '';
