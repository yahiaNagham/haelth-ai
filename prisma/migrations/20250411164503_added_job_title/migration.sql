-- CreateTable
CREATE TABLE `admin` (
    `ID_A` INTEGER NOT NULL AUTO_INCREMENT,
    `Firstname` VARCHAR(100) NOT NULL,
    `Lastname` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `admin_Email_key`(`Email`),
    PRIMARY KEY (`ID_A`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `ID_App` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NULL,
    `family_fname` VARCHAR(50) NULL,
    `family_lname` VARCHAR(50) NULL,
    `date` DATE NULL,
    `time` TIME NULL,
    `notes` VARCHAR(255) NULL,
    `status` ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`ID_App`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient` (
    `ID_P` INTEGER NOT NULL AUTO_INCREMENT,
    `Firstname` VARCHAR(100) NOT NULL,
    `Lastname` VARCHAR(100) NOT NULL,
    `DateOfBirth` DATE NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(100) NOT NULL,
    `Gender` ENUM('Male', 'Female') NULL,
    `Phone` VARCHAR(20) NULL,
    `accountType` ENUM('Standard', 'Premium') NOT NULL DEFAULT 'Standard',
    `address` TEXT NULL,
    `location` TEXT NULL,

    UNIQUE INDEX `patient_Email_key`(`Email`),
    PRIMARY KEY (`ID_P`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`ID_P`) ON DELETE SET NULL ON UPDATE CASCADE;
