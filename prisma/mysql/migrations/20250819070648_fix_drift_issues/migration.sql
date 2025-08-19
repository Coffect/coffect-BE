/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categotyId` on the `Category` table. All the data in the column will be lost.
  - You are about to alter the column `categoryName` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(255)`.
  - The primary key for the `ChatRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chatRoomId` on the `ChatRoom` table. All the data in the column will be lost.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `chatRoomId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `ChatJoin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatroomId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coffectId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatroomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CategoryMatch` DROP FOREIGN KEY `CategoryMatch_categotyId_fkey`;

-- DropForeignKey
ALTER TABLE `ChatJoin` DROP FOREIGN KEY `ChatJoin_chatRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `ChatJoin` DROP FOREIGN KEY `ChatJoin_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_chatRoomId_fkey`;

-- DropIndex
DROP INDEX `Message_chatRoomId_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `Category` DROP PRIMARY KEY,
    DROP COLUMN `categotyId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `categoryName` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`categoryId`);

-- AlterTable
ALTER TABLE `ChatRoom` DROP PRIMARY KEY,
    DROP COLUMN `chatRoomId`,
    ADD COLUMN `chatroomId` VARCHAR(100) NOT NULL,
    ADD COLUMN `coffectId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`chatroomId`);

-- AlterTable
ALTER TABLE `CoffeeChat` ADD COLUMN `isDelete` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Follow` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `chatRoomId`,
    ADD COLUMN `chatroomId` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Thread` MODIFY `type` ENUM('아티클', '팀원모집', '질문', '도움 필요', '후기글', '팁 공유') NOT NULL DEFAULT '아티클';

-- AlterTable
ALTER TABLE `ThreadSubject` MODIFY `subjectName` ENUM('프로덕트', '개발', '디자인', '기획', '인사이트', '취업', '창업', '학교', '기타') NOT NULL;

-- AlterTable
ALTER TABLE `UnivList` ADD COLUMN `domain` VARCHAR(30) NULL,
    ADD COLUMN `location` VARCHAR(100) NULL,
    MODIFY `name_initial` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `dept` VARCHAR(20) NULL,
    ADD COLUMN `studentId` INTEGER NULL,
    ADD COLUMN `univId` INTEGER NULL,
    MODIFY `profileImage` TEXT NOT NULL;

-- DropTable
DROP TABLE `ChatJoin`;

-- CreateTable
CREATE TABLE `UnivDept` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(20) NOT NULL,
    `univ` VARCHAR(20) NOT NULL,
    `college` VARCHAR(20) NOT NULL,
    `dept` VARCHAR(30) NOT NULL,
    `isMain` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notificationId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `data` JSON NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_isRead_idx`(`isRead`),
    INDEX `Notification_type_idx`(`type`),
    INDEX `Notification_userId_idx`(`userId`),
    PRIMARY KEY (`notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFCMToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `fcmToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserFCMToken_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRoomUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `chatroomId` VARCHAR(100) NOT NULL,
    `lastMessage` VARCHAR(50) NULL,
    `check` BOOLEAN NULL,

    INDEX `ChatRoomUser_User_userId_fk`(`userId`),
    INDEX `fk_chatroomuser_chatroom`(`chatroomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Follow_followerId_idx` ON `Follow`(`followerId`);

-- CreateIndex
CREATE INDEX `Follow_followingId_idx` ON `Follow`(`followingId`);

-- CreateIndex
CREATE INDEX `idx_follow_follower` ON `Follow`(`followerId`);

-- CreateIndex
CREATE INDEX `idx_follow_following` ON `Follow`(`followingId`);

-- CreateIndex
CREATE UNIQUE INDEX `unique_follow` ON `Follow`(`followerId`, `followingId`);

-- CreateIndex
CREATE INDEX `Message_ChatRoom_chatroomId_fk` ON `Message`(`chatroomId`);

-- CreateIndex
CREATE UNIQUE INDEX `ThreadCreatedAtUnique` ON `Thread`(`createdAt`);

-- CreateIndex
CREATE INDEX `User_UnivList__fk` ON `User`(`univId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_UnivList__fk` FOREIGN KEY (`univId`) REFERENCES `UnivList`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `fk_follow_follower` FOREIGN KEY (`followerId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `fk_follow_following` FOREIGN KEY (`followingId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryMatch` ADD CONSTRAINT `CategoryMatch_categotyId_fkey` FOREIGN KEY (`categotyId`) REFERENCES `Category`(`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFCMToken` ADD CONSTRAINT `UserFCMToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoomUser` ADD CONSTRAINT `ChatRoomUser_User_userId_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ChatRoomUser` ADD CONSTRAINT `fk_chatroomuser_chatroom` FOREIGN KEY (`chatroomId`) REFERENCES `ChatRoom`(`chatroomId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_ChatRoom_chatroomId_fk` FOREIGN KEY (`chatroomId`) REFERENCES `ChatRoom`(`chatroomId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
