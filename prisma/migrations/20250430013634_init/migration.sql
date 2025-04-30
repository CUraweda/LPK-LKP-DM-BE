-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `memberId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `forgotToken` VARCHAR(191) NOT NULL,
    `forgotExpiry` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_memberId_key`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` ENUM('SUPERADMIN', 'ADMIN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `employee_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `employee_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `isPaid` BOOLEAN NOT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentTotal` DOUBLE NOT NULL,
    `paymentDate` DATETIME(3) NULL,
    `merchantTradeNo` VARCHAR(191) NULL,
    `platformTradeNo` VARCHAR(191) NULL,
    `qrisLink` TEXT NULL,
    `customerNo` VARCHAR(191) NULL,
    `virtualAccountNo` VARCHAR(191) NULL,
    `expiredDate` DATETIME(3) NULL,
    `filePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transaction_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `trainingImage` VARCHAR(191) NOT NULL,
    `type` ENUM('R', 'P') NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `totalParticipants` INTEGER NOT NULL,
    `totalCourses` INTEGER NOT NULL,
    `totalHours` INTEGER NOT NULL,
    `targetTrainingHours` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trainingId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `totalQuestions` INTEGER NOT NULL,
    `totalHours` INTEGER NOT NULL,
    `questions` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trainingId` INTEGER NOT NULL,
    `coverImage` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senderId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `imageLink` VARCHAR(191) NOT NULL,
    `fileSize` VARCHAR(191) NOT NULL,
    `fileLink` VARCHAR(191) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL,
    `type` ENUM('T', 'I', 'F') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,
    `totalCourses` INTEGER NOT NULL,
    `totalCoursePrice` DOUBLE NOT NULL,
    `totalCourseHours` INTEGER NOT NULL,
    `totalExamsCompleted` INTEGER NOT NULL,
    `totalMaterials` INTEGER NOT NULL,
    `totalCareers` INTEGER NOT NULL,
    `formattedAttendance` VARCHAR(191) NOT NULL,
    `firstAttendanceDate` DATETIME(3) NOT NULL,
    `currentCourseId` INTEGER NULL,
    `alumniComment` VARCHAR(191) NOT NULL,
    `isAlumni` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `member_currentCourseId_key`(`currentCourseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `isSuccess` BOOLEAN NOT NULL,
    `paymentTotal` DOUBLE NOT NULL,
    `transactionId` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberCourseId` INTEGER NULL,
    `certificateImage` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_work` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `status` ENUM('Pekerja_Penuh_Waktu') NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `companyLogo` VARCHAR(191) NOT NULL,
    `isCurrentlyEmployed` BOOLEAN NOT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_salary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `monthIndex` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `basicSalary` DOUBLE NOT NULL,
    `allowance` DOUBLE NOT NULL,
    `bonus` DOUBLE NOT NULL,
    `overtime` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `questionsCompleted` INTEGER NOT NULL,
    `hoursCompleted` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `examId` INTEGER NOT NULL,
    `attendedAt` DATETIME(3) NOT NULL,
    `finishedAt` DATETIME(3) NOT NULL,
    `status` ENUM('Pending', 'Selesai') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `rawDate` DATETIME(3) NOT NULL,
    `attendanceImage` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `type` ENUM('H', 'I', 'S', 'A') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `trainingId` INTEGER NOT NULL,
    `status` ENUM('Sudah', 'Sedang', 'Selesai') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_identity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nationalId` VARCHAR(191) NOT NULL,
    `studentNumber` VARCHAR(191) NOT NULL,
    `placeOfBirth` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `religion` VARCHAR(191) NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NOT NULL,
    `postalCode` INTEGER NOT NULL,
    `detailedAddress` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `isParentGuardian` BOOLEAN NOT NULL,
    `socialHelp` VARCHAR(191) NOT NULL,
    `memberId` INTEGER NOT NULL,

    UNIQUE INDEX `member_identity_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `member_identity_memberId_key`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_parent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `relation` ENUM('I', 'A', 'W') NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `placeOfBirth` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `phoneNumber` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,

    UNIQUE INDEX `member_parent_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam` ADD CONSTRAINT `exam_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `material` ADD CONSTRAINT `material_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_transaction` ADD CONSTRAINT `member_transaction_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_transaction` ADD CONSTRAINT `member_transaction_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_certificate` ADD CONSTRAINT `member_certificate_memberCourseId_fkey` FOREIGN KEY (`memberCourseId`) REFERENCES `member_course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_work` ADD CONSTRAINT `member_work_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_salary` ADD CONSTRAINT `member_salary_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `member_work`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_salary` ADD CONSTRAINT `member_salary_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_test` ADD CONSTRAINT `member_test_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_test` ADD CONSTRAINT `member_test_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_attendance` ADD CONSTRAINT `member_attendance_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_course` ADD CONSTRAINT `member_course_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `training`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_course` ADD CONSTRAINT `member_course_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_identity` ADD CONSTRAINT `member_identity_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_parent` ADD CONSTRAINT `member_parent_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
