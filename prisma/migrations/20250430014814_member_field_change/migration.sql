-- AlterTable
ALTER TABLE `member` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `profileImage` VARCHAR(191) NULL,
    MODIFY `totalCourses` INTEGER NULL,
    MODIFY `totalCoursePrice` DOUBLE NULL,
    MODIFY `totalCourseHours` INTEGER NULL,
    MODIFY `totalExamsCompleted` INTEGER NULL,
    MODIFY `totalMaterials` INTEGER NULL,
    MODIFY `totalCareers` INTEGER NULL,
    MODIFY `formattedAttendance` VARCHAR(191) NULL,
    MODIFY `firstAttendanceDate` DATETIME(3) NULL,
    MODIFY `alumniComment` VARCHAR(191) NULL,
    MODIFY `isAlumni` BOOLEAN NULL,
    MODIFY `createdAt` DATETIME(3) NULL;
