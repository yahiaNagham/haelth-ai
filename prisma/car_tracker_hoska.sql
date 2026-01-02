-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 31 مايو 2024 الساعة 14:10
-- إصدار الخادم: 5.7.36
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_tracker_hoska`
--

-- --------------------------------------------------------

--
-- بنية الجدول `location`
--

DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imei` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` decimal(8,5) NOT NULL,
  `latitude` decimal(8,5) NOT NULL,
  `speed` tinyint(4) DEFAULT NULL,
  `satelliteQty` tinyint(4) DEFAULT NULL,
  `course` smallint(6) DEFAULT NULL,
  `sentAt` datetime(3) NOT NULL,
  `lbsMcc` smallint(6) DEFAULT NULL,
  `lbsMnc` tinyint(4) DEFAULT NULL,
  `lbsLac` smallint(6) DEFAULT NULL,
  `lbsTower` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE IF NOT EXISTS `status` (
  `imei` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `oil_connected` bit(1) DEFAULT NULL,
  `electricity_connected` bit(1) DEFAULT NULL,
  `gps_tracking` bit(1) DEFAULT NULL,
  `charge` bit(1) DEFAULT NULL,
  `acc` bit(1) DEFAULT NULL,
  `activated` bit(1) DEFAULT NULL,
  PRIMARY KEY (`imei`),
  UNIQUE KEY `Status_imei_key` (`imei`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `userdevices`
--

DROP TABLE IF EXISTS `userdevices`;
CREATE TABLE IF NOT EXISTS `userdevices` (
  `imei` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `car` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`imei`),
  UNIQUE KEY `UserDevices_imei_key` (`imei`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `userdevices`
--

INSERT INTO `userdevices` (`imei`, `car`, `user_id`) VALUES
('imei', 'bmw', 'saloma'),
('354', 'benz', '6e65e2c881');

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_id_key` (`id`),
  UNIQUE KEY `Users_email_key` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone_number`, `password`, `role`, `created_at`, `updated_at`) VALUES
('1c6584b095', 'salem', 'adminsalem@mail.com', '123456789', '$2b$10$1xZvk7Hh7QR5D2/X5d5uKOBqzBcmpcJNJnWntF/ww1xv4pYXkm9xu', 'admin', '2024-04-26 08:38:14.275', '2024-04-26 08:38:14.275'),
('287d73db9a', 'saloma', 'admin@mail.com', '123456789', '$2b$10$qT3tgu5NCW/eai.xhIjgcec4UwAhdI34ZqyHR4C1xKYq.zQt6/R/m', 'user', '2024-04-26 08:35:44.318', '2024-04-26 08:35:44.318'),
('2f71c8827c', 'sdf', 'salomas@gmail.com', '0673389128', '$2b$10$gjpHCNd6dHVY7BXsfIlthenaMpFaI8jr6GibveIwu8DzjMzdTNmDO', 'user', '2024-04-26 11:59:19.428', '2024-04-26 11:59:19.428'),
('12cdd77f4c', 'saloma', 'moh@mail.com', '0673389128', '$2b$10$rbXt53.ezo6a1U/7x7vype/GilBOOovO2Uu6hMr.jiqTWr5VNlfJi', 'user', '2024-05-30 20:10:31.726', '2024-05-30 20:10:31.726');

-- --------------------------------------------------------

--
-- بنية الجدول `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('6c32499f-ba72-479d-a628-4f036703d2c6', '1a7fa6f50036add0da95dd9be3c6a2c7e76e2d8ec575d610b23290e33c6f1d41', '2024-04-24 08:58:15.879', '20240424085815_init', NULL, NULL, '2024-04-24 08:58:15.828', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
