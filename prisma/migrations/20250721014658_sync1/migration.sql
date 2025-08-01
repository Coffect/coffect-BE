-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `introduce` VARCHAR(191) NULL,
    `salt` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileImage` VARCHAR(191) NOT NULL,
    `questionIndex` JSON NULL,
    `coffeeChatCount` INTEGER NOT NULL DEFAULT 4,
    `todayInterest` INTEGER NULL DEFAULT 0,
    `todayInterestArray` JSON NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTimetable` (
    `userId` INTEGER NOT NULL,
    `timetable` VARCHAR(191) NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follow` (
    `userId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,
    `followerId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRoom` (
    `chatRoomId` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`chatRoomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatJoin` (
    `userId` INTEGER NOT NULL,
    `chatRoomId` INTEGER NOT NULL,

    INDEX `ChatJoin_chatRoomId_fkey`(`chatRoomId`),
    PRIMARY KEY (`userId`, `chatRoomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `messageId` INTEGER NOT NULL AUTO_INCREMENT,
    `chatRoomId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `messageBody` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `check` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Message_chatRoomId_fkey`(`chatRoomId`),
    INDEX `Message_userId_fkey`(`userId`),
    PRIMARY KEY (`messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thread` (
    `threadId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `type` ENUM('아티클', '팀원모집', '질문') NOT NULL DEFAULT '아티클',
    `threadTitle` VARCHAR(191) NOT NULL,
    `thradBody` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `threadShare` INTEGER NOT NULL,

    INDEX `Thread_userId_fkey`(`userId`),
    PRIMARY KEY (`threadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadImage` (
    `imageId` VARCHAR(191) NOT NULL,
    `threadId` VARCHAR(191) NOT NULL,

    INDEX `ThreadImage_threadId_fkey`(`threadId`),
    PRIMARY KEY (`imageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadLike` (
    `threadId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `ThreadLike_userId_fkey`(`userId`),
    PRIMARY KEY (`threadId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadScrap` (
    `scrapId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ThreadScrap_userId_fkey`(`userId`),
    PRIMARY KEY (`scrapId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScrapMatch` (
    `threadId` VARCHAR(191) NOT NULL,
    `scrapId` VARCHAR(191) NOT NULL,

    INDEX `ScrapMatch_scrapId_fkey`(`scrapId`),
    PRIMARY KEY (`threadId`, `scrapId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `threadId` VARCHAR(191) NOT NULL,
    `commentBody` VARCHAR(191) NOT NULL,
    `quote` INTEGER NULL,
    `createdAtD` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Comment_threadId_fkey`(`threadId`),
    INDEX `Comment_userId_fkey`(`userId`),
    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadSubject` (
    `subjectId` INTEGER NOT NULL AUTO_INCREMENT,
    `subjectName` ENUM('프로덕트', '개발', '디자인', '기획', '인사이트', '취업', '창업', '학교') NOT NULL,

    PRIMARY KEY (`subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubjectMatch` (
    `threadId` VARCHAR(191) NOT NULL,
    `subjectId` INTEGER NOT NULL,

    INDEX `SubjectMatch_subjectId_fkey`(`subjectId`),
    PRIMARY KEY (`threadId`, `subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `categotyId` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` ENUM('창업', '개발', '디자인', '기획', 'AI', '글쓰기', '독서', '마케팅', '여행', '데이터', '분석', '하드웨어', '영화', '외국어', '악기', '네트워킹') NOT NULL,
    `categoryColor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`categotyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryMatch` (
    `userId` INTEGER NOT NULL,
    `categotyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CategoryMatch_categotyId_fkey`(`categotyId`),
    PRIMARY KEY (`userId`, `categotyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefeshToken` (
    `refreshTokenIndex` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `userName` VARCHAR(25) NOT NULL,
    `tokenHashed` VARCHAR(256) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,
    `userAgent` VARCHAR(191) NULL,

    UNIQUE INDEX `RefeshToken_userId_key`(`userId`),
    PRIMARY KEY (`refreshTokenIndex`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoffeeChat` (
    `coffectId` INTEGER NOT NULL AUTO_INCREMENT,
    `firstUserId` INTEGER NOT NULL,
    `secondUserId` INTEGER NOT NULL,
    `coffectDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `valid` BOOLEAN NOT NULL DEFAULT false,

    INDEX `CoffeeChat_firstUserId_fkey`(`firstUserId`),
    INDEX `CoffeeChat_secondUserId_fkey`(`secondUserId`),
    PRIMARY KEY (`coffectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecifyInfo` (
    `userId` INTEGER NOT NULL,
    `info` JSON NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnivCert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NOT NULL,
    `certCode` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `expiredAt` DATETIME(0) NOT NULL,
    `valid` BOOLEAN NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnivList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `name_initial` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatJoin` ADD CONSTRAINT `ChatJoin_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`chatRoomId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatJoin` ADD CONSTRAINT `ChatJoin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`chatRoomId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thread` ADD CONSTRAINT `Thread_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadImage` ADD CONSTRAINT `ThreadImage_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Thread`(`threadId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadLike` ADD CONSTRAINT `ThreadLike_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Thread`(`threadId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadLike` ADD CONSTRAINT `ThreadLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadScrap` ADD CONSTRAINT `ThreadScrap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScrapMatch` ADD CONSTRAINT `ScrapMatch_scrapId_fkey` FOREIGN KEY (`scrapId`) REFERENCES `ThreadScrap`(`scrapId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScrapMatch` ADD CONSTRAINT `ScrapMatch_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Thread`(`threadId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Thread`(`threadId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMatch` ADD CONSTRAINT `SubjectMatch_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `ThreadSubject`(`subjectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMatch` ADD CONSTRAINT `SubjectMatch_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `Thread`(`threadId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryMatch` ADD CONSTRAINT `CategoryMatch_categotyId_fkey` FOREIGN KEY (`categotyId`) REFERENCES `Category`(`categotyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryMatch` ADD CONSTRAINT `CategoryMatch_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefeshToken` ADD CONSTRAINT `RefeshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoffeeChat` ADD CONSTRAINT `CoffeeChat_firstUserId_fkey` FOREIGN KEY (`firstUserId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoffeeChat` ADD CONSTRAINT `CoffeeChat_secondUserId_fkey` FOREIGN KEY (`secondUserId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpecifyInfo` ADD CONSTRAINT `SpecifyInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
