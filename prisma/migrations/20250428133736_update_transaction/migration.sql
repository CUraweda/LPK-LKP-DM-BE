-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
