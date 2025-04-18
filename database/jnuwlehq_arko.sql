-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 18, 2025 at 03:56 PM
-- Server version: 8.0.36-cll-lve
-- PHP Version: 8.3.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jnuwlehq_arko`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_02_25_000422_create_user_infos_table', 1),
(5, '2025_02_25_003808_create_vessels_table', 1),
(6, '2025_02_25_003814_create_water_levels_table', 1),
(7, '2025_02_25_102409_create_personal_access_tokens_table', 1),
(8, '2025_02_25_103718_create_strandeds_table', 1),
(9, '2025_02_25_103802_create_operations_table', 1),
(10, '2025_03_02_172057_create_otp_verifications_table', 1),
(11, '2025_03_13_024038_create_operators_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `operations`
--

CREATE TABLE `operations` (
  `operation_id` bigint UNSIGNED NOT NULL,
  `operated_by` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vessel` bigint UNSIGNED DEFAULT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `operators`
--

CREATE TABLE `operators` (
  `operator_id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(110, 'App\\Models\\User', 6, 'janesmith', '1392e260f73b5cd270fd3045c231ba36e0b6debe01f4f194b11ef2087c2b486f', '[\"*\"]', '2025-04-17 22:43:43', NULL, '2025-04-17 22:41:22', '2025-04-17 22:43:43');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0ce8OEXdEZfBkU1Cu42C6n1THIhdas2vsQE3T8IH', NULL, '43.130.37.243', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3Y4VjA2Ym1kYjc1OExGTm5MVldDaUhkdk91ZVVMeUJXTTlyZzdYeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744699371),
('0degzM34nOoj0AdJ7AKxageSVmJ1tcWdPo56gy1J', NULL, '27.115.124.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibG5LbGVSSzRweVMyejllMUVMVVQ1ZTcxcXNKallOeXd3M3dUQVNHUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868826),
('0m3HyuBoifV8jmyTJWF8WgvdVW0J05EB9ITyvL4O', NULL, '27.115.124.96', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ1p6OU1VbUx1RFZSdEJLTlROcVI5WVR2cmtxcGhOdkN3djlxWXpkeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868842),
('1BefXrkQW1p0QG0s1Z7dHWbFR8DUHj9BRProk5TH', NULL, '170.106.35.153', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMDBScElvU3VqS2E5MkhER3huWUlhbEtVZzJjQ2JCbWl3c3BGYVFWcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744889336),
('21WDT5rgTSt0LftcgdCCJiPAmjORynG9j28LOYyS', NULL, '43.130.40.120', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVzZGcjNWQXlES2NhTnA1QUd1bUZpUHdxVWtDYjlxRzhyb1gyak1iQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744796655),
('30YFIJsPk9NuJ1pkWFgqk0EgquvaL4CGhKUUqb14', NULL, '80.85.245.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGJSdjduQjBKQnA4RE9uS1VSR1o3TTVHZXdlMWkxdHFDYnVVUGNIViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744857564),
('37XU6QIxTZiQhSdeZOI2wBFCELd4gMsCkkqAhma2', NULL, '66.249.79.229', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.7049.84 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkVHeGdhTktQUlRoNWVaeDg0QlFzaXd4V2I5TXNmWGtnR1o5aE5pUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744831611),
('3GzYZPs7Bs5cGAE8F1URVuW0iiP8zpdV5XAPojzb', NULL, '5.133.192.197', 'Mozilla/5.0 (Android 14; Mobile; rv:123.0) Gecko/123.0 Firefox/123', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib25zWmVnY1pHNHBxQkxIbExXMEtuU1ExeFN3T0dBTlZwRVNnaTBDbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744627207),
('3IcoUTRB4HfwFJUjIxBG93SkfMKnwOH6Yhr4yK5E', NULL, '27.115.124.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU3h4Zm14V0NvNWhpamVnbkVlUGxseE9Ka0g4RklCdnhLRVB3bnF4QiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868829),
('3o0xVCRGdoFzRYgHBs5zOdnjGRUXpZz55AHdiAH1', NULL, '185.247.137.222', 'Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUjZvaTNlUlZvRlJDQjJaY3JUWEVMUlJ2ZUFvSUIxTm1DNXAzbGh4UyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744851176),
('4QPaOYqg2MFPFD43Xm3830jZ0FGEv59uESHw8SWJ', NULL, '147.185.132.231', 'Expanse, a Palo Alto Networks company, searches across the global IPv4 space multiple times per day to identify customers&#39; presences on the Internet. If you would like to be excluded from our scans, please send IP addresses/domains to: scaninfo@paloaltonetworks.com', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVDZ4QlJDTng3cHFOTXA1RTFDT3FaNHBSVzhsRjV2eWxja001YWticyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744758608),
('4RQIXhsAJE3Q6OXtyCIdCEAFeQ64qZt27GW4ISUA', NULL, '144.76.133.162', 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmlnbnh3c1BaUThhQnJBZU1LYnJUbE9wYmg0bUJkUmtqYUFrV3BidyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744818424),
('4yoWlL3wXRE5KkbkW5XfVS8GqtJMhxk7lYZ0Luls', NULL, '27.115.124.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicTRXaUsyUVVqejlZdzNDdWU1REdUMDVCeW1UeU5nWTQ3d1IxMFMxVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868825),
('61AvPPN7juqZMlZv9nJrVQyEFJIaP6JIzSJgVA31', NULL, '44.247.148.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnJZTUJMMEZqU0ZJMTZ1dHo0MkIxMWpPYm5HTkxlZjJmdEg2RnpnZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744569237),
('7GgRwyEWNSVEpYx54ZzXFwVquTdme6WF9N4ORkHv', NULL, '34.218.51.179', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiclI0NHhJVXFSNmQ4Vm4xYUlOTzB3V1ZqWkM2bmFMZG5oYVNXTEt5QSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744912339),
('8is8ic3F5HI6IBtcDAKtJE97yxI5nJM1YbiHQGNq', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoielNQZWZTNDlRZHJQakJSTVE0blRINzhUaU1qSzlvOU95OXd0R3NkRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744655976),
('AE800w2byseLuvCBfDRTqXx69m6YXBY1SDa0MSZg', NULL, '43.166.134.114', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib1ZEZlEwN3d4TDRWSnpnZGo4bzNBSjZWZzR3aVFpa0R3SlFvN29ZUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744679832),
('AfBwsjMnCgaoCMm9ZmctJElIRGxkoAIVZyZn8Q9B', NULL, '49.51.52.250', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkxMOFcyWlNHMzExQTc4SlB6UTdqelZXM0lMQUtqZFFKcmJNbGdzcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744892546),
('aI8s7SkaIYhLt4LFCo9oHPNDv2pz7a1bOBs1zXrw', NULL, '106.119.167.146', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0x0UmhaQXd1bGtzbEFwMHVFQ0loZk9oaTlWc09nQXVFSE5ETVBoNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744616322),
('aN766gDEGSwOr4fLZFB5pYSjRWd9rBHVJlhs9MW9', NULL, '180.110.203.108', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM1QySDBuR1UxUzZXVXVGTld1NHhrYW1Ld1hDUnN1VzRrbnEzMmlnTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744668479),
('AVzMnXT9jXcSsQ5OC9Vc2T8fTCBFBxkxAQP3DMdA', NULL, '182.42.111.156', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiclpFczZ4Z3A3d25kY0Nrc2E0am04eXRWcEZUY2xyanVEN2M3Z0VqUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744824748),
('bHSWXK7M3OZNlRTOm9vVcJOVbr28y2nDZQiKTTpC', NULL, '104.198.147.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTVBQkJNZElmT3FKSTVTbG5DOXJsOWFhNmpzekJOMzNhTUhyU3JxZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744601357),
('BLw4LZ5P4ePl5XYUUPaZMYnKJdkxS3Aaz9xgEFnx', NULL, '125.94.144.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUtCMlMzajdGSlB2ODhKOVpkbTAwMWhOdWoxbDd4RUM1OU5MWXZCNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744807178),
('Ch5wnFtb7AEVp0pl4WDqJoXpOilh6LWhPkWhewKR', NULL, '117.62.235.53', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjQzRnRSYjROa2IxU2hvVzl2NlFDWklndnlUOEhNY09DaVpqWTRnbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744685146),
('COqvfSz4u8oJ9M79CVAEBxxpiNxzlKUJsnXmojc5', NULL, '43.156.204.134', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUURDTGlreXNHSDAzUjZQbTRBNXlRU0N6cHVnOUQzaUpzVkJIekduSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744793253),
('dF0rL8ftAZuM9kw1ozLYtosbbvS82sBuWm69sKiY', NULL, '27.115.124.96', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS0hYeVZMb2ZZWk1CZVZjOXJoNklNSEVKOUt1dFY5VUd2NGcwSHlScSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868846),
('DKIu2vN9iD7XwCw7fGxv0lv2oVOaEk9t4xxxZv3N', NULL, '43.159.143.139', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMEVnTWZhN2tzNlRkQW96cFduMEpmRkpSZ285UXdHSGdTZ0o2WEZtYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744862271),
('dpB6bslTENiZdjlYgVL1XrGRcIF5Xsb4HPuaX2XO', NULL, '182.42.110.255', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRmVtUnVOa3hIbVRsa0xDaVlRUHBEMEFoVnh6d2hqb3VvTVV2NUs4NCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744754885),
('DPTnFy5CB2jjunAuPVOvVv9bpkONZb6fy4qD5wkh', NULL, '43.159.128.237', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQVVVR3U2VllqVmtqVTRLdnhSeGhwbVhxMThFSHdKdkxPandVTnp2WiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744719864),
('dsqKIJWqrKeOisbvdtWs96DE83jD0MUvTSYjWJjk', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidTRLRGl2TjlzR2VKY1UyeTFhc2NFSFFPdUVDQVcySDRnZGtjRzhHQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744827714),
('EaX99MlVl9JEKyxCaLHMzL5T79YKCthbDW6qZ97Q', NULL, '43.166.237.57', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkROVzk3VmZYSzR1VTU4TjdoVms0ZmxHNzVXOTNKZThyeW5IN3FkZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744609929),
('EEVFey74AvNO0DtU08tygS38NNfbBhR5Ck0G2jM3', NULL, '170.106.147.63', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYm5qMnNyZWdCMWJSTkwwY0NkZEdJdGt2Q3dHcHRMUUtQS2FadUp0cyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744655193),
('ERlDIuyllBMCgdyqapgfyhgJKJ9KDxElXnyybnZp', NULL, '43.130.111.40', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmU5ek5nNEpBazdnOWdENUFWTXNLbGpkQ2NWb2c5cFZEbVlseFN4RSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744829472),
('F6lFWNo9elr16WdwGzm2HBpEnrAgyy2zoLDXXw2r', NULL, '80.85.246.71', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU2Q0VFBtc3B6OVA3ZmRpODZLN2c5WDZDUk5XZnBkVGc2OHdkTVRHbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744690615),
('FDETSDqvNHgLGD4AITngBxOAjZot5OI2rLxV32nJ', NULL, '18.236.163.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOGVnUDBCRmhWZFZ6TzZiOHFiQUpnaTZxMGNIejdBWkZuTjhsVXdiMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744691328),
('FJRlThOOgsApJ8YN9kbKP9HrY5BGiUu5NUKxEmwg', NULL, '104.198.147.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNkZJb216bU9GWHcxdTFTalVIQk1rZEhTWUF2cFE4NjlzUFhWUGl6RiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744601359),
('flgXqK3HbB15MBU9rGG1blPHYX8FXDr2ssBndLIB', NULL, '112.200.8.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmIyQkR3RExEQldRN2luNzNkT0plT0hPTUtjN1BXdjFLZlZjYWh1cyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744753234),
('FLYCPn5kOgLMhqaVnXnnSv7oJ4IpzroIDlby9iab', NULL, '182.42.105.144', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzZwcWdaSHVIMkE5M2hMQUpVZkw3V1pBaXRjRVRrVjFFWTgyWFlIQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744772420),
('FXlzFhUvbAt2nhacmvRJsWSEyASAm98A1COZ7suF', NULL, '139.59.44.113', 'Mozilla/5.0 (compatible)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid3ZPY0gyZGJsYnpEOGZad3RnQURrWE5JSmp1ajVXR2JRek1zNWVTOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744852772),
('gDUOLxMz8sfxuvTwvRPu70htOrtSOXIxPZhjzBWS', NULL, '165.154.227.105', 'Embarcadero URI Client/1.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXVmVEJxSDlOOVVZWVRJOFpKaTExQVVVUURneDFQbWxKOFpwd3ZTTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744642383),
('grWm6ce0MRmPCppNmWGNvsmRgFG2f5KUNnBtbBLa', NULL, '43.130.139.136', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUNBRng3b0ZaMW90UVJKdVdqQWFidkttTnJVU3B5TjVVSTVlTlBhaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744942481),
('gufQ4vmUWdppsGX6ZN0vfCVK7vXFvnIBirrUV5CB', NULL, '3.84.119.191', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3RtV211RGJzNVFYem54YTFVdE5NVWN1UjVzTEFndDd4dWp2VGZJViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744836150),
('H3fYqA70G07tChizhgE4Wm7l8Oae9gCctIDTqnTs', NULL, '212.34.141.109', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUVJkTVNYWHdtZmhOTXV0UzBGQmJScW9OUHZrcFpqWjNhQXZmNW1zQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744744618),
('H4OaHiMQTRO7qtVxUXg7fAxFhdoniRJJ2N1wsOjA', NULL, '147.182.234.206', 'Mozilla/5.0 (compatible)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXNHTnVKUVF4WExaVHMwNmY4VHR2cUY5VzVMUlhQZWt1NnJkZFNHRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744678312),
('H9oHjopVXOOKNsvD6PLTosl9ox5uVeY3Rx1pgnH7', NULL, '43.130.57.76', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnFkVTMyUEl4S0Y4dktBQmtoRGloZFpZczRwcGtuZEM5Mko4OEdnQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744658384),
('HFrIPvsyeMWCNcqtsgr9OZBuVlbNi0b00SieiOld', NULL, '104.198.147.160', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1U4bHdCNjFWc2Nic2JYV1daUHhEeVFWYzVoSVI0ZlBaMFBzRm1WNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744601360),
('hYEKMTlXhEQvmVru6R91gBjKgA78hV52vuLzLUEc', NULL, '180.110.203.108', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFF1ckJyV29LeloxdDh0MVpZQ2NmSzNRcWFoWklLamZxd083WlVLcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744912765),
('i69jSLLIYFvMo9zM1SEwz2ZCe9bczhKIEkg5E93C', NULL, '137.226.113.44', 'Mozilla/5.0 researchscan.comsys.rwth-aachen.de', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWF3cTNQOWtTdE95S1ZyeEZDT0ZzUFVtdm93Qkx4alIxMkxYaUdFQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vd3d3LmFya292ZXNzZWwuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1744806784),
('iXvDEsEwznmlDmlhJPp3SIwuQJZBPGyKg1pFRNO1', NULL, '93.158.91.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEl5YUlFM3RXa3VLV3hycnhnNUpkNEd5N2V0SkxMTERFSUw1MmNLOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744708605),
('jlT4GG9SwRpexnuxK1eEZU2LQiWQnjHmPHvIE2sa', NULL, '123.187.240.242', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzBoZG90MExLWDIxT3I2cTlUVGQ1Z2hFb1NKQlhrd202dkYxQjdXQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744633802),
('jt1o8tLVMDNazKeBsWhxqtbfAWCHgOoh85xYYVDZ', NULL, '139.59.44.113', 'Mozilla/5.0 (compatible)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNDg1ZmpyMWo4WWI3cXpNT3A5ZnNlSXBLek9zTE00S0tyRVk0SU9zaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744852771),
('jXCbewqEOMeFrL9znry1J82bF52GuYT12ADZIsVF', NULL, '104.152.52.67', 'curl/7.61.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzJxTDV4NjJObzNBb0lYU3FHV3R4ektPbTVxUmhlMXBGaTNrNHF5cSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744754920),
('kbEXkxfbmDfavCFjzbivapRE1iTg88pfPpKKijxg', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXdhZGF4Wm9CbTlWRThrcm5aN2NzWnROQ0lwTjNEVzBSaGlxTnJheCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744913918),
('kHUkRXKMkeP9UyY9fgYEohfv5p8TOMfkFMHGvMUo', NULL, '43.166.226.186', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRVFnbGxqMFgyVVBvcHJRQzlNcllOSzVabjJQTmNSRExneHhlWnlObCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744636429),
('LIl6Bbp4nu0HHQYJFRrMyg2GHWlnadu5E3aLg942', NULL, '114.96.103.33', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYXc2Rll3OUVBSWw3UVBsSDdLTXMxbHJIa1ZZbnZZTHIzNVBKRnRTNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744789545),
('Ma4OTfjhoiLUiL4xDSxP0K0FOsSEBwTwadzy3LS2', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDVMZ3VSalU0dE5ieGtMTTJCelhENnhPZFV5NVRsdkwzeUg4NWh1UCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744655976),
('maB39pRrWpQnHXH0cu2RzuCfsbJ2mgTZY6jmmoWl', NULL, '27.115.124.104', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU1JvNGRld3FVem9hUjFKWndxUzNQTGl5em1MN1ZpZEVGTFJGVFBzNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868829),
('MGkpwbJjU6MD8kXtH4VNlLjjPNYsqM44q6VmDsGe', NULL, '64.227.104.90', 'curl/8.9.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNE54UnlBaThlMmJyODZGWnlrcTJ3UmNJVmR6aU13ZlJxWEVoanFNayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744842788),
('mS6C4pVXcZteAsVM6fhYIAHedj2obpUmnIVCsXoT', NULL, '212.34.132.22', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkQ2aFVDeHRNT0h6V1BTNWx2VDA0WUh2ZzVtNm1Sbk5YUFdwUW1kaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744680696),
('MwM72RUqXCipjkubqrc6MfNHIbG5nPJTw3Vc0lVx', NULL, '43.166.255.122', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM1B4Sm9YdWdBaEtXdEFaY3Rmc055Wjd5b3poYlg0ZkpjSEFVQ2JvVCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744676786),
('NMoXXeJXGdCFV1XysmzelzN1shEFDiAcULE3ov9b', NULL, '51.222.253.12', 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSExQUDRXcTBScVRpaHpUdGxvQ2RFV0lsOFBmYjBGNzVOZ2pwaG4wZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744672253),
('nqFoidTUAzsHzPcKKlKjFn7oszVF4pZYTVug1iR2', NULL, '43.166.240.231', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmNZRzJuR2lnNDR0ZVBnVjNCdWRPNjh3djRwVGFDTVFXU1VsSGdRWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744633162),
('o9rxehVdEKHkcAO3rZhurlA9J81St8MdlaQLf5H9', NULL, '159.203.57.83', 'Mozilla/5.0 (compatible)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiczNiZ2ZmM1RpTjRBejRLQjhZSFVTUlRHOE1IaW5BUHB6cUNGeVdRNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744607117),
('OGFNhLImB9ik3nEooF40CEKFnIw2YCESpT3wUJ79', NULL, '185.247.137.101', 'Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkJMNXZFRUFIMzRaNmxDc05rN0tSd1lHN0pjNnQ3U1NWMm8yNzk2RCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744798850),
('oJCZETaUVTAaI0vYULyu4RnaWeL4M0qbuyEm9Orr', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0puU0dEZVk3YWhaeFBFSXNJU1B2YTlWZ3pUbWtTbUg5clFwMENkNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744568066),
('okHmnlGdjbY9QqeVFfm9Ebj5O2hvQ0ktuJ0pJIw6', NULL, '49.51.38.193', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFpRUVlMdEVEYTlmSlhHN0djNVNPSkdPUjEwQjZuQ0NqeVM5d1pGTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744722722),
('oOWojgzG9wjw9LF0SB3lfXRZcTnUspw7GFk84g3A', NULL, '163.172.147.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZWZMWmxUSG45cG80ZnQyVFhBd3Q3QUZWQ05KSlJKa3Rob0JzbFpxMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744898256),
('OsowEzb9cRRNivYQ3Yoifj6nNEcgXqENQWtI5cqt', NULL, '43.135.182.43', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnpObUJwaGlYblpnNTZRWVd5QVBvWEQ4d3hwVDRHZm1HUXpGYU1HRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744823135),
('P0pmUaDxW1oc4X0GVbqNyjTe64z9w5QyTZPK0A2l', NULL, '44.211.146.224', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRkNOMkgyNUNtV1k4b3ZMMEdzNU9Pb3ZwT0NlYlpiaFhnZ0dTUlpRUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vd3d3LmFya292ZXNzZWwuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1744738867),
('PaSZ56fzTvjYx90xRFBYP1EYLQ1e2KzvHNNEXhAp', NULL, '147.182.234.206', 'Mozilla/5.0 (compatible)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDRSQ1dTY2M1eUtMeXJJajBpT2xiWEFHV3hubVZ3VEFiQU5TVnE5QSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744678313),
('prWOuhrhBXZey3TXLoOgDrCPawYbDxoi7ydKelhV', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlo0c0Y4M0tXclh2ZkNlT3haTmx4VHZ3Y0tnbGprTlZOdWhPZzdpQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744827714),
('pT21tNKIeBytkqJj9e3opSn1e9kdpHG22WOq5zzQ', NULL, '52.54.71.95', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTDlFRHB6SXZVWHg2V20yZHBkSEFOdzNWWk1JMExrZHk0SHhMMUljaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744836153),
('PtzEL1v0O2q5DRxV4Sze2RDU4cCRNivvOfpD3Hdt', NULL, '182.42.111.156', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWRtQ05ZNWNxeEFrMVJCQk5rV0E4V0sxOU5JekhwNzZBdUk2cjA5ViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744929703),
('Pzgs7Ttg0poQmW52nqBsbD6YksF8kxmHzfdH91jn', NULL, '43.159.140.236', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWFGa2VoVDVtZ21MTGNrYXF2OEREV2xSQzVROXE3NHJmWE9KYUNjZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744866073),
('Q5mL7cpWbF16ZJ1PXHQCipY1W3kToz9sodUcZ1hd', NULL, '80.85.246.74', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYlpQc1dlOXRNTFdaVEFOTENkSUNueVRHU0UybDR5T2RrVFlZZG1zbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744697848),
('qArcNwbpSa8Vw3KYs9TCuRhfRD3J1hpMdo0JwZeZ', NULL, '107.174.244.108', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/130.0.2849.80', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3RHODZjYWc3TkJvN2ZmV1ZIVnQ4ZnhFeTNsckgxZ08wMDR2WFAxcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744740620),
('QCk5Kzpn1OOEa2ywlbQsPuBZCUq0RaIYWuZp7Lj1', NULL, '170.106.65.93', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia3NFSVl4MTJTYTRxUFM0NllJNDdEOEl2d0FPbklhV1Z2TDlOaG9PZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744946126),
('QhdGhcxfK5KSLSyDdJcur3O6DaK4avD98FMMnuGs', NULL, '51.222.253.19', 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic09YR0poc2M0amhqY1RCOHYwVXlSaDM3Q0JXWVJzbjNCdmIzbzZFMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744841905),
('QRiiDxam2H7LGrrM55M2wbjTM05bSE301opragKs', NULL, '42.83.147.53', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)Chrome/74.0.3729.169 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU0QzNm5RWWIzZDNTdmpNMGdDZGNsSm9aSTFGeVdyb3BwZE5iVlNaVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744816511),
('rMdAghl5NN2Ovkwj2jHURhyTQQoQOfM2QftlLZ1b', NULL, '64.227.104.90', 'curl/8.9.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNkxkR3hnTENCVEpEYmFRcFlocGlWQmhLRG8zamZOSDFVSDRwbFJRciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744842787),
('RPaZjsHoTVDbwj2rVtgr95buQNu8X5Jdz5plgDjB', NULL, '183.208.244.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3FZQ2M0QjZ4emRHTGtDNjZwNEtTQmR4a0hQRUNxODhVQjcxSWN5TCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744868820),
('s3gPYStSumijFntIlAjyrGUCHao5dNjArEKTbHCf', NULL, '93.159.230.28', 'Mozilla/5.0 (Linux; arm_64; Android 12; CPH2205) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 YaBrowser/23.3.3.86.00 SA/3 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEFxTFZyWmxGakIxUGFKb1pNTmNGNjNYTjRGZ0d0UTVETWt3TjNBYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744896729),
('SmDq8n1hYgwtZDg0u0OTfhXxNxuMI1PN1nRoVNVr', NULL, '162.62.132.25', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVm95VjFMbk1vSEVGZ21ldGp1NUk0akRZS1o2UGJudVRXMlU0Y3BxdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744587174),
('t0elXCI4uJPqon9B6zkpq2WmVqegqwkWULVzGig3', NULL, '165.154.227.243', 'Embarcadero URI Client/1.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib3Rwb2VsN3dZbDFkZkFETFA0S1pTcmQ3NEdEVkdMdkRVWTlLM3kyQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744633580),
('tbbVfJ2aapBc9bbHhG1j6wv4JVy59X6tzIR251VM', NULL, '43.166.131.228', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTDV3UlFCaU1BVzhmeHNXTHhnNHpoN1NqV0FaYXZVUkx5Z1htRUVJaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744751199),
('tfwBxzuoUMNAFeRCOWgXMgaO6KUvSrAu7T6lsXPz', NULL, '42.236.101.204', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36; 360Spider', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2JMOGtqcVBFZTR2UkxJclZVVjMwUlpCbjV0ZVNTYkpva3o4aW1rRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744890988),
('tSjP1ZRuZ94cQ7OBxmZig4rLNEAF0Z4RgrkCpFYE', NULL, '46.228.199.158', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.54', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidmlFM1RKT2hKQmtFc2FOTzF1VE5CODk2Tm1lMmw1SlgzQmpSZ25DZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744704441),
('TTYnNZEhMGtZDBvTwBPrVhdmHwKEuaUGv8Qvn7mN', NULL, '159.203.57.83', 'Mozilla/5.0 (compatible)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUNqSmhKWWl4QkdwcnVId1I3bkc1ZDhmNThia0hxNUx2UnEwdG42ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744607119),
('UBwNZSQ4cvDrTv4FpP3PWWTtuGzBveXnYQVqgDEG', NULL, '34.213.28.214', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieE5uUU1zQ0NDaDRIMnZIZnRva0NaUmxNMHZqM1dRcjIyZnhpWXFjMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744569425),
('Us9gdiKyrzdmThE8HoM6AOif2hWiAJfrQPWk95c2', NULL, '49.51.52.250', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic2E2a2YxNkpwMlhIVVZZSlFBMVlWSWZKRUdydUdONzZqTnVVU0lJaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744911059),
('VkWvAMKISNasRSVwj3mgnhQ5sSRqX2HgdUQLdfqT', NULL, '43.135.182.95', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicEs1M0ZEV240bms5V1Qyc25RWjJpTEgzdW5Hb0dwU1hvMWJhRTRMdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744702254),
('W9nf240F1K96JktixlzOj6TUF3G79voZ5ijxnVd7', NULL, '112.24.62.66', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXlXd3hZUWRNdDNqczk5TDkwWHhVWDY2RndNRHg1ZEpiTFc0Q3JVeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744868823),
('Wd2D77YTrbkzbEzaWoLwWCvOHI1Cko8Hy2LS0nrd', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTQxUmVYNHBLSUdCaHFVdXpLU1h1bmZsTVZWT1hMd3Z3M2U0WjhWRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744568066),
('wqPixCiTzBiznMPbD3vin7PEI3C9v4MM6p9tKVu3', NULL, '120.71.59.24', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOWw4VTRDTWxxYVBMTlVTcWt0MjZCNzdHTVg1U09Qbm5RN1l1bXRFMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744738094),
('WvMPfLVdHo3Db9jaVzvD9O58eik1m61tLeIabyUA', NULL, '195.2.81.171', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN3pWd3lMWm1IUzhiZEduUzdjbEt5dXpWVHdzeVhPaTVNNXJxMVdNSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744681777),
('x2f04QXxU6pNXKYTIhn4LSeKvXJPSYr2scNfrhy5', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmhWenUxMkI4U3d4MHZyNlBpT1F2YWUxZlgyQU50eEpZckNoSFJubyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744741039),
('X7hR0hCiJGq8O2bDRS2JC4YmcsFBZIFAK3iMBgsB', NULL, '111.172.249.49', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieHFERXpnUWNkeXRlV3I5a0dhbml5Q3ppOG1zeVhLYUJIUDZXTWEwUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744947472),
('Xo9qFvQhQ2KmJkZZvL1G685XF4clnW40AVAK8alY', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzZmVTlGVFhpQ1Z3TW5ueGdOTFhtUG9Jblo5UzRUNHJsZ0lwNlppTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744741039),
('y1SoyKUf83aE9oru3HJXNlJsZ2HeYZSOZUjrtxCh', NULL, '18.236.163.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZWVKdGMzd0JVSkp2NlV2MldLT082MGhTZkt6QmJMYnQ5QWVEWDAxZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744691326),
('Y6cMVX2tM4Q3lATNV548w3ClLG0TK0drpa6mFUp0', NULL, '133.200.41.128', 'python-requests/2.32.3', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXYxb05ZMlhhaFlteG16RktUWWNEUXFjbFF5eDVTZTZUUUFqTmtlRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744913918),
('Y6qBsxMKgo24901hJxJXQiNqooixSvoFzTlW5AYu', NULL, '14.215.163.132', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMTdRckF6aWJad2RWOGNmamNMUzVpSk1ic3B2SEhBVE5KTmhIRXJEZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744565524),
('YBjUYseClzUNAtrSJ8tZY1BgC2npjmY8WmmJf4QU', NULL, '34.218.51.179', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHZ6Nm1SR2YyOXNIZjlqNmVBNmRMWDl2V252YUpqSjRWRnl0ajRGVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744912352),
('ygquI7SrWnvf1YTA0VXxxOAZT3U8tMrMA3Rz49Wc', NULL, '34.213.28.214', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXNBQ2ZqZ0NoQ3VCQ3pjcTNBMGF1MlpybTVqa0pyM29yNUdsTFJ6MyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744569423),
('yGUe7me3y1rDfLODBMIfFoS8zFcT6wQDS1cQxmeV', NULL, '182.44.12.37', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaEc1YVJOQTdTeXJ3cWRFaWtIVjRjS0ttNFRFaGp2NUxoamc0MTFBUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly93d3cuYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744877021),
('yvj5t9wwCBtsanPq4fbD0Fofx1BdrKmc2jP3pTMo', NULL, '196.251.69.58', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0xGMkRrZmdiRm1lTEFCMG5vbVpCSkJzQkVOaGRaTFBtMXBHVndGTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744674270),
('yXvRBPSHv7bT0AH46IRkR4rrnRzbrL1EYZkkZNyo', NULL, '182.42.104.32', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVFIQTdsT1dUTkY0dG50Mm5UTkpHWkJKS0U5alVNUkVNY08xZkdJOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744651121),
('yYsfo3TLNQJA9gythsTSa89TMxd1diKviH4AzEQA', NULL, '44.247.148.64', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibnNRTTI3SDNacmlVQTNxSXJ3ZmxWZGZxOExrTXdPMWhuc0N5aldPdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9hcmtvdmVzc2VsLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1744569234),
('Zb1SvS4LMyPSxHUwr342bQoAHYj3qj3RXSxUu2mt', NULL, '27.115.124.96', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzliNUNUZHJETTZpV1Q0V25oaXFMS0FUMzBDY2NFVnlmU3NKR0lvayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744868845),
('zsYDw21onYiXeW0MtdATcPYK2AKoJqoSQTdUyxm3', NULL, '112.200.44.131', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGo1ejhzUFlrb3VKQnJHa2VmdThNaDhJWlJYa2tzeVJURzliZkY4WiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vYXJrb3Zlc3NlbC5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1744698561);

-- --------------------------------------------------------

--
-- Table structure for table `strandeds`
--

CREATE TABLE `strandeds` (
  `stranded_id` bigint UNSIGNED NOT NULL,
  `operation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pinned_by` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` int DEFAULT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_finished` datetime DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `strandeds`
--

INSERT INTO `strandeds` (`stranded_id`, `operation`, `pinned_by`, `number`, `latitude`, `longitude`, `type`, `date_finished`, `status`, `description`, `image`, `created_at`, `updated_at`) VALUES
(2, NULL, '2', NULL, '14.6481495', '120.9639136', 'SOS', NULL, 'Completed', NULL, 'request_images/1743328467_ARKO_2_image_1.jpg,request_images/1743328467_ARKO_2_image_2.jpg,request_images/1743328467_ARKO_2_image_3.jpg', '2025-03-30 01:54:27', '2025-03-30 05:56:21'),
(3, NULL, '2', NULL, '14.6538496', '120.9638123', 'SOS', NULL, 'Completed', NULL, 'request_images/1743343155_rn_image_picker_lib_temp_39735703-e97c-419e-a766-985528c93363.jpg,request_images/1743343155_rn_image_picker_lib_temp_347698b7-541a-4c75-8a6b-3dafd0397149.jpg', '2025-03-30 05:59:16', '2025-03-31 00:18:34'),
(4, NULL, '2', 5, '14.648153', '120.9638979', 'Medical Emergency', NULL, 'Cancelled', 'halp', 'request_images/1743409192_ARKO_2_03-31-2025_16-19_image_1.jpg,request_images/1743409192_ARKO_2_03-31-2025_16-19_image_2.jpg,request_images/1743409192_ARKO_2_03-31-2025_16-19_image_3.jpg', '2025-03-31 00:19:52', '2025-03-31 00:39:03'),
(5, NULL, '2', 5, '14.6481448', '120.9639086', 'Medical Emergency', NULL, 'Cancelled', NULL, 'request_images/1743410738_ARKO_2_03-31-2025_16-45_image_1.jpg,request_images/1743410738_ARKO_2_03-31-2025_16-45_image_2.jpg,request_images/1743410738_ARKO_2_03-31-2025_16-45_image_3.jpg', '2025-03-31 00:45:38', '2025-03-31 00:46:48'),
(6, NULL, '2', NULL, '14.6481431', '120.9639119', 'Medical Emergency', NULL, 'Cancelled', NULL, 'request_images/1743410856_ARKO_2_03-31-2025_16-47_image_1.jpg', '2025-03-31 00:47:36', '2025-03-31 00:48:45'),
(7, NULL, '2', NULL, '14.6481477', '120.9639097', 'Medical Emergency', NULL, 'Cancelled', NULL, 'request_images/1743410947_ARKO_2_03-31-2025_16-49_image_1.jpg', '2025-03-31 00:49:07', '2025-03-31 00:52:23'),
(8, NULL, '2', NULL, '14.6479939', '120.9639808', 'Medical Emergency', NULL, 'Cancelled', NULL, 'request_images/1743411176_ARKO_2_03-31-2025_16-52_image_1.jpg', '2025-03-31 00:52:56', '2025-04-03 03:09:02'),
(9, NULL, '2', NULL, '14.6535152', '120.9947284', 'SOS', NULL, 'Completed', NULL, 'request_images/1743762816_ARKO_2_04-04-2025_18-32_image_1.jpg,request_images/1743762817_ARKO_2_04-04-2025_18-32_image_2.jpg,request_images/1743762817_ARKO_2_04-04-2025_18-32_image_3.jpg', '2025-04-04 02:33:37', '2025-04-04 03:12:12'),
(10, NULL, '2', NULL, '14.653471', '120.994717', 'SOS', NULL, 'Cancelled', NULL, 'request_images/1743765991_ARKO_2_04-04-2025_19-26_image_1.jpg', '2025-04-04 03:26:31', '2025-04-04 03:32:20'),
(11, NULL, '2', NULL, '14.6535202', '120.9946957', 'SOS', NULL, 'Completed', NULL, 'request_images/1743766371_ARKO_2_04-04-2025_19-32_image_1.jpg', '2025-04-04 03:32:51', '2025-04-04 03:35:01'),
(12, NULL, '2', 1, '14.6535131', '120.9947113', 'SOS', NULL, 'En Route', 'please send help', '', '2025-04-04 03:35:40', '2025-04-04 03:35:40'),
(13, NULL, '6', NULL, '14.6480106', '120.9639571', 'SOS', NULL, 'Completed', NULL, '', '2025-04-17 22:01:35', '2025-04-17 22:01:35'),
(14, NULL, '6', NULL, '14.6481772', '120.963823', 'SOS', NULL, 'Cancelled', NULL, '', '2025-04-17 22:41:41', '2025-04-17 22:41:57'),
(15, NULL, '6', 2, '14.648009357448439', '120.96383493393661', 'Medical Emergency', NULL, 'Ongoing', '1 injured', '', '2025-04-17 22:43:17', '2025-04-17 22:43:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `email_verified_at`, `password`, `type`, `status`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'durandal', 'senciojohn14@gmail.com', NULL, '$2y$12$LVrokkzFcI5iMA1pasV/z.SWG94rh81kzb/qdSYO6etoKC2kW1owW', 'Admin', 'Active', NULL, '2025-03-25 02:46:14', '2025-04-03 01:38:38'),
(2, 'cmonsi', 'simonjermainecharles.bsit@gmail.com', NULL, '$2y$12$Pv4k1YECRlrjPhuyPDuzauXxjVI4ndC4UXsWVCU5FOS1rkzPRrZmi', 'user', 'Active', NULL, '2025-03-25 03:06:01', '2025-03-25 03:06:01'),
(5, 'sencio', 'kweeneunbi12@gmail.com', NULL, '$2y$12$0FQivAtYLbe6xK4e6TDrQuSZmUCsoZIYisqKtLvxamZHbxGvABJtW', 'Operator', 'Inactive', NULL, '2025-04-15 17:40:08', '2025-04-15 17:40:08'),
(6, 'janesmith', 'rtsukatsuki0019@gmail.com', NULL, '$2y$12$obCtpzAjjO0hgG837bbCRuQMfjdJbB5lmxiMOP44oAitQ5PzTenGK', 'user', 'Active', NULL, '2025-04-17 19:45:42', '2025-04-17 19:45:42');

-- --------------------------------------------------------

--
-- Table structure for table `user_infos`
--

CREATE TABLE `user_infos` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `f_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `m_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `l_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `house_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_infos`
--

INSERT INTO `user_infos` (`id`, `user_id`, `f_name`, `m_name`, `l_name`, `house_no`, `street`, `city`, `image`, `contact_no`, `gender`, `birth_date`, `created_at`, `updated_at`) VALUES
(1, 2, 'Jermaine Charles', 'Diata', 'Simon', '3c Dagat-Dagatan Ave', 'Poblacion', 'Caloocan', NULL, '9947803524', 'Male', '1974-04-04', '2025-03-25 03:06:02', '2025-03-25 03:06:02'),
(2, 6, 'Jane', 'Doe', 'Smith', '3c Dagat-Dagatan Ave', 'Poblacion', 'Caloocan', NULL, '09438264943', 'Female', '1997-04-28', '2025-04-17 19:45:43', '2025-04-17 19:45:43');

-- --------------------------------------------------------

--
-- Table structure for table `vessels`
--

CREATE TABLE `vessels` (
  `vessel_id` bigint UNSIGNED NOT NULL,
  `vessel_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `network_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vessels`
--

INSERT INTO `vessels` (`vessel_id`, `vessel_name`, `created_by`, `ip_address`, `network_name`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 'ARKO_1', 1, '192.168.1.213', 'ArkoProject', '14.6484335', '120.96457316666667', '2025-03-25 02:50:46', '2025-04-17 22:42:42');

-- --------------------------------------------------------

--
-- Table structure for table `water_levels`
--

CREATE TABLE `water_levels` (
  `level_id` bigint UNSIGNED NOT NULL,
  `operation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` double NOT NULL,
  `severity` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `operations`
--
ALTER TABLE `operations`
  ADD PRIMARY KEY (`operation_id`),
  ADD UNIQUE KEY `operations_operation_id_unique` (`operation_id`),
  ADD KEY `operations_vessel_foreign` (`vessel`);

--
-- Indexes for table `operators`
--
ALTER TABLE `operators`
  ADD PRIMARY KEY (`operator_id`),
  ADD UNIQUE KEY `operators_username_unique` (`username`),
  ADD UNIQUE KEY `operators_email_unique` (`email`),
  ADD KEY `operators_created_by_foreign` (`created_by`);

--
-- Indexes for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `otp_verifications_email_unique` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `strandeds`
--
ALTER TABLE `strandeds`
  ADD PRIMARY KEY (`stranded_id`),
  ADD UNIQUE KEY `strandeds_stranded_id_unique` (`stranded_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_infos`
--
ALTER TABLE `user_infos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_infos_user_id_foreign` (`user_id`);

--
-- Indexes for table `vessels`
--
ALTER TABLE `vessels`
  ADD PRIMARY KEY (`vessel_id`),
  ADD UNIQUE KEY `vessels_vessel_id_unique` (`vessel_id`),
  ADD KEY `vessels_created_by_foreign` (`created_by`);

--
-- Indexes for table `water_levels`
--
ALTER TABLE `water_levels`
  ADD PRIMARY KEY (`level_id`),
  ADD UNIQUE KEY `water_levels_level_id_unique` (`level_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `operations`
--
ALTER TABLE `operations`
  MODIFY `operation_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `operators`
--
ALTER TABLE `operators`
  MODIFY `operator_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `strandeds`
--
ALTER TABLE `strandeds`
  MODIFY `stranded_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_infos`
--
ALTER TABLE `user_infos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vessels`
--
ALTER TABLE `vessels`
  MODIFY `vessel_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `water_levels`
--
ALTER TABLE `water_levels`
  MODIFY `level_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `operations`
--
ALTER TABLE `operations`
  ADD CONSTRAINT `operations_vessel_foreign` FOREIGN KEY (`vessel`) REFERENCES `vessels` (`vessel_id`) ON DELETE CASCADE;

--
-- Constraints for table `operators`
--
ALTER TABLE `operators`
  ADD CONSTRAINT `operators_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_infos`
--
ALTER TABLE `user_infos`
  ADD CONSTRAINT `user_infos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `vessels`
--
ALTER TABLE `vessels`
  ADD CONSTRAINT `vessels_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
