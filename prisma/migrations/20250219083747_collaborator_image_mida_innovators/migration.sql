-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `data` MEDIUMBLOB NOT NULL,
    `collaboratorId` VARCHAR(191) NULL,
    `newsImageId` INTEGER NULL,
    `newsGalleryId` VARCHAR(191) NULL,

    UNIQUE INDEX `Image_collaboratorId_key`(`collaboratorId`),
    UNIQUE INDEX `Image_newsImageId_key`(`newsImageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `data` LONGBLOB NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `collaboratorId` VARCHAR(191) NULL,
    `machineryCollaboratorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `Duration` VARCHAR(191) NOT NULL,
    `Active` BOOLEAN NOT NULL,
    `imageId` VARCHAR(191) NULL,
    `galleryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `News_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collaborator` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `primaryPhoneNumber` VARCHAR(191) NOT NULL,
    `optionalPhoneNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `site` VARCHAR(191) NULL,
    `industrialSector` VARCHAR(191) NOT NULL,
    `specialization` VARCHAR(191) NOT NULL,
    `experienceProvided` VARCHAR(191) NULL,
    `machineryAndEquipment` VARCHAR(191) NULL,
    `imageId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Collaborator_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NewsGallery` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_NewsGallery_AB_unique`(`A`, `B`),
    INDEX `_NewsGallery_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_collaboratorId_fkey` FOREIGN KEY (`collaboratorId`) REFERENCES `Collaborator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_machineryCollaboratorId_fkey` FOREIGN KEY (`machineryCollaboratorId`) REFERENCES `Collaborator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collaborator` ADD CONSTRAINT `Collaborator_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NewsGallery` ADD CONSTRAINT `_NewsGallery_A_fkey` FOREIGN KEY (`A`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NewsGallery` ADD CONSTRAINT `_NewsGallery_B_fkey` FOREIGN KEY (`B`) REFERENCES `News`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
