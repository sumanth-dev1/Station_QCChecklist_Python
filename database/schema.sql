-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2026 at 08:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `station_info`
--

-- --------------------------------------------------------

--
-- Table structure for table `dc_convertor`
--

CREATE TABLE `dc_convertor` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dc_convertor`
--

INSERT INTO `dc_convertor` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26015, '8.1', 'Installation', 'Relay rack shall be installed as per the approved Floor Plan drawing, mounted on insulators, and secured to the floor by grouting as per diagram 5 16 76 0059.', 'Relay rack installed as per the approved Floor Plan drawing, mounted on insulators, and secured to the floor by grouting as verified on 1/6/2026', NULL, 'Ok', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(2, 26015, '8.2', 'Wiring', 'Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & contact type, Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.', '', NULL, 'Select', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(3, 26015, '8.3', 'Wiring', 'For EI Stations, verify all connections as per the approved EI Interface diagrams (vendor specific).', '', NULL, 'Select', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(4, 26015, '8.4', 'Wiring', 'WAGO terminal details shall be as per interface circuit diagram 5 16 49 0685.', '', NULL, 'Select', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(5, 26015, '8.5', 'Continuity Test / Bell Test', 'Completed Station Analyser and Bell Test reports shall be available.', '', NULL, 'Select', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(6, 26015, '8.6', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(7, 26015, '8.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-01 08:54:12', '2026-06-01 08:54:12'),
(8, 26418, '8.1', 'Installation', 'Relay rack shall be installed as per the approved Floor Plan drawing, mounted on insulators, and secured to the floor by grouting as per diagram 5 16 76 0059.', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(9, 26418, '8.2', 'Wiring', 'Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & contact type, Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(10, 26418, '8.3', 'Wiring', 'For EI Stations, verify all connections as per the approved EI Interface diagrams (vendor specific).', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(11, 26418, '8.4', 'Wiring', 'WAGO terminal details shall be as per interface circuit diagram 5 16 49 0685.', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(12, 26418, '8.5', 'Continuity Test / Bell Test', 'Completed Station Analyser and Bell Test reports shall be available.', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(13, 26418, '8.6', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(14, 26418, '8.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Applicable', '2026-06-23 11:40:07', '2026-06-23 11:40:07'),
(15, 26014, '8.1', 'Installation', 'Relay rack shall be installed as per the approved Floor Plan drawing, mounted on insulators, and secured to the floor by grouting as per diagram 5 16 76 0059.', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42'),
(16, 26014, '8.2', 'Wiring', 'Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & contact type, Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42'),
(17, 26014, '8.3', 'Wiring', 'For EI Stations, verify all connections as per the approved EI Interface diagrams (vendor specific).', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42'),
(18, 26014, '8.4', 'Wiring', 'WAGO terminal details shall be as per interface circuit diagram 5 16 49 0685.', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42'),
(19, 26014, '8.5', 'Continuity Test / Bell Test', 'Completed Station Analyser and Bell Test reports shall be available.', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42'),
(20, 26014, '8.6', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42'),
(21, 26014, '8.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Applicable', '2026-06-23 17:39:41', '2026-06-23 17:39:42');

-- --------------------------------------------------------

--
-- Table structure for table `gps_gsm_antenna`
--

CREATE TABLE `gps_gsm_antenna` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `s_no` varchar(50) NOT NULL,
  `station_id` varchar(50) DEFAULT NULL,
  `image_path` varchar(5000) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `row_key` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `images`
--

-- (images table empty for fresh installation)

-- --------------------------------------------------------

--
-- Table structure for table `installation_of_kavach_equipment`
--

CREATE TABLE `installation_of_kavach_equipment` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `installation_of_kavach_equipment`
--

INSERT INTO `installation_of_kavach_equipment` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26014, '5.1.1', 'Installation', 'Kavach unit shall be installed as per the approved floor plan drawing, mounted on the floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0056.', 'Floor plan not available & torque not applied Verified on 11/05/2026', NULL, 'Not Ok', '2026-05-11 06:59:31', '2026-06-23 17:46:55'),
(2, 26014, '5.1.2', 'Cabling', 'All external cables shall enter through cable glands only. No unused cable entries left open. Ensure mill connector shall be locked properly.', '', NULL, 'Not Ok', '2026-05-11 06:59:31', '2026-06-23 17:46:55'),
(3, 26014, '5.1.3', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-05-11 06:59:31', '2026-06-23 17:46:55'),
(4, 26014, '5.1.4', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-05-11 06:59:31', '2026-06-23 17:46:55'),
(5, 26014, '5.1.5', 'Termination Unit', 'Station Kavach Termination Unit shall be wall-mounted near the Kavach unit using insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0045.', 'Station Kavach Termination Unit  wall-mounted near the Kavach unit using insulator but torque not applied verified on 11/05/2026', NULL, 'Not Ok', '2026-05-11 06:59:31', '2026-06-23 17:46:55'),
(6, 26014, '5.1.6', 'Termination Unit', 'OFC cables for SMOCIP and RTU shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.', '', NULL, 'Not Ok', '2026-05-11 06:59:31', '2026-06-23 17:46:55'),
(7, 26015, '5.1.1', 'Installation', 'Kavach unit shall be installed as per the approved floor plan drawing, mounted on the floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0056.', 'floor plan not available and torque not applied verified on 1/6/2026', NULL, 'Not Ok', '2026-06-01 07:20:47', '2026-06-01 12:06:02'),
(8, 26015, '5.1.2', 'Cabling', 'All external cables shall enter through cable glands only. No unused cable entries left open. Ensure mill connector shall be locked properly.', '', NULL, 'Select', '2026-06-01 07:20:47', '2026-06-01 12:06:02'),
(9, 26015, '5.1.3', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-01 07:20:47', '2026-06-01 12:06:02'),
(10, 26015, '5.1.4', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-01 07:20:47', '2026-06-01 12:06:02'),
(11, 26015, '5.1.5', 'Termination Unit', 'Station Kavach Termination Unit shall be wall-mounted near the Kavach unit using insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0045.', '', NULL, 'Select', '2026-06-01 07:20:47', '2026-06-01 12:06:02'),
(12, 26015, '5.1.6', 'Termination Unit', 'OFC cables for SMOCIP and RTU shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.', '', NULL, 'Select', '2026-06-01 07:20:47', '2026-06-01 12:06:02'),
(13, 26015, '5.3.1', 'Installation', 'Two antennas shall be installed on the Kavach room rooftop with a minimum separation of 3 meters, grouting shall be carried out as per diagram 5 16 67 0039, and torque of 10 Nm shall be applied for M6 fasteners with torque marking provided.', 'Two antennas  installed on the Kavach room rooftop with a minimum separation of 3 meters, but torque not applied as verified on  1/6/2026', NULL, 'Not Ok', '2026-06-01 07:31:58', '2026-06-01 12:06:31'),
(14, 26015, '5.3.2', 'Installation', 'No obstruction above antennas like tree branches, sun-shades, and ensure open to sky etc.', 'No obstruction above antennas verified on 1/6/2026', NULL, 'Ok', '2026-06-01 07:31:58', '2026-06-01 12:06:31'),
(15, 26015, '5.3.3', 'Cabling', 'Antenna cables shall be routed via diverse paths.', 'Antenna cables routed via diverse paths verified on 1/6/2026', NULL, 'Ok', '2026-06-01 07:31:58', '2026-06-01 12:06:31'),
(16, 26015, '5.3.4', 'Cabling', 'Separate conduits shall be used and Roof conduits shall be sealed against dust, water, and insects.', 'Separate conduits  used and Roof conduits sealed against dust verified on 1/6/2026', NULL, 'Ok', '2026-06-01 07:31:58', '2026-06-01 12:06:31'),
(17, 26015, '5.3.5', 'Cabling', 'In each antenna, the GPS and GSM cables shall be connected to their respective connectors as per the labels provided on the antenna.', 'In each antenna, the GPS and GSM cables connected to their respective connectors verified on 1/6/2026', NULL, 'Ok', '2026-06-01 07:31:58', '2026-06-01 12:06:31'),
(18, 26015, '5.4.1', 'Installation', 'RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0057.', 'Floor plan not available and torque not applied as found on 1/5/2026', NULL, 'Not Ok', '2026-06-01 07:36:36', '2026-06-01 07:36:36'),
(19, 26015, '5.4.2', 'Cabling', 'All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Select', '2026-06-01 07:36:36', '2026-06-01 07:36:36'),
(20, 26015, '5.4.3', 'Cabling', 'OFC patch cords shall be properly tagged to identify default and standby links.', '', NULL, 'Select', '2026-06-01 07:36:36', '2026-06-01 07:36:36'),
(21, 26015, '5.4.4', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-01 07:36:36', '2026-06-01 07:36:36'),
(22, 26015, '5.4.5', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-01 07:36:36', '2026-06-01 07:36:36'),
(23, 26015, '5.4.6', 'FDMS Box installation', 'FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.', '', NULL, 'Select', '2026-06-01 07:36:36', '2026-06-01 07:36:36'),
(24, 26417, '5.4.1', 'Installation', 'RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0057.', 'floor plan not available and torque not applied verified on 4/6/2026', NULL, 'Not Ok', '2026-06-07 15:54:28', '2026-06-07 15:54:28'),
(25, 26417, '5.4.2', 'Cabling', 'All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Select', '2026-06-07 15:54:28', '2026-06-07 15:54:28'),
(26, 26417, '5.4.3', 'Cabling', 'OFC patch cords shall be properly tagged to identify default and standby links.', '', NULL, 'Select', '2026-06-07 15:54:28', '2026-06-07 15:54:28'),
(27, 26417, '5.4.4', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-07 15:54:28', '2026-06-07 15:54:28'),
(28, 26417, '5.4.5', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-07 15:54:28', '2026-06-07 15:54:28'),
(29, 26417, '5.4.6', 'FDMS Box installation', 'FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.', '', NULL, 'Select', '2026-06-07 15:54:28', '2026-06-07 15:54:28'),
(30, 260150, '5.4.1', 'Installation', 'RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0057.', 'floor plan not available & torque not applied as verified on 19/6/2026', NULL, 'Not Ok', '2026-06-19 10:36:08', '2026-06-19 10:38:19'),
(31, 260150, '5.4.2', 'Cabling', 'All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Select', '2026-06-19 10:36:08', '2026-06-19 10:38:19'),
(32, 260150, '5.4.3', 'Cabling', 'OFC patch cords shall be properly tagged to identify default and standby links.', '', NULL, 'Select', '2026-06-19 10:36:08', '2026-06-19 10:38:19'),
(33, 260150, '5.4.4', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-19 10:36:08', '2026-06-19 10:38:19'),
(34, 260150, '5.4.5', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-19 10:36:08', '2026-06-19 10:38:19'),
(35, 260150, '5.4.6', 'FDMS Box installation', 'FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.', '', NULL, 'Select', '2026-06-19 10:36:08', '2026-06-19 10:38:19'),
(36, 26418, '5.1.1', 'Installation', 'Kavach unit shall be installed as per the approved floor plan drawing, mounted on the floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0056.', 'floor plan not available &Torque not applied as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-19 17:20:47', '2026-06-23 11:16:35'),
(37, 26418, '5.1.2', 'Cabling', 'All external cables shall enter through cable glands only. No unused cable entries left open. Ensure mill connector shall be locked properly.', 'cable laying work not done.', NULL, 'Not Ok', '2026-06-19 17:20:47', '2026-06-23 11:16:35'),
(38, 26418, '5.1.3', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-06-19 17:20:47', '2026-06-23 11:16:35'),
(39, 26418, '5.1.4', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-19 17:20:47', '2026-06-23 11:16:35'),
(40, 26418, '5.1.5', 'Termination Unit', 'Station Kavach Termination Unit shall be wall-mounted near the Kavach unit using insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0045.', 'floor plan not available &Torque not applied as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-19 17:20:47', '2026-06-23 11:16:35'),
(41, 26418, '5.1.6', 'Termination Unit', 'OFC cables for SMOCIP and RTU shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.', '', NULL, 'Not Ok', '2026-06-19 17:20:47', '2026-06-23 11:16:35'),
(42, 26418, '5.3.1', 'Installation', 'Two antennas shall be installed on the Kavach room rooftop with a minimum separation of 3 meters, grouting shall be carried out as per diagram 5 16 67 0039, and torque of 10 Nm shall be applied for M6 fasteners with torque marking provided.', 'Two antennas sh\ninstalled on the Kavach room rooftop with a minimum separation of 3 meters but torque not applied as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-19 17:28:39', '2026-06-23 11:18:53'),
(43, 26418, '5.3.2', 'Installation', 'No obstruction above antennas like tree branches, sun-shades, and ensure open to sky etc.', 'No obstruction above antennas like tree branches, sun-shades, and ensure open to sky verified on 5/6/2026', NULL, 'Ok', '2026-06-19 17:28:39', '2026-06-23 11:18:53'),
(44, 26418, '5.3.3', 'Cabling', 'Antenna cables shall be routed via diverse paths.', 'Antenna cables routed via diverse paths verified on 5/6/2026', NULL, 'Ok', '2026-06-19 17:28:39', '2026-06-23 11:18:53'),
(45, 26418, '5.3.4', 'Cabling', 'Separate conduits shall be used and Roof conduits shall be sealed against dust, water, and insects.', 'Separate conduits s\nused and Roof conduits sealed against dust, water, and insects.', NULL, 'Ok', '2026-06-19 17:28:39', '2026-06-23 11:18:53'),
(46, 26418, '5.3.5', 'Cabling', 'In each antenna, the GPS and GSM cables shall be connected to their respective connectors as per the labels provided on the antenna.', 'the GPS and GSM cables shall be connected to their respective connectors', NULL, 'Ok', '2026-06-19 17:28:39', '2026-06-23 11:18:53'),
(47, 26418, '5.2.1', 'Installation', 'SMOCIP shall be installed in the Station Master’s room at an ergonomic height. The panel shall be securely fixed using M6 screws and tightened to a torque of 8 Nm with torque marking applied, as per diagram 5 16 76 0040', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(48, 26418, '5.2.2', 'Termination Unit', 'SMOCIP Termination Unit shall be wall-mounted near the SMOCIP unit, using insulators, secured with M6 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0046', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(49, 26418, '5.2.3', 'Termination Unit', 'Power and OFC cables from Kavach termination unit shall be terminated as per diagram 5 16 49 0559.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(50, 26418, '5.2.4', 'Termination Unit', 'OFC cables of SMOCIP shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(51, 26418, '5.2.5', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(52, 26418, '5.2.6', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(53, 26418, '5.2.7', 'Functionality', 'System Health LED shall blink and ensure SYSTEM OK along with the respective station name shall be displayed on the Display.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(54, 26418, '5.2.8', 'Functionality', 'Verify that pressing the SOS and Common buttons on the SM-OCIP increments the mechanical counter by one.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(55, 26418, '5.2.9', 'Checksum', 'Verify the checksums as per the FAT certificate.', '', NULL, 'Not Applicable', '2026-06-23 11:17:27', '2026-06-23 11:17:27'),
(56, 26418, '5.4.1', 'Installation', 'RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0057.', '', NULL, 'Not Applicable', '2026-06-23 11:19:21', '2026-06-23 11:19:24'),
(57, 26418, '5.4.2', 'Cabling', 'All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Not Applicable', '2026-06-23 11:19:21', '2026-06-23 11:19:24'),
(58, 26418, '5.4.3', 'Cabling', 'OFC patch cords shall be properly tagged to identify default and standby links.', '', NULL, 'Not Applicable', '2026-06-23 11:19:21', '2026-06-23 11:19:24'),
(59, 26418, '5.4.4', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Applicable', '2026-06-23 11:19:21', '2026-06-23 11:19:24'),
(60, 26418, '5.4.5', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Applicable', '2026-06-23 11:19:21', '2026-06-23 11:19:24'),
(61, 26418, '5.4.6', 'FDMS Box installation', 'FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.', '', NULL, 'Not Applicable', '2026-06-23 11:19:21', '2026-06-23 11:19:24'),
(62, 26014, '5.2.1', 'Installation', 'SMOCIP shall be installed in the Station Master’s room at an ergonomic height. The panel shall be securely fixed using M6 screws and tightened to a torque of 8 Nm with torque marking applied, as per diagram 5 16 76 0040', 'SMOCIP not installed as verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(63, 26014, '5.2.2', 'Termination Unit', 'SMOCIP Termination Unit shall be wall-mounted near the SMOCIP unit, using insulators, secured with M6 bolts, and tightened to a torque of 8 Nm as per diagram 5 16 76 0046', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(64, 26014, '5.2.3', 'Termination Unit', 'Power and OFC cables from Kavach termination unit shall be terminated as per diagram 5 16 49 0559.', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(65, 26014, '5.2.4', 'Termination Unit', 'OFC cables of SMOCIP shall be spliced as per diagram 5 16 49 0559, and proper bunching and routing shall be ensured.', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(66, 26014, '5.2.5', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(67, 26014, '5.2.6', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(68, 26014, '5.2.7', 'Functionality', 'System Health LED shall blink and ensure SYSTEM OK along with the respective station name shall be displayed on the Display.', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(69, 26014, '5.2.8', 'Functionality', 'Verify that pressing the SOS and Common buttons on the SM-OCIP increments the mechanical counter by one.', '', NULL, 'Not Ok', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(70, 26014, '5.2.9', 'Checksum', 'Verify the checksums as per the FAT certificate.', '', NULL, 'Select', '2026-06-23 17:23:50', '2026-06-23 17:24:24'),
(71, 26014, '5.3.1', 'Installation', 'Two antennas shall be installed on the Kavach room rooftop with a minimum separation of 3 meters, grouting shall be carried out as per diagram 5 16 67 0039, and torque of 10 Nm shall be applied for M6 fasteners with torque marking provided.', 'Two antennas installed on the Kavach room rooftop with a minimum separation of 3 meters but torque not applied as verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:34:29', '2026-06-23 17:34:32'),
(72, 26014, '5.3.2', 'Installation', 'No obstruction above antennas like tree branches, sun-shades, and ensure open to sky etc.', 'No obstruction above antennas verified on 11/5/2026', NULL, 'Ok', '2026-06-23 17:34:29', '2026-06-23 17:34:32'),
(73, 26014, '5.3.3', 'Cabling', 'Antenna cables shall be routed via diverse paths.', 'Antenna cables  routed via diverse paths as verified on 11/5/2026', NULL, 'Ok', '2026-06-23 17:34:29', '2026-06-23 17:34:32'),
(74, 26014, '5.3.4', 'Cabling', 'Separate conduits shall be used and Roof conduits shall be sealed against dust, water, and insects.', '', NULL, 'Ok', '2026-06-23 17:34:29', '2026-06-23 17:34:32'),
(75, 26014, '5.3.5', 'Cabling', 'In each antenna, the GPS and GSM cables shall be connected to their respective connectors as per the labels provided on the antenna.', '', NULL, 'Ok', '2026-06-23 17:34:29', '2026-06-23 17:34:32'),
(76, 26014, '5.4.1', 'Installation', 'RIU shall be installed on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0057.', '', NULL, 'Not Applicable', '2026-06-23 17:34:56', '2026-06-23 17:34:57'),
(77, 26014, '5.4.2', 'Cabling', 'All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Not Applicable', '2026-06-23 17:34:56', '2026-06-23 17:34:57'),
(78, 26014, '5.4.3', 'Cabling', 'OFC patch cords shall be properly tagged to identify default and standby links.', '', NULL, 'Not Applicable', '2026-06-23 17:34:56', '2026-06-23 17:34:57'),
(79, 26014, '5.4.4', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Applicable', '2026-06-23 17:34:56', '2026-06-23 17:34:57'),
(80, 26014, '5.4.5', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Applicable', '2026-06-23 17:34:56', '2026-06-23 17:34:57'),
(81, 26014, '5.4.6', 'FDMS Box installation', 'FDMS Box shall be installed in the 15U/17U rack of the RIU with proper wall mounting, and OFC splicing shall be carried out as per the network drawing.', '', NULL, 'Not Applicable', '2026-06-23 17:34:56', '2026-06-23 17:34:57');

-- --------------------------------------------------------

--
-- Table structure for table `ips`
--

CREATE TABLE `ips` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ips`
--

INSERT INTO `ips` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '7.1', 'Installation', 'Network rack shall be installed as per approved floor plan and installation shall be done as per diagram 5 16 76 0058.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(2, 26418, '7.2', 'Installation', 'Patch cord routing shall be neat & bend radius to be maintained.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(3, 26418, '7.3', 'Cabling', 'All external cables entering the network rack shall pass through the grommets.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(4, 26418, '7.4', 'Cabling', 'OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(5, 26418, '7.5', 'Earthing', 'All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(6, 26418, '7.6', 'Earthing', 'Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(7, 26418, '7.7', 'Earthing', 'Bolts shall be tightened to a torque of 8 Nm, and torque marking shall be applied using yellow paint.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(8, 26418, '7.8', 'FDMS Box Installation in Network Rack', 'OFC cables shall be spliced in the FDMS box as per network drawing.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(9, 26418, '7.9', 'FDMS Box Installation in Network Rack', 'FDMS boxes shall be clearly marked to identify up and down links.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(10, 26418, '7.10', 'OFC cable continuity check, after splicing', 'OTDR test reports shall be available.', '', NULL, 'Not Applicable', '2026-06-23 11:38:57', '2026-06-23 11:38:57'),
(11, 26014, '7.1', 'Installation', 'Network rack shall be installed as per approved floor plan and installation shall be done as per diagram 5 16 76 0058.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(12, 26014, '7.2', 'Installation', 'Patch cord routing shall be neat & bend radius to be maintained.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(13, 26014, '7.3', 'Cabling', 'All external cables entering the network rack shall pass through the grommets.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(14, 26014, '7.4', 'Cabling', 'OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(15, 26014, '7.5', 'Earthing', 'All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(16, 26014, '7.6', 'Earthing', 'Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(17, 26014, '7.7', 'Earthing', 'Bolts shall be tightened to a torque of 8 Nm, and torque marking shall be applied using yellow paint.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(18, 26014, '7.8', 'FDMS Box Installation in Network Rack', 'OFC cables shall be spliced in the FDMS box as per network drawing.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(19, 26014, '7.9', 'FDMS Box Installation in Network Rack', 'FDMS boxes shall be clearly marked to identify up and down links.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07'),
(20, 26014, '7.10', 'OFC cable continuity check, after splicing', 'OTDR test reports shall be available.', '', NULL, 'Not Applicable', '2026-06-23 17:39:05', '2026-06-23 17:39:07');

-- --------------------------------------------------------

--
-- Table structure for table `laying_of_sectional_ofc_cable`
--

CREATE TABLE `laying_of_sectional_ofc_cable` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loginpage`
--

CREATE TABLE `loginpage` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('admin','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loginpage`
--

INSERT INTO `loginpage` (`id`, `username`, `employee_name`, `phone_number`, `password`, `role`) VALUES
(1, 'admin', 'Administrator', '9999999999', 'admin123', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `networking_rack`
--

CREATE TABLE `networking_rack` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `networking_rack`
--

INSERT INTO `networking_rack` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '6.1.1', 'RTU Fixing', 'Both RTUs shall be firmly secured to the tower platform using M12 bolts and nuts, and a torque of 85 Nm shall be applied as per diagram 5 16 67 0983.', 'RTU not installed as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(2, 26418, '6.1.2', 'RTU Fixing', 'Ensure RTU doors are fully closed and locked.', 'RTU not installed as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(3, 26418, '6.1.3', 'RTU Earthing', 'RTU shall be properly earthed by connecting a 35 sq.mm green to GI strip earthing conductor from the RTU earthing bolt to the designated earth pit-4, as per diagram 5 16 76 0043.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(4, 26418, '6.1.4', 'RTU Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(5, 26418, '6.1.5', 'OFC cable termination', 'OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU.\n(Ref. Drawing: 5 16 49 0559)', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(6, 26418, '6.1.6', 'OFC cable termination', 'OFC cables for RTU shall be spliced as per diagram 5 16 49 0559 and ensure bunching and routing shall be done properly.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(7, 26418, '6.1.7', '110V Power cable termination', 'Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(8, 26418, '6.1.8', '110V Power cable termination', '110 V DC power cables shall be terminated inside RTU as per approved drawing 5 16 49 0672.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(9, 26418, '6.1.9', '110V Power cable termination', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(10, 26418, '6.1.10', 'Cabiling', 'LMR 600 connection with proper routing; and clamping; No Joints shall be done, as per Tower SOP 5 16 90 0018.', '', NULL, 'Not Ok', '2026-06-23 11:25:36', '2026-06-23 11:57:20'),
(11, 26418, '6.2.1', 'RF antenna installation and Audit', 'RF antenna installation and orientation shall be done as per 10.2dBi omni-directional anteena diagram 5 16 67 0983.', 'RF antenna not installed as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-23 11:30:03', '2026-06-23 13:08:18'),
(12, 26418, '6.2.2', 'RF antenna installation and Audit', 'RF antenna installation audit report from the installation contractor shall be available in WFMS and there shall be no open points in the audit report.', 'RF antenna installation audit report verified on 5/6/2026', NULL, 'Not Available', '2026-06-23 11:30:03', '2026-06-23 13:08:18'),
(13, 26014, '6.1.1', 'RTU Fixing', 'Both RTUs shall be firmly secured to the tower platform using M12 bolts and nuts, and a torque of 85 Nm shall be applied as per diagram 5 16 67 0983.', 'RTU not installed, verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(14, 26014, '6.1.2', 'RTU Fixing', 'Ensure RTU doors are fully closed and locked.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(15, 26014, '6.1.3', 'RTU Earthing', 'RTU shall be properly earthed by connecting a 35 sq.mm green to GI strip earthing conductor from the RTU earthing bolt to the designated earth pit-4, as per diagram 5 16 76 0043.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(16, 26014, '6.1.4', 'RTU Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(17, 26014, '6.1.5', 'OFC cable termination', 'OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU.\n(Ref. Drawing: 5 16 49 0559)', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(18, 26014, '6.1.6', 'OFC cable termination', 'OFC cables for RTU shall be spliced as per diagram 5 16 49 0559 and ensure bunching and routing shall be done properly.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(19, 26014, '6.1.7', '110V Power cable termination', 'Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(20, 26014, '6.1.8', '110V Power cable termination', '110 V DC power cables shall be terminated inside RTU as per approved drawing 5 16 49 0672.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(21, 26014, '6.1.9', '110V Power cable termination', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(22, 26014, '6.1.10', 'Cabiling', 'LMR 600 connection with proper routing; and clamping; No Joints shall be done, as per Tower SOP 5 16 90 0018.', '', NULL, 'Not Ok', '2026-06-23 17:37:16', '2026-06-23 17:37:21'),
(23, 26014, '6.2.1', 'RF antenna installation and Audit', 'RF antenna installation and orientation shall be done as per 10.2dBi omni-directional anteena diagram 5 16 67 0983.', 'RF antenna not installed, verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:38:27', '2026-06-23 17:38:29'),
(24, 26014, '6.2.2', 'RF antenna installation and Audit', 'RF antenna installation audit report from the installation contractor shall be available in WFMS and there shall be no open points in the audit report.', '', NULL, 'Not Available', '2026-06-23 17:38:27', '2026-06-23 17:38:29');

-- --------------------------------------------------------

--
-- Table structure for table `outdoor_cabling`
--

CREATE TABLE `outdoor_cabling` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `row_key` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `outdoor_cabling`
--

INSERT INTO `outdoor_cabling` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`, `row_key`) VALUES
(1, 26418, '11.1', 'Cable route plan for OFC &amp; Power cable (Relay Room to Tower)', 'Railway-approved outdoor signalling cable route plan shall be available.', '', NULL, 'Not Available', '2026-06-23 11:52:04', '2026-06-23 11:52:04', NULL),
(2, 26418, '11.2', 'Cable route markers', 'Route markers shall be installed and clearly visible.', '', NULL, 'Not Ok', '2026-06-23 11:52:04', '2026-06-23 11:52:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pdu`
--

CREATE TABLE `pdu` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pdu`
--

INSERT INTO `pdu` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '9.1', 'Installation', 'Earthing shall be done as per RDSO Spec RDSO/SPN/197/2008', 'tower not installed as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-23 11:44:43', '2026-06-23 11:59:03'),
(2, 26418, '9.2', 'Earth Resistance Measurement', 'Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be lessthan or equal to 1 Ohm.', '', NULL, 'Select', '2026-06-23 11:44:43', '2026-06-23 11:59:03'),
(3, 26418, '9.3', 'Test Reports', 'Earth resistance test reports shall be available', 'tower not installed as verified on 5/6/2026', NULL, 'Not Available', '2026-06-23 11:44:43', '2026-06-23 11:59:03'),
(4, 26418, '9.4', 'Labeling', 'All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.', 'tower not installed as verified on 5/6/2026', NULL, 'Not Available', '2026-06-23 11:44:43', '2026-06-23 11:59:03'),
(5, 26014, '9.1', 'Installation', 'Earthing shall be done as per RDSO Spec RDSO/SPN/197/2008', 'Tower not installed verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:40:50', '2026-06-23 17:40:51'),
(6, 26014, '9.2', 'Earth Resistance Measurement', 'Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be lessthan or equal to 1 Ohm.', '', NULL, 'Select', '2026-06-23 17:40:50', '2026-06-23 17:40:51'),
(7, 26014, '9.3', 'Test Reports', 'Earth resistance test reports shall be available', 'Tower not installed verified on 11/5/2026', NULL, 'Not Available', '2026-06-23 17:40:50', '2026-06-23 17:40:51'),
(8, 26014, '9.4', 'Labeling', 'All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.', '', NULL, 'Not Available', '2026-06-23 17:40:50', '2026-06-23 17:40:51');

-- --------------------------------------------------------

--
-- Table structure for table `relay_rack`
--

CREATE TABLE `relay_rack` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `relay_rack`
--

INSERT INTO `relay_rack` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '12.1', 'RFID Tag Installation', 'Ensure the main RFID tag is installed in the direction specified in the RFID tag layout, and a duplicate RFID tag shall be installed at a distance of 3–5 meters from the main tag, except for turnout tags.', '', NULL, 'Not Ok', '2026-06-23 11:53:01', '2026-06-23 11:53:01'),
(2, 26418, '12.2', 'RFID Tag Installation', 'RFID tag mounting shall be firm and secure, ensuring no gap or mechanical play as per RFID tag installation procedure 5 53 76 0055.', '', NULL, 'Not Ok', '2026-06-23 11:53:01', '2026-06-23 11:53:01'),
(3, 26418, '12.3', 'RFID Tag data Validation and Placement verification', 'System-generated RFID data validation report and Placement verification report shall be available.', '', NULL, 'Not Available', '2026-06-23 11:53:01', '2026-06-23 11:53:01');

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `upload_date` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `last_uploaded_hash` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report`
--

-- (report table empty for fresh installation)

-- --------------------------------------------------------

--
-- Table structure for table `report_versions`
--

CREATE TABLE `report_versions` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `latest_version` int(11) DEFAULT 1,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report_versions`
--

-- (report_versions table empty for fresh installation)

-- --------------------------------------------------------

--
-- Table structure for table `rfid_tags`
--

CREATE TABLE `rfid_tags` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rf_antennas`
--

CREATE TABLE `rf_antennas` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rf_antennas`
--

INSERT INTO `rf_antennas` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26015, '4.1.1', 'Installation', 'IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0053', 'IPS PDU unit  mounted on the wall using M10 insulators but torque not applied verified on 1/6/2026', NULL, 'Not Ok', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(2, 26015, '4.1.2', 'Installation', 'Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0054', 'Station PDU unit  mounted on the wall using M10 insulators but torque not applied verified on 1/6/2026', NULL, 'Not Ok', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(3, 26015, '4.1.3', 'Cabling', 'All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', 'All external cables entering the PDU not passed through cable glands verified on 1/6/2026', NULL, 'Not Ok', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(4, 26015, '4.1.4', 'Cabling', 'Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671', '', NULL, 'Select', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(5, 26015, '4.1.5', 'Cabling', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Select', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(6, 26015, '4.1.6', 'Earthing', 'PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(7, 26015, '4.1.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(8, 26015, '4.1.8', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.', '', NULL, 'Select', '2026-06-01 09:04:19', '2026-06-01 12:09:04'),
(9, 26417, '4.1.1', 'Installation', 'IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0053', '', NULL, 'Not Applicable', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(10, 26417, '4.1.2', 'Installation', 'Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0054', 'Station PDU unit mounted on the wall using M8 insulators but torque not applied verified on 4/6/2026.', NULL, 'Not Ok', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(11, 26417, '4.1.3', 'Cabling', 'All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Select', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(12, 26417, '4.1.4', 'Cabling', 'Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671', '', NULL, 'Select', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(13, 26417, '4.1.5', 'Cabling', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Select', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(14, 26417, '4.1.6', 'Earthing', 'PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(15, 26417, '4.1.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(16, 26417, '4.1.8', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.', '', NULL, 'Select', '2026-06-07 15:45:14', '2026-06-08 06:00:44'),
(17, 260150, '4.2.1', 'Installation', 'DC-DC Converter unit shall be installed as per the approved floor plan drawing, mounted on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0055', 'Floor plan not available & torque not applied as verified on 19/6/2026', NULL, 'Not Ok', '2026-06-19 10:42:13', '2026-06-19 10:42:13'),
(18, 260150, '4.2.2', 'Cabling', 'All external cables entering the unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Select', '2026-06-19 10:42:13', '2026-06-19 10:42:13'),
(19, 260150, '4.2.3', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-19 10:42:13', '2026-06-19 10:42:13'),
(20, 260150, '4.2.4', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-19 10:42:13', '2026-06-19 10:42:13'),
(21, 260150, '4.2.5', 'Functionality', 'DC-DC converter output voltage shall be minimum 24 V DC, +/- 5% (22.8 VDC to 25.2 VDC)', '', NULL, 'Select', '2026-06-19 10:42:13', '2026-06-19 10:42:13'),
(22, 260150, '4.1.1', 'Installation', 'IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0053', 'Floor plan not available & torque not applied as verified on 19/6/2026', NULL, 'Not Ok', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(23, 260150, '4.1.2', 'Installation', 'Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0054', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(24, 260150, '4.1.3', 'Cabling', 'All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(25, 260150, '4.1.4', 'Cabling', 'Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(26, 260150, '4.1.5', 'Cabling', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(27, 260150, '4.1.6', 'Earthing', 'PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(28, 260150, '4.1.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(29, 260150, '4.1.8', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.', '', NULL, 'Select', '2026-06-19 10:44:25', '2026-06-19 10:44:25'),
(30, 26418, '4.1.1', 'Installation', 'IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0053', 'floor plan not available &Torque not applied as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(31, 26418, '4.1.2', 'Installation', 'Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0054', 'floor plan not available &Torque not applied as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(32, 26418, '4.1.3', 'Cabling', 'All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', 'cables laying work not done', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(33, 26418, '4.1.4', 'Cabling', 'Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671', 'cables laying work not done', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(34, 26418, '4.1.5', 'Cabling', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(35, 26418, '4.1.6', 'Earthing', 'PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(36, 26418, '4.1.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(37, 26418, '4.1.8', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.', '', NULL, 'Not Ok', '2026-06-19 17:17:38', '2026-06-23 11:14:53'),
(38, 26418, '4.2.1', 'Installation', 'DC-DC Converter unit shall be installed as per the approved floor plan drawing, mounted on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0055', 'DC-DC Converter unit not installed as verified on 5/6/2026', NULL, 'Not Ok', '2026-06-23 11:11:58', '2026-06-23 13:06:23'),
(39, 26418, '4.2.2', 'Cabling', 'All external cables entering the unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Not Ok', '2026-06-23 11:11:58', '2026-06-23 13:06:23'),
(40, 26418, '4.2.3', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-06-23 11:11:58', '2026-06-23 13:06:23'),
(41, 26418, '4.2.4', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-23 11:11:58', '2026-06-23 13:06:23'),
(42, 26418, '4.2.5', 'Functionality', 'DC-DC converter output voltage shall be minimum 24 V DC, +/- 5% (22.8 VDC to 25.2 VDC)', '', NULL, 'Select', '2026-06-23 11:11:58', '2026-06-23 13:06:23'),
(43, 26014, '4.1.1', 'Installation', 'IPS PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0053', 'floor plan not available & torque not applied as verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(44, 26014, '4.1.2', 'Installation', 'Station PDU unit shall be mounted on the wall using M8 insulators, secured with M8 bolts, and tightened to a torque of 20 Nm as per diagram 5 16 76 0054', 'floor plan not available & torque not applied as verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(45, 26014, '4.1.3', 'Cabling', 'All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(46, 26014, '4.1.4', 'Cabling', 'Output connections shall be maintained as per the Station PDU schematic diagram 5 16 49 0671', '', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(47, 26014, '4.1.5', 'Cabling', 'Ensure lugs with sleeves / Ferrules are properly crimped and inserted into the terminal; no loose strands shall be left.', '', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(48, 26014, '4.1.6', 'Earthing', 'PDU units shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(49, 26014, '4.1.7', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(50, 26014, '4.1.8', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 53 20 0024.', '', NULL, 'Not Ok', '2026-06-23 17:19:23', '2026-06-23 17:19:36'),
(51, 26014, '4.2.1', 'Installation', 'DC-DC Converter unit shall be installed as per the approved floor plan drawing, mounted on floor using M10 insulators, secured with M10 bolts, and tightened to a torque of 40 Nm as per diagram 5 16 76 0055', 'DC DC converter not installed as verified on 11/5/2026', NULL, 'Not Ok', '2026-06-23 17:21:47', '2026-06-23 17:22:31'),
(52, 26014, '4.2.2', 'Cabling', 'All external cables entering the unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Not Ok', '2026-06-23 17:21:47', '2026-06-23 17:22:31'),
(53, 26014, '4.2.3', 'Earthing', 'Unit shall be connected to the ring earth/busbar using a 10 sq.mm green/yellow earthing wire, and bolts shall be tightened to a torque of 8 Nm with torque marking applied.', '', NULL, 'Not Ok', '2026-06-23 17:21:47', '2026-06-23 17:22:31'),
(54, 26014, '4.2.4', 'Earthing', 'Crimping of lugs on earthing cables shall be carried out, and self-vulcanizing utility tape shall be applied.', '', NULL, 'Not Ok', '2026-06-23 17:21:47', '2026-06-23 17:22:32'),
(55, 26014, '4.2.5', 'Functionality', 'DC-DC converter output voltage shall be minimum 24 V DC, +/- 5% (22.8 VDC to 25.2 VDC)', '', NULL, 'Select', '2026-06-23 17:21:47', '2026-06-23 17:22:32');

-- --------------------------------------------------------

--
-- Table structure for table `riu`
--

CREATE TABLE `riu` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `riu`
--

INSERT INTO `riu` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '13.1', 'Materials Inspection (Which are not Inspected by RDSO or Consignee)', 'Verify that all subcontractors and HBL personnel use only approved make and part numbers as per the List of Acceptable I&C Materials EG-EN-FT-34.', '', NULL, 'Ok', '2026-06-23 11:53:09', '2026-06-23 11:53:14');

-- --------------------------------------------------------

--
-- Table structure for table `row_templates`
--

CREATE TABLE `row_templates` (
  `id` int(11) NOT NULL,
  `section_id` varchar(50) NOT NULL,
  `s_no` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `row_templates`
--

INSERT INTO `row_templates` (`id`, `section_id`, `s_no`, `description`, `created_at`) VALUES
(15, '2_0', '1.69', 'RS 485 OFC CONVERTER', '2026-06-08 07:21:37'),
(17, '2_0', '1.70', 'RIU battery -1', '2026-06-08 08:22:11'),
(18, '2_0', '1.71', 'RIU battery-2', '2026-06-08 09:02:46'),
(19, '2_0', '1.72', 'RIU battery -3', '2026-06-08 09:04:42'),
(20, '2_0', '1.73', 'RIU battery-4', '2026-06-08 09:06:14'),
(22, '2_0', '1.74', 'RIU FIU Termination Card 1', '2026-06-19 08:24:14'),
(23, '2_0', '1.75', 'RIU FIU Termination Card 2', '2026-06-19 08:24:58'),
(24, '2_0', '1.76', 'RIU FIU Termination Card 3', '2026-06-19 08:25:58'),
(25, '2_0', '1.77', 'RIU FIU Termination Card 4', '2026-06-19 08:26:31');

-- --------------------------------------------------------

--
-- Table structure for table `rtu`
--

CREATE TABLE `rtu` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rtu`
--

INSERT INTO `rtu` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '3.1', 'Tower Installation', 'Tower Commissioning Report from the contractor shall be available with the customer\'s sign-off, and there shall be no open points in the report.', 'Tower Commissioning Report not available', NULL, 'Not Available', '2026-06-23 11:04:41', '2026-06-23 11:04:49'),
(2, 26014, '3.1', 'Tower Installation', 'Tower Commissioning Report from the contractor shall be available with the customer\'s sign-off, and there shall be no open points in the report.', 'Tower Commissioning Report not available as verified on 11/5/2026', NULL, 'Not Available', '2026-06-23 17:09:45', '2026-06-23 17:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `smocip`
--

CREATE TABLE `smocip` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `smocip`
--

INSERT INTO `smocip` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26418, '10.1', 'Redundant cabling', 'Cabling shall be done as per station connectivity diagram 5 16 49 0614\nSegregation of power & communication cables.', 'Due to LC TCAS, SMOCIP not applicable', NULL, 'Ok', '2026-06-23 11:50:55', '2026-06-23 11:50:57'),
(2, 26418, '10.2', 'SMOCIP', '12 Core Signaling cable shall be used for button, counter & power supply.\nOFC armoured cables shall be used for communication.', 'Due to LC TCAS, SMOCIP not applicable', NULL, 'Ok', '2026-06-23 11:50:55', '2026-06-23 11:50:57'),
(3, 26418, '10.3', 'No Joints', 'No joints permitted except inside junction boxes or panels.', 'Due to LC TCAS, SMOCIP not applicable', NULL, 'Ok', '2026-06-23 11:50:55', '2026-06-23 11:50:57'),
(4, 26418, '10.4', 'Color Coding', 'Colour codes shall be followed for phase, neutral, and earth.', 'Due to LC TCAS, SMOCIP not applicable', NULL, 'Ok', '2026-06-23 11:50:55', '2026-06-23 11:50:57'),
(5, 26418, '10.5', 'Tagging/Labeling', 'Cables shall be tagged at both ends.', 'Due to LC TCAS, SMOCIP not applicable', NULL, 'Ok', '2026-06-23 11:50:55', '2026-06-23 11:50:57'),
(6, 26418, '10.6', 'Termination & Connection', 'Proper lugs/ferrules shall be used and terminals tightened correctly.', 'Due to LC TCAS, SMOCIP not applicable', NULL, 'Ok', '2026-06-23 11:50:55', '2026-06-23 11:50:57');

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `station_id` int(11) NOT NULL,
  `station_name` varchar(255) NOT NULL,
  `railway_zone` varchar(255) NOT NULL,
  `division` varchar(255) NOT NULL,
  `section_name` varchar(255) NOT NULL,
  `initial_date` varchar(255) NOT NULL,
  `updated_date` date NOT NULL,
  `id` int(11) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `completed_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `station`
--

INSERT INTO `station` (`station_id`, `station_name`, `railway_zone`, `division`, `section_name`, `initial_date`, `updated_date`, `id`, `start_time`, `completed_time`) VALUES
(3432, 'dummy', 'CR', 'Mumbai', 'Mumbai', '2026-04-24', '2026-04-24', 1, '2026-04-24 18:06:32', '2026-04-24 18:06:32'),
(26017, 'ORDI', 'WR', 'Ratlam', 'Rajkot', '2026-02-12', '2026-05-04', 2, '2026-05-04 14:33:50', '2026-05-04 14:33:50'),
(26014, 'NIMBAHERA', 'WR', 'Ratlam', 'Ratlam', '2026-05-11', '2026-06-23', 3, '2026-05-11 10:22:30', '2026-06-23 23:18:01'),
(26015, 'GHAMBHIRI ROAD', 'WR', 'Ratlam', 'Ratlam', '2026-05-18', '2026-06-24', 4, '2026-05-18 14:40:37', '2026-06-24 12:20:15'),
(26417, 'LC97', 'WR', 'Ratlam', 'Ratlam', '2026-06-05', '2026-06-19', 5, '2026-06-05 14:44:54', '2026-06-08 14:48:31'),
(111111, 'LC97', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-06-08', '2026-06-08', 6, '2026-06-08 12:57:28', '2026-06-08 12:57:28'),
(260150, 'Ghambhiri road OC', 'WR', 'Ratlam', 'Ratlam', '2026-06-19', '2026-06-19', 7, '2026-06-19 15:13:25', '2026-06-19 16:15:13'),
(26418, 'Chanderiya OC', 'WR', 'Ratlam', 'Ratlam', '2026-06-19', '2026-06-23', 8, '2026-06-19 21:22:19', '2026-06-23 18:40:38');

-- --------------------------------------------------------

--
-- Table structure for table `tag_to_tag_distance`
--

CREATE TABLE `tag_to_tag_distance` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tower`
--

CREATE TABLE `tower` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tower`
--

INSERT INTO `tower` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 26015, '2.1', 'KAVACH Building Works', 'Building Commissioning Report from the contractor shall be available with the customer\'s sign-off, and there shall be no open points in the report.', '', NULL, 'Not Applicable', '2026-06-01 07:15:32', '2026-06-01 07:15:32'),
(2, 26418, '2.1', 'KAVACH Building Works', 'Building Commissioning Report from the contractor shall be available with the customer\'s sign-off, and there shall be no open points in the report.', '', NULL, 'Not Applicable', '2026-06-23 11:02:10', '2026-06-23 11:02:10'),
(3, 26014, '2.1', 'KAVACH Building Works', 'Building Commissioning Report from the contractor shall be available with the customer\'s sign-off, and there shall be no open points in the report.', '', NULL, 'Not Applicable', '2026-06-23 17:08:44', '2026-06-23 17:08:44');

-- --------------------------------------------------------

--
-- Table structure for table `verification_of_equipment_serial_numbers`
--

CREATE TABLE `verification_of_equipment_serial_numbers` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `barcode_kavach_main_unit` varchar(255) DEFAULT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `row_key` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `verification_of_equipment_serial_numbers`
--

INSERT INTO `verification_of_equipment_serial_numbers` (`id`, `station_id`, `S_no`, `barcode_kavach_main_unit`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`, `row_key`) VALUES
(1, 26017, '1.1', '516303001225204', 'Stationary Kavach Unit', NULL, 'VERIFIED WITH IC &ATR', NULL, 'Matching', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'stationary-kavach-unit'),
(2, 26017, '1.2', '516102201125132', 'Peripheral Processing Card 1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'ppc_1'),
(3, 26017, '1.3', '', 'Peripheral Processing Card 2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'ppc_2'),
(4, 26017, '1.4', '', 'Vital Computer Card -1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vcc_1'),
(5, 26017, '1.5', '', 'Vital Computer Card -2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vcc-2'),
(6, 26017, '1.6', '', 'Vital Computer Card -3', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vcc-3'),
(7, 26017, '1.7', '', 'Voter Card -1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vc-1'),
(8, 26017, '1.8', '', 'Voter Card -2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vc-2'),
(9, 26017, '1.9', '', 'Vital Gateway Card 1 (S2S)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vgc-1'),
(10, 26017, '1.10', '', 'Vital Gateway Card 2 (S2S)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vgc-2'),
(11, 26017, '1.11', '', 'Vital Gateway Card 3 (NMS)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'vgc-3'),
(12, 26017, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'eig-1'),
(13, 26017, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'eig-2'),
(14, 26017, '1.14', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'fiu-1'),
(15, 26017, '1.15', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:53', 'fiu-2'),
(16, 26017, '1.16', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-3'),
(17, 26017, '1.17', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-4'),
(18, 26017, '1.18', '', 'FIU Scanner Card 5', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-5'),
(19, 26017, '1.19', '', 'FIU Scanner Card 6', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-6'),
(20, 26017, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-7'),
(21, 26017, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-8'),
(22, 26017, '1.22', '', 'RIU communication card 1-Host', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-comm-1'),
(23, 26017, '1.23', '', 'RIU communication card 2-Host', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-comm-2'),
(24, 26017, '1.24', '', 'RS 232-OFC converter 1 (STATION)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'rs-232-conv-1'),
(25, 26017, '1.25', '', 'RS 232-OFC converter 2 (STATION)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'rs-232-conv-2'),
(27, 26017, '1.27', '', 'FIU Termination Card 1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-1'),
(28, 26017, '1.28', '', 'FIU Termination Card 2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-2'),
(29, 26017, '1.29', '', 'FIU Termination Card 3', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-3'),
(30, 26017, '1.30', '', 'FIU Termination Card 4', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-4'),
(31, 26017, '1.31', '', 'FIU Termination Card 5', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-5'),
(32, 26017, '1.32', '', 'FIU Termination Card 6', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-6'),
(33, 26017, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-7'),
(34, 26017, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-term-8'),
(35, 26017, '1.35', '', 'DPS Card 1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'dps-1'),
(36, 26017, '1.36', '', 'DPS Card 2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'dps-2'),
(37, 26017, '1.37', '', 'GPS & GSM Antenna-1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'gps-gsm-1'),
(38, 26017, '1.38', '', 'GPS & GSM Antenna-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'gps-gsm-2'),
(39, 26017, '1.39', '', 'SMOCIP Unit', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'smocip'),
(40, 26017, '1.40', '', 'SMOCIP Termination Panel', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'smocip-term'),
(41, 26017, '1.41', '', 'Station Termination Panel', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'station-term-panel'),
(42, 26017, '1.42', '', 'Stationary PDU Box', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'station-pdu-box'),
(43, 26017, '1.43', '', 'IPS PDU Box', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'ips-pdu'),
(44, 26017, '1.44', '', 'DC-DC Converter (Relay racks)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'dc-dc-conv'),
(45, 26017, '1.45', '', 'RTU-1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'rtu-1'),
(46, 26017, '1.46', '', 'RTU-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'rtu-2'),
(47, 26017, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'station-radio-1'),
(48, 26017, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'station-radio-2'),
(49, 26017, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'next-gen-radio-1'),
(50, 26017, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'next-gen-radio-2'),
(51, 26017, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'rs-232-conv-rtu-1'),
(52, 26017, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'rs-232-conv-rtu-2'),
(55, 26017, '1.55', '', 'RIU Power Supply Card-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-power-2'),
(56, 26017, '1.56', '', 'RIU communication card 1-Remote', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-comm-remote-1'),
(57, 26017, '1.57', '', 'RIU communication card 2-Remote', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-comm-remote-2'),
(58, 26017, '1.58', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-scan-1'),
(59, 26017, '1.59', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-scan-2'),
(60, 26017, '1.60', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-scan-3'),
(61, 26017, '1.61', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'fiu-scan-4'),
(62, 26017, '1.62', '', 'RIU Battery Charge Cum Filter-1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-battery-1'),
(63, 26017, '1.63', '', 'RIU Battery Charge Cum Filter-2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-battery-2'),
(64, 26017, '1.64', '', 'RTU EMI FILTER_1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-emi-1'),
(65, 26017, '1.65', '', 'RTU EMI FILTER_2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'riu-emi-2'),
(66, 26017, '1.66', '', 'TCAS EMI FILTER _1', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'tcas-emi-1'),
(67, 26017, '1.67', '', 'TCAS EMI FILTER _2', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'tcas-emi-2'),
(68, 26017, '1.68', '', 'TCAS Cable Extender', NULL, '', NULL, 'Select', '2026-05-04 09:04:50', '2026-05-04 09:19:54', 'tcas-cable-extender'),
(69, 26014, '1.1', '516303001225205', 'Stationary Kavach Unit', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'stationary-kavach-unit'),
(70, 26014, '1.2', '516102201125145', 'Peripheral Processing Card 1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'ppc_1'),
(71, 26014, '1.3', '516102201125282', 'Peripheral Processing Card 2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'ppc_2'),
(72, 26014, '1.4', '516101001125150', 'Vital Computer Card -1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vcc_1'),
(73, 26014, '1.5', '516101001125228', 'Vital Computer Card -2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vcc-2'),
(74, 26014, '1.6', '516101001125147', 'Vital Computer Card -3', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vcc-3'),
(75, 26014, '1.7', '516106201025262', 'Voter Card -1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vc-1'),
(76, 26014, '1.8', '516106201025300', 'Voter Card -2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vc-2'),
(77, 26014, '1.9', '516174001125434', 'Vital Gateway Card 1 (S2S)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vgc-1'),
(78, 26014, '1.10', '516174001125478', 'Vital Gateway Card 2 (S2S)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vgc-2'),
(79, 26014, '1.11', '516174001125490', 'Vital Gateway Card 3 (NMS)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'vgc-3'),
(80, 26014, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'eig-1'),
(81, 26014, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:32', 'eig-2'),
(82, 26014, '1.14', '516111201225570', 'FIU Scanner Card 1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-1'),
(83, 26014, '1.15', '516111201225507', 'FIU Scanner Card 2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-2'),
(84, 26014, '1.16', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-3'),
(85, 26014, '1.17', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-4'),
(86, 26014, '1.18', '', 'FIU Scanner Card 5', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-5'),
(87, 26014, '1.19', '', 'FIU Scanner Card 6', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-6'),
(88, 26014, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-7'),
(89, 26014, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-8'),
(90, 26014, '1.22', '516138201225110', 'RIU communication card 1-Host', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'riu-comm-1'),
(91, 26014, '1.23', '516138201225187', 'RIU communication card 2-Host', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'riu-comm-2'),
(92, 26014, '1.24', '516173201225398', 'RS 232-OFC converter 1 (STATION)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'rs-232-conv-1'),
(93, 26014, '1.25', '516173201225359', 'RS 232-OFC converter 2 (STATION)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'rs-232-conv-2'),
(95, 26014, '1.27', '516113201225321', 'FIU Termination Card 1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-1'),
(96, 26014, '1.28', '516113201225317', 'FIU Termination Card 2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-2'),
(97, 26014, '1.29', '', 'FIU Termination Card 3', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-3'),
(98, 26014, '1.30', '', 'FIU Termination Card 4', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-4'),
(99, 26014, '1.31', '', 'FIU Termination Card 5', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-5'),
(100, 26014, '1.32', '', 'FIU Termination Card 6', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-6'),
(101, 26014, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-7'),
(102, 26014, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-term-8'),
(103, 26014, '1.35', '516103411125183', 'DPS Card 1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'dps-1'),
(104, 26014, '1.36', '516103421125196', 'DPS Card 2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'dps-2'),
(105, 26014, '1.37', '516300331254583', 'GPS & GSM Antenna-1', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'gps-gsm-1'),
(106, 26014, '1.38', '516300331254582', 'GPS & GSM Antenna-2', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'gps-gsm-2'),
(107, 26014, '1.39', '', 'SMOCIP Unit', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'smocip'),
(108, 26014, '1.40', '', 'SMOCIP Termination Panel', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'smocip-term'),
(109, 26014, '1.41', '516303441225333', 'Station Termination Panel', NULL, 's.no. Not Matched with IC/ATR as verified on 11/5/2026', NULL, 'Not Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'station-term-panel'),
(110, 26014, '1.42', '516300341225378', 'Stationary PDU Box', NULL, 's.no. Not Matched with IC/ATR as verified on 11/5/2026', NULL, 'Not Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'station-pdu-box'),
(111, 26014, '1.43', '516324341225150', 'IPS PDU Box', NULL, 's.no. Not Matched with IC/ATR as verified on 11/5/2026', NULL, 'Not Matching', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'ips-pdu'),
(112, 26014, '1.44', '516303220126010', 'DC-DC Converter (Relay racks)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Verified', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'dc-dc-conv'),
(113, 26014, '1.45', '', 'RTU-1', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'rtu-1'),
(114, 26014, '1.46', '', 'RTU-2', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'rtu-2'),
(115, 26014, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'station-radio-1'),
(116, 26014, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'station-radio-2'),
(117, 26014, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'next-gen-radio-1'),
(118, 26014, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'next-gen-radio-2'),
(119, 26014, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'rs-232-conv-rtu-1'),
(120, 26014, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Not Installed', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'rs-232-conv-rtu-2'),
(123, 26014, '1.55', '', 'RIU Power Supply Card-2', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'riu-power-2'),
(124, 26014, '1.56', '', 'RIU communication card 1-Remote', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'riu-comm-remote-1'),
(125, 26014, '1.57', '', 'RIU communication card 2-Remote', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'riu-comm-remote-2'),
(126, 26014, '1.58', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-scan-1'),
(127, 26014, '1.59', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-scan-2'),
(128, 26014, '1.60', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-scan-3'),
(129, 26014, '1.61', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:01', '2026-06-23 17:08:33', 'fiu-scan-4'),
(130, 26014, '1.62', '', 'RIU Battery Charge Cum Filter-1', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'riu-battery-1'),
(131, 26014, '1.63', '', 'RIU Battery Charge Cum Filter-2', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'riu-battery-2'),
(132, 26014, '1.64', '', 'RTU EMI FILTER_1', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'riu-emi-1'),
(133, 26014, '1.65', '', 'RTU EMI FILTER_2', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'riu-emi-2'),
(134, 26014, '1.66', '', 'TCAS EMI FILTER _1', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'tcas-emi-1'),
(135, 26014, '1.67', '', 'TCAS EMI FILTER _2', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'tcas-emi-2'),
(136, 26014, '1.68', '', 'TCAS Cable Extender', NULL, '', NULL, 'Not Applicable', '2026-05-11 04:56:02', '2026-06-23 17:08:33', 'tcas-cable-extender'),
(138, 26015, '1.1', '516303000326244', 'Stationary Kavach Unit', NULL, 'S no. Matched with IC/ATR verified on 30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'stationary-kavach-unit'),
(139, 26015, '1.2', '516102200326106', 'Peripheral Processing Card 1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'ppc_1'),
(140, 26015, '1.3', '516102200326184', 'Peripheral Processing Card 2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'ppc_2'),
(141, 26015, '1.4', '516101001251058', 'Vital Computer Card -1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vcc_1'),
(142, 26015, '1.5', '516101001251124', 'Vital Computer Card -2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vcc-2'),
(143, 26015, '1.6', '516101001225945', 'Vital Computer Card -3', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vcc-3'),
(144, 26015, '1.7', '516106200126323', 'Voter Card -1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vc-1'),
(145, 26015, '1.8', '516106200126259', 'Voter Card -2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vc-2'),
(146, 26015, '1.9', '516174000326111', 'Vital Gateway Card 1 (S2S)', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vgc-1'),
(147, 26015, '1.10', '516174000326094', 'Vital Gateway Card 2 (S2S)', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vgc-2'),
(148, 26015, '1.11', '516174000326299', 'Vital Gateway Card 3 (NMS)', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'vgc-3'),
(149, 26015, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'eig-1'),
(150, 26015, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'eig-2'),
(151, 26015, '1.14', '516111201251070', 'FIU Scanner Card 1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-1'),
(152, 26015, '1.15', '516111201251026', 'FIU Scanner Card 2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-2'),
(153, 26015, '1.16', '516111201251008', 'FIU Scanner Card 3', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-3'),
(154, 26015, '1.17', '516111201251023', 'FIU Scanner Card 4', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-4'),
(155, 26015, '1.18', '516111201251087', 'FIU Scanner Card 5', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-5'),
(156, 26015, '1.19', '516111201251043', 'FIU Scanner Card 6', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-6'),
(157, 26015, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-7'),
(158, 26015, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-8'),
(159, 26015, '1.22', '516138200126050', 'RIU communication card 1-Host', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-comm-1'),
(160, 26015, '1.23', '516138200126256', 'RIU communication card 2-Host', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-comm-2'),
(161, 26015, '1.24', '516173200226153', 'RS 232-OFC converter 1 (STATION)', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'rs-232-conv-1'),
(162, 26015, '1.25', '516173200226201', 'RS 232-OFC converter 2 (STATION)', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'rs-232-conv-2'),
(164, 26015, '1.27', '516113200226774', 'FIU Termination Card 1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-1'),
(165, 26015, '1.28', '516113200226764', 'FIU Termination Card 2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-2'),
(166, 26015, '1.29', '516113200226751', 'FIU Termination Card 3', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-3'),
(167, 26015, '1.30', '516113200226752', 'FIU Termination Card 4', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-4'),
(168, 26015, '1.31', '516113200226586', 'FIU Termination Card 5', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-5'),
(169, 26015, '1.32', '516113200226750', 'FIU Termination Card 6', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-6'),
(170, 26015, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-7'),
(171, 26015, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-term-8'),
(172, 26015, '1.35', '516103411225320', 'DPS Card 1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'dps-1'),
(173, 26015, '1.36', '516103421225368', 'DPS Card 2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'dps-2'),
(174, 26015, '1.37', '516300331254590', 'GPS & GSM Antenna-1', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'gps-gsm-1'),
(175, 26015, '1.38', '516300331254591', 'GPS & GSM Antenna-2', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'gps-gsm-2'),
(176, 26015, '1.39', '516303090126269', 'SMOCIP Unit', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'smocip'),
(177, 26015, '1.40', '516303451225183', 'SMOCIP Termination Panel', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'smocip-term'),
(178, 26015, '1.41', '516303441225329', 'Station Termination Panel', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'station-term-panel'),
(179, 26015, '1.42', '516300340126383', 'Stationary PDU Box', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'station-pdu-box'),
(180, 26015, '1.43', '163243404260053', 'IPS PDU Box', NULL, 'Sno. not Matched\nwith IC/ATR due to\nSTCAS unit  have\nbeen interchanged\nwith MLG Station\nverified on\n30/05/2026', NULL, 'Not Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'ips-pdu'),
(181, 26015, '1.44', '', 'DC-DC Converter (Relay racks)', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'dc-dc-conv'),
(182, 26015, '1.45', '', 'RTU-1', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'rtu-1'),
(183, 26015, '1.46', '', 'RTU-2', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'rtu-2'),
(184, 26015, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'station-radio-1'),
(185, 26015, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'station-radio-2'),
(186, 26015, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'next-gen-radio-1'),
(187, 26015, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'next-gen-radio-2'),
(188, 26015, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'rs-232-conv-rtu-1'),
(189, 26015, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Select', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'rs-232-conv-rtu-2'),
(192, 26015, '1.55', '516139200224152', 'RIU Power Supply Card-2', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-power-2'),
(193, 26015, '1.56', '516138500725038', 'RIU communication card 1-Remote', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-comm-remote-1'),
(194, 26015, '1.57', '516138500725060', 'RIU communication card 2-Remote', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-comm-remote-2'),
(195, 26015, '1.58', '516111200124094', 'FIU Scanner Card 1', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-scan-1'),
(196, 26015, '1.59', '516111200124019', 'FIU Scanner Card 2', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-scan-2'),
(197, 26015, '1.60', '516111200124228', 'FIU Scanner Card 3', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-scan-3'),
(198, 26015, '1.61', '516111200124010', 'FIU Scanner Card 4', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'fiu-scan-4'),
(199, 26015, '1.62', '516149200224037', 'RIU Battery Charge Cum Filter-1', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-battery-1'),
(200, 26015, '1.63', '516149200124041', 'RIU Battery Charge Cum Filter-2', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-battery-2'),
(201, 26015, '1.64', '', 'RTU EMI FILTER_1', NULL, '', NULL, 'Not Applicable', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-emi-1'),
(202, 26015, '1.65', '', 'RTU EMI FILTER_2', NULL, '', NULL, 'Not Applicable', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'riu-emi-2'),
(203, 26015, '1.66', '', 'TCAS EMI FILTER _1', NULL, '', NULL, 'Not Applicable', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'tcas-emi-1'),
(204, 26015, '1.67', '', 'TCAS EMI FILTER _2', NULL, '', NULL, 'Not Applicable', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'tcas-emi-2'),
(205, 26015, '1.68', '', 'TCAS Cable Extender', NULL, '', NULL, 'Not Applicable', '2026-05-18 09:12:12', '2026-06-24 06:49:34', 'tcas-cable-extender'),
(210, 26417, '1.1', '516303001025091', 'Stationary Kavach Unit', NULL, '', NULL, 'Not Applicable', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'stationary-kavach-unit'),
(211, 26417, '1.2', '', 'Peripheral Processing Card 1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'ppc_1'),
(212, 26417, '1.3', '', 'Peripheral Processing Card 2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'ppc_2'),
(213, 26417, '1.4', '', 'Vital Computer Card -1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vcc_1'),
(214, 26417, '1.5', '', 'Vital Computer Card -2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vcc-2'),
(215, 26417, '1.6', '', 'Vital Computer Card -3', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vcc-3'),
(216, 26417, '1.7', '', 'Voter Card -1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vc-1'),
(217, 26417, '1.8', '', 'Voter Card -2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vc-2'),
(218, 26417, '1.9', '', 'Vital Gateway Card 1 (S2S)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vgc-1'),
(219, 26417, '1.10', '', 'Vital Gateway Card 2 (S2S)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vgc-2'),
(220, 26417, '1.11', '', 'Vital Gateway Card 3 (NMS)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'vgc-3'),
(221, 26417, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'eig-1'),
(222, 26417, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'eig-2'),
(223, 26417, '1.14', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-1'),
(224, 26417, '1.15', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-2'),
(225, 26417, '1.16', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-3'),
(226, 26417, '1.17', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-4'),
(227, 26417, '1.18', '', 'FIU Scanner Card 5', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-5'),
(228, 26417, '1.19', '', 'FIU Scanner Card 6', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-6'),
(229, 26417, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-7'),
(230, 26417, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-8'),
(231, 26417, '1.22', '', 'RIU communication card 1-Host', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-comm-1'),
(232, 26417, '1.23', '', 'RIU communication card 2-Host', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-comm-2'),
(233, 26417, '1.24', '', 'RS 232-OFC converter 1 (STATION)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'rs-232-conv-1'),
(234, 26417, '1.25', '', 'RS 232-OFC converter 2 (STATION)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'rs-232-conv-2'),
(236, 26417, '1.27', '', 'FIU Termination Card 1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-1'),
(237, 26417, '1.28', '', 'FIU Termination Card 2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-2'),
(238, 26417, '1.29', '', 'FIU Termination Card 3', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-3'),
(239, 26417, '1.30', '', 'FIU Termination Card 4', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-4'),
(240, 26417, '1.31', '', 'FIU Termination Card 5', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-5'),
(241, 26417, '1.32', '', 'FIU Termination Card 6', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-6'),
(242, 26417, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-7'),
(243, 26417, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-term-8'),
(244, 26417, '1.35', '', 'DPS Card 1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'dps-1'),
(245, 26417, '1.36', '', 'DPS Card 2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'dps-2'),
(246, 26417, '1.37', '', 'GPS & GSM Antenna-1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'gps-gsm-1'),
(247, 26417, '1.38', '', 'GPS & GSM Antenna-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'gps-gsm-2'),
(248, 26417, '1.39', '', 'SMOCIP Unit', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'smocip'),
(249, 26417, '1.40', '', 'SMOCIP Termination Panel', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'smocip-term'),
(250, 26417, '1.41', '', 'Station Termination Panel', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'station-term-panel'),
(251, 26417, '1.42', '', 'Stationary PDU Box', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'station-pdu-box'),
(252, 26417, '1.43', '', 'IPS PDU Box', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'ips-pdu'),
(253, 26417, '1.44', '', 'DC-DC Converter (Relay racks)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'dc-dc-conv'),
(254, 26417, '1.45', '', 'RTU-1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'rtu-1'),
(255, 26417, '1.46', '', 'RTU-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'rtu-2'),
(256, 26417, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'station-radio-1'),
(257, 26417, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'station-radio-2'),
(258, 26417, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'next-gen-radio-1'),
(259, 26417, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'next-gen-radio-2'),
(260, 26417, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'rs-232-conv-rtu-1'),
(261, 26417, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'rs-232-conv-rtu-2'),
(264, 26417, '1.55', '', 'RIU Power Supply Card-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-power-2'),
(265, 26417, '1.56', '', 'RIU communication card 1-Remote', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-comm-remote-1'),
(266, 26417, '1.57', '', 'RIU communication card 2-Remote', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-comm-remote-2'),
(267, 26417, '1.58', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-scan-1'),
(268, 26417, '1.59', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-scan-2'),
(269, 26417, '1.60', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-scan-3'),
(270, 26417, '1.61', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'fiu-scan-4'),
(271, 26417, '1.62', '', 'RIU Battery Charge Cum Filter-1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-battery-1'),
(272, 26417, '1.63', '', 'RIU Battery Charge Cum Filter-2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-battery-2'),
(273, 26417, '1.64', '', 'RTU EMI FILTER_1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-emi-1'),
(274, 26417, '1.65', '', 'RTU EMI FILTER_2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'riu-emi-2'),
(275, 26417, '1.66', '', 'TCAS EMI FILTER _1', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'tcas-emi-1'),
(276, 26417, '1.67', '', 'TCAS EMI FILTER _2', NULL, '', NULL, 'Select', '2026-06-05 09:16:31', '2026-06-19 05:02:26', 'tcas-emi-2'),
(277, 26417, '1.68', '', 'TCAS Cable Extender', NULL, '', NULL, 'Select', '2026-06-05 09:16:32', '2026-06-19 05:02:26', 'tcas-cable-extender'),
(290, 26017, '1.26', NULL, '', NULL, '', NULL, NULL, '2026-06-08 07:14:57', '2026-06-08 07:14:57', 'rs-485-conv'),
(291, 26014, '1.26', '516107201125013', 'RS 485-OFC converter (STATION)', NULL, 's.no. Matched with IC/ATR as verified on 11/5/2026', NULL, 'Matching', '2026-06-08 07:14:58', '2026-06-23 17:08:33', 'rs-485-conv'),
(292, 26015, '1.26', '516107200226084', 'RS 485-OFC converter (STATION)', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-06-08 07:14:58', '2026-06-24 06:49:34', 'rs-485-conv'),
(295, 26417, '1.26', '', 'RS 485-OFC converter (STATION)', NULL, '', NULL, 'Select', '2026-06-08 07:20:58', '2026-06-19 05:02:26', 'rs-485-conv'),
(297, 26417, '1.69', '', 'RS 485 OFC CONVERTER', '', '', NULL, 'Select', '2026-06-08 07:24:13', '2026-06-19 05:02:26', 'template_row_15'),
(298, 111111, '1.1', '', 'Stationary Kavach Unit', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'stationary-kavach-unit'),
(299, 111111, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'stationary-kavach-unit'),
(300, 111111, '1.2', '', 'Peripheral Processing Card 1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'ppc_1'),
(301, 111111, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'ppc_1'),
(302, 111111, '1.3', '', 'Peripheral Processing Card 2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'ppc_2'),
(303, 111111, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'ppc_2'),
(304, 111111, '1.4', '', 'Vital Computer Card -1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vcc_1'),
(305, 111111, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vcc_1'),
(306, 111111, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vcc-2'),
(307, 111111, '1.5', '', 'Vital Computer Card -2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vcc-2'),
(308, 111111, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vcc-3'),
(309, 111111, '1.6', '', 'Vital Computer Card -3', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vcc-3'),
(310, 111111, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vc-1'),
(311, 111111, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vc-2'),
(312, 111111, '1.9', '', 'Vital Gateway Card 1 (S2S)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vgc-1'),
(313, 111111, '1.7', '', 'Voter Card -1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vc-1'),
(314, 111111, '1.8', '', 'Voter Card -2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vc-2'),
(315, 111111, '1.10', '', 'Vital Gateway Card 2 (S2S)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vgc-2'),
(316, 111111, '1.9', '', 'Vital Gateway Card 1 (S2S)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vgc-1'),
(317, 111111, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vgc-3'),
(318, 111111, '1.10', '', 'Vital Gateway Card 2 (S2S)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vgc-2'),
(319, 111111, '1.12', '', 'EI Gateway-1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'eig-1'),
(320, 111111, '1.11', '', 'Vital Gateway Card 3 (NMS)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'vgc-3'),
(321, 111111, '1.13', '', 'EI Gateway-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'eig-2'),
(322, 111111, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'eig-1'),
(323, 111111, '1.14', '', 'FIU Scanner Card 1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-1'),
(324, 111111, '1.15', '', 'FIU Scanner Card 2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-2'),
(325, 111111, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'eig-2'),
(326, 111111, '1.16', '', 'FIU Scanner Card 3', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-3'),
(327, 111111, '1.14', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-1'),
(328, 111111, '1.15', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-2'),
(329, 111111, '1.17', '', 'FIU Scanner Card 4', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-4'),
(330, 111111, '1.18', '', 'FIU Scanner Card 5', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-5'),
(331, 111111, '1.16', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-3'),
(332, 111111, '1.19', '', 'FIU Scanner Card 6', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-6'),
(333, 111111, '1.20', '', 'FIU Scanner Card 7', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-7'),
(334, 111111, '1.17', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-4'),
(335, 111111, '1.21', '', 'FIU Scanner Card 8', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-8'),
(336, 111111, '1.18', '', 'FIU Scanner Card 5', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-5'),
(337, 111111, '1.22', '', 'RIU communication card 1-Host', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-comm-1'),
(338, 111111, '1.23', '', 'RIU communication card 2-Host', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-comm-2'),
(339, 111111, '1.19', '', 'FIU Scanner Card 6', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-6'),
(340, 111111, '1.24', '', 'RS 232-OFC converter 1 (STATION)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-1'),
(341, 111111, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-7'),
(342, 111111, '1.25', '', 'RS 232-OFC converter 2 (STATION)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-2'),
(343, 111111, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-8'),
(344, 111111, '1.26', '', 'RS 485-OFC converter (STATION)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-485-conv'),
(345, 111111, '1.27', '', 'FIU Termination Card 1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-1'),
(346, 111111, '1.22', '', 'RIU communication card 1-Host', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-comm-1'),
(347, 111111, '1.28', '', 'FIU Termination Card 2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-2'),
(348, 111111, '1.23', '', 'RIU communication card 2-Host', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-comm-2'),
(349, 111111, '1.29', '', 'FIU Termination Card 3', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-3'),
(350, 111111, '1.24', '', 'RS 232-OFC converter 1 (STATION)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-1'),
(351, 111111, '1.30', '', 'FIU Termination Card 4', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-4'),
(352, 111111, '1.31', '', 'FIU Termination Card 5', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-5'),
(353, 111111, '1.25', '', 'RS 232-OFC converter 2 (STATION)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-2'),
(354, 111111, '1.32', '', 'FIU Termination Card 6', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-6'),
(355, 111111, '1.26', '', 'RS 485-OFC converter (STATION)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-485-conv'),
(356, 111111, '1.33', '', 'FIU Termination Card 7', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-7'),
(357, 111111, '1.27', '', 'FIU Termination Card 1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-1'),
(358, 111111, '1.34', '', 'FIU Termination Card 8', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-8'),
(359, 111111, '1.35', '', 'DPS Card 1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'dps-1');
INSERT INTO `verification_of_equipment_serial_numbers` (`id`, `station_id`, `S_no`, `barcode_kavach_main_unit`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`, `row_key`) VALUES
(360, 111111, '1.28', '', 'FIU Termination Card 2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-2'),
(361, 111111, '1.36', '', 'DPS Card 2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'dps-2'),
(362, 111111, '1.37', '', 'GPS &amp; GSM Antenna-1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'gps-gsm-1'),
(363, 111111, '1.29', '', 'FIU Termination Card 3', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-3'),
(364, 111111, '1.38', '', 'GPS &amp; GSM Antenna-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'gps-gsm-2'),
(365, 111111, '1.39', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'smocip'),
(366, 111111, '1.30', '', 'FIU Termination Card 4', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-4'),
(367, 111111, '1.40', '', 'SMOCIP Termination Panel', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'smocip-term'),
(368, 111111, '1.41', '', 'Station Termination Panel', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-term-panel'),
(369, 111111, '1.31', '', 'FIU Termination Card 5', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-5'),
(370, 111111, '1.42', '', 'Stationary PDU Box', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-pdu-box'),
(371, 111111, '1.32', '', 'FIU Termination Card 6', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-6'),
(372, 111111, '1.43', '', 'IPS PDU Box', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'ips-pdu'),
(373, 111111, '1.44', '', 'DC-DC Converter (Relay racks)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'dc-dc-conv'),
(374, 111111, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-7'),
(375, 111111, '1.45', '', 'RTU-1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rtu-1'),
(376, 111111, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-term-8'),
(377, 111111, '1.46', '', 'RTU-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rtu-2'),
(378, 111111, '1.35', '', 'DPS Card 1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'dps-1'),
(379, 111111, '1.47', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-radio-1'),
(380, 111111, '1.36', '', 'DPS Card 2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'dps-2'),
(381, 111111, '1.48', '', 'Station Radio Power Supply card-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-radio-2'),
(382, 111111, '1.37', '', 'GPS & GSM Antenna-1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'gps-gsm-1'),
(383, 111111, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'next-gen-radio-1'),
(384, 111111, '1.38', '', 'GPS & GSM Antenna-2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'gps-gsm-2'),
(385, 111111, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'next-gen-radio-2'),
(386, 111111, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-rtu-1'),
(387, 111111, '1.39', '', 'SMOCIP Unit', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'smocip'),
(388, 111111, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-rtu-2'),
(389, 111111, '1.40', '', 'SMOCIP Termination Panel', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'smocip-term'),
(390, 111111, '1.41', '', 'Station Termination Panel', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-term-panel'),
(392, 111111, '1.42', '', 'Stationary PDU Box', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-pdu-box'),
(394, 111111, '1.55', '', 'RIU Power Supply Card-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-power-2'),
(395, 111111, '1.43', '', 'IPS PDU Box', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'ips-pdu'),
(396, 111111, '1.56', '', 'RIU communication card 1-Remote', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-comm-remote-1'),
(397, 111111, '1.44', '', 'DC-DC Converter (Relay racks)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'dc-dc-conv'),
(398, 111111, '1.57', '', 'RIU communication card 2-Remote', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-comm-remote-2'),
(399, 111111, '1.45', '', 'RTU-1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rtu-1'),
(400, 111111, '1.58', '', 'FIU Scanner Card 1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-scan-1'),
(401, 111111, '1.46', '', 'RTU-2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rtu-2'),
(402, 111111, '1.59', '', 'FIU Scanner Card 2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-scan-2'),
(403, 111111, '1.60', '', 'FIU Scanner Card 3', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-scan-3'),
(404, 111111, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-radio-1'),
(405, 111111, '1.61', '', 'FIU Scanner Card 4', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'fiu-scan-4'),
(406, 111111, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'station-radio-2'),
(407, 111111, '1.62', '', 'RIU Battery Charge Cum Filter-1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-battery-1'),
(408, 111111, '1.63', '', 'RIU Battery Charge Cum Filter-2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-battery-2'),
(409, 111111, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'next-gen-radio-1'),
(410, 111111, '1.64', '', 'RTU EMI FILTER_1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-emi-1'),
(411, 111111, '1.65', '', 'RTU EMI FILTER_2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'riu-emi-2'),
(412, 111111, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'next-gen-radio-2'),
(413, 111111, '1.66', '', 'TCAS EMI FILTER _1', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'tcas-emi-1'),
(414, 111111, '1.67', '', 'TCAS EMI FILTER _2', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'tcas-emi-2'),
(415, 111111, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-rtu-1'),
(416, 111111, '1.68', '', 'TCAS Cable Extender', '', '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'tcas-cable-extender'),
(417, 111111, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Select', '2026-06-08 07:27:37', '2026-06-08 07:27:37', 'rs-232-conv-rtu-2'),
(418, 111111, '1.69', '', 'RS 485 OFC CONVERTER', '', '', NULL, 'Matching', '2026-06-08 07:27:37', '2026-06-08 07:33:19', 'template_row_15'),
(421, 26417, '1.70', '', 'RIU battery -1', NULL, '', NULL, 'Select', '2026-06-08 08:22:56', '2026-06-19 05:02:26', 'template_row_17'),
(422, 26417, '1.71', '', 'RIU battery-2', '', '', NULL, 'Select', '2026-06-08 09:02:52', '2026-06-19 05:02:26', 'template_row_18'),
(424, 26417, '1.72', '', 'RIU battery -3', '', '', NULL, 'Select', '2026-06-08 09:04:51', '2026-06-19 05:02:26', 'template_row_19'),
(469, 26417, '1.73', '', 'RIU battery-4', NULL, '', NULL, 'Select', '2026-06-08 09:06:21', '2026-06-19 05:02:26', 'template_row_20'),
(521, 26015, '1.69', '', 'RS 485 OFC CONVERTER', NULL, '', NULL, 'Not Applicable', '2026-06-19 07:28:04', '2026-06-24 06:49:34', 'template_row_15'),
(522, 26015, '1.70', '0001125362', 'RIU battery -1', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 07:28:04', '2026-06-24 06:49:34', 'template_row_17'),
(523, 26015, '1.71', '0001125363', 'RIU battery-2', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 07:28:04', '2026-06-24 06:49:34', 'template_row_18'),
(524, 26015, '1.72', '0001125364', 'RIU battery -3', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 07:28:04', '2026-06-24 06:49:34', 'template_row_19'),
(525, 26015, '1.73', '0001125365', 'RIU battery-4', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 07:28:04', '2026-06-24 06:49:34', 'template_row_20'),
(527, 26015, '1.74', '516113200925418', 'RIU FIU Termination Card 1', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 08:27:07', '2026-06-24 06:49:34', 'template_row_22'),
(528, 26015, '1.75', '516113200925424', 'RIU FIU Termination Card 2', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 08:27:07', '2026-06-24 06:49:34', 'template_row_23'),
(529, 26015, '1.76', '516113200925489', 'RIU FIU Termination Card 3', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 08:27:07', '2026-06-24 06:49:34', 'template_row_24'),
(530, 26015, '1.77', '516113201025118', 'RIU FIU Termination Card 4', NULL, 'S.no. Matched with IC/ATR verified on 19/6/2026', NULL, 'Matching', '2026-06-19 08:27:07', '2026-06-24 06:49:34', 'template_row_25'),
(574, 260150, '1.1', '', 'Stationary Kavach Unit', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'stationary-kavach-unit'),
(575, 260150, '1.2', '', 'Peripheral Processing Card 1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'ppc_1'),
(576, 260150, '1.3', '', 'Peripheral Processing Card 2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'ppc_2'),
(577, 260150, '1.4', '', 'Vital Computer Card -1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vcc_1'),
(578, 260150, '1.5', '', 'Vital Computer Card -2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vcc-2'),
(579, 260150, '1.6', '', 'Vital Computer Card -3', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vcc-3'),
(580, 260150, '1.7', '', 'Voter Card -1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vc-1'),
(581, 260150, '1.8', '', 'Voter Card -2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vc-2'),
(582, 260150, '1.9', '', 'Vital Gateway Card 1 (S2S)', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vgc-1'),
(583, 260150, '1.10', '', 'Vital Gateway Card 2 (S2S)', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vgc-2'),
(584, 260150, '1.11', '', 'Vital Gateway Card 3 (NMS)', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'vgc-3'),
(585, 260150, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'eig-1'),
(586, 260150, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'eig-2'),
(587, 260150, '1.14', '', 'FIU Scanner Card 1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-1'),
(588, 260150, '1.15', '', 'FIU Scanner Card 2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-2'),
(589, 260150, '1.16', '', 'FIU Scanner Card 3', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-3'),
(590, 260150, '1.17', '', 'FIU Scanner Card 4', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-4'),
(591, 260150, '1.18', '', 'FIU Scanner Card 5', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-5'),
(592, 260150, '1.19', '', 'FIU Scanner Card 6', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-6'),
(593, 260150, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-7'),
(594, 260150, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-8'),
(595, 260150, '1.22', '', 'RIU communication card 1-Host', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'riu-comm-1'),
(596, 260150, '1.23', '', 'RIU communication card 2-Host', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'riu-comm-2'),
(597, 260150, '1.24', '', 'RS 232-OFC converter 1 (STATION)', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'rs-232-conv-1'),
(598, 260150, '1.25', '', 'RS 232-OFC converter 2 (STATION)', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'rs-232-conv-2'),
(599, 260150, '1.26', '', 'RS 485-OFC converter (STATION)', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'rs-485-conv'),
(600, 260150, '1.27', '', 'FIU Termination Card 1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-1'),
(601, 260150, '1.28', '', 'FIU Termination Card 2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-2'),
(602, 260150, '1.29', '', 'FIU Termination Card 3', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-3'),
(603, 260150, '1.30', '', 'FIU Termination Card 4', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-4'),
(604, 260150, '1.31', '', 'FIU Termination Card 5', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-5'),
(605, 260150, '1.32', '', 'FIU Termination Card 6', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-6'),
(606, 260150, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-7'),
(607, 260150, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'fiu-term-8'),
(608, 260150, '1.35', '', 'DPS Card 1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'dps-1'),
(609, 260150, '1.36', '', 'DPS Card 2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'dps-2'),
(610, 260150, '1.37', '', 'GPS & GSM Antenna-1', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'gps-gsm-1'),
(611, 260150, '1.38', '', 'GPS & GSM Antenna-2', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'gps-gsm-2'),
(612, 260150, '1.39', '', 'SMOCIP Unit', NULL, '', NULL, 'Select', '2026-06-19 09:46:21', '2026-06-19 10:30:34', 'smocip'),
(613, 260150, '1.40', '', 'SMOCIP Termination Panel', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'smocip-term'),
(614, 260150, '1.41', '', 'Station Termination Panel', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'station-term-panel'),
(615, 260150, '1.42', '516300511025090', 'Stationary PDU Box', NULL, '', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'station-pdu-box'),
(616, 260150, '1.43', '', 'IPS PDU Box', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'ips-pdu'),
(617, 260150, '1.44', '516303221125004', 'DC-DC Converter (Relay racks)', NULL, '', NULL, 'Verified', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'dc-dc-conv'),
(618, 260150, '1.45', '', 'RTU-1', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'rtu-1'),
(619, 260150, '1.46', '', 'RTU-2', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'rtu-2'),
(620, 260150, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'station-radio-1'),
(621, 260150, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'station-radio-2'),
(622, 260150, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'next-gen-radio-1'),
(623, 260150, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'next-gen-radio-2'),
(624, 260150, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'rs-232-conv-rtu-1'),
(625, 260150, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Select', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'rs-232-conv-rtu-2'),
(628, 260150, '1.55', '516139200224061', 'RIU Power Supply Card-2', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-power-2'),
(629, 260150, '1.56', '516138500725095', 'RIU communication card 1-Remote', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-comm-remote-1'),
(630, 260150, '1.57', '516138500725058', 'RIU communication card 2-Remote', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-comm-remote-2'),
(631, 260150, '1.58', '516111200124094', 'FIU Scanner Card 1', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'fiu-scan-1'),
(632, 260150, '1.59', '516111200124019', 'FIU Scanner Card 2', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'fiu-scan-2'),
(633, 260150, '1.60', '516111200124228', 'FIU Scanner Card 3', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'fiu-scan-3'),
(634, 260150, '1.61', '516111200124010', 'FIU Scanner Card 4', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'fiu-scan-4'),
(635, 260150, '1.62', '516149200224037', 'RIU Battery Charge Cum Filter-1', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-battery-1'),
(636, 260150, '1.63', '516149200124041', 'RIU Battery Charge Cum Filter-2', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-battery-2'),
(637, 260150, '1.64', '', 'RTU EMI FILTER_1', NULL, '', NULL, 'Not Applicable', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-emi-1'),
(638, 260150, '1.65', '', 'RTU EMI FILTER_2', NULL, '', NULL, 'Not Applicable', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'riu-emi-2'),
(639, 260150, '1.66', '', 'TCAS EMI FILTER _1', NULL, '', NULL, 'Not Applicable', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'tcas-emi-1'),
(640, 260150, '1.67', '', 'TCAS EMI FILTER _2', NULL, '', NULL, 'Not Applicable', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'tcas-emi-2'),
(641, 260150, '1.68', '', 'TCAS Cable Extender', NULL, '', NULL, 'Not Applicable', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'tcas-cable-extender'),
(642, 260150, '1.69', '', 'RS 485 OFC CONVERTER', NULL, '', NULL, 'Not Applicable', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_15'),
(643, 260150, '1.70', '0001125362', 'RIU battery -1', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_17'),
(644, 260150, '1.71', '0001125363', 'RIU battery-2', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_18'),
(645, 260150, '1.72', '0001125364', 'RIU battery -3', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_19'),
(646, 260150, '1.73', '0001125365', 'RIU battery-4', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_20'),
(647, 260150, '1.74', '516113200925424', 'RIU FIU Termination Card 1', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_22'),
(648, 260150, '1.75', '516113200925489', 'RIU FIU Termination Card 2', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_23'),
(649, 260150, '1.76', '516113200925418', 'RIU FIU Termination Card 3', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_24'),
(650, 260150, '1.77', '516113201025118', 'RIU FIU Termination Card 4', NULL, 'S.no. Matched with IC/ATR Verified on 19/6/2026', NULL, 'Matching', '2026-06-19 09:46:22', '2026-06-19 10:30:34', 'template_row_25'),
(686, 26418, '1.1', '516304001125048', 'Stationary Kavach Unit', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'stationary-kavach-unit'),
(687, 26418, '1.2', '516102201025167', 'Peripheral Processing Card 1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'ppc_1'),
(688, 26418, '1.3', '516102201025113', 'Peripheral Processing Card 2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'ppc_2'),
(689, 26418, '1.4', '516101001025236', 'Vital Computer Card -1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vcc_1'),
(690, 26418, '1.5', '516101001025314', 'Vital Computer Card -2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vcc-2'),
(691, 26418, '1.6', '516101001025250', 'Vital Computer Card -3', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vcc-3'),
(692, 26418, '1.7', '516106201025274', 'Voter Card -1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vc-1'),
(693, 26418, '1.8', '516106201025263', 'Voter Card -2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vc-2'),
(694, 26418, '1.9', '516174001025486', 'Vital Gateway Card 1 (S2S)', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vgc-1'),
(695, 26418, '1.10', '516174001025553', 'Vital Gateway Card 2 (S2S)', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vgc-2'),
(696, 26418, '1.11', '516174001025560', 'Vital Gateway Card 3 (NMS)', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'vgc-3'),
(697, 26418, '1.12', '', 'EI Gateway-1', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'eig-1'),
(698, 26418, '1.13', '', 'EI Gateway-2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'eig-2'),
(699, 26418, '1.14', '516111201025666', 'FIU Scanner Card 1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-1'),
(700, 26418, '1.15', '516111201025833', 'FIU Scanner Card 2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-2'),
(701, 26418, '1.16', '516111201025290', 'FIU Scanner Card 3', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-3'),
(702, 26418, '1.17', '516111201025818', 'FIU Scanner Card 4', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-4'),
(703, 26418, '1.18', '', 'FIU Scanner Card 5', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-5'),
(704, 26418, '1.19', '', 'FIU Scanner Card 6', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-6'),
(705, 26418, '1.20', '', 'FIU Scanner Card 7', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-7'),
(706, 26418, '1.21', '', 'FIU Scanner Card 8', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'fiu-8'),
(707, 26418, '1.22', '516138200924020', 'RIU communication card 1-Host', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'riu-comm-1'),
(708, 26418, '1.23', '516138200924018', 'RIU communication card 2-Host', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:55', '2026-06-23 11:05:06', 'riu-comm-2'),
(709, 26418, '1.24', '', 'RS 232-OFC converter 1 (STATION)', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rs-232-conv-1'),
(710, 26418, '1.25', '', 'RS 232-OFC converter 2 (STATION)', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rs-232-conv-2'),
(711, 26418, '1.26', '', 'RS 485-OFC converter (STATION)', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rs-485-conv'),
(712, 26418, '1.27', '516113201025314', 'FIU Termination Card 1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-1'),
(713, 26418, '1.28', '516113200925441', 'FIU Termination Card 2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-2'),
(714, 26418, '1.29', '516113200925487', 'FIU Termination Card 3', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-3'),
(715, 26418, '1.30', '516113200925570', 'FIU Termination Card 4', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-4'),
(716, 26418, '1.31', '', 'FIU Termination Card 5', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-5'),
(717, 26418, '1.32', '', 'FIU Termination Card 6', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-6'),
(718, 26418, '1.33', '', 'FIU Termination Card 7', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-7'),
(719, 26418, '1.34', '', 'FIU Termination Card 8', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-term-8'),
(720, 26418, '1.35', '516103421025031', 'DPS Card 1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'dps-1'),
(721, 26418, '1.36', '516103411025030', 'DPS Card 2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'dps-2'),
(722, 26418, '1.37', '516300331153851', 'GPS & GSM Antenna-1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'gps-gsm-1'),
(723, 26418, '1.38', '516300331153851', 'GPS & GSM Antenna-2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'gps-gsm-2'),
(724, 26418, '1.39', '', 'SMOCIP Unit', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'smocip'),
(725, 26418, '1.40', '', 'SMOCIP Termination Panel', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'smocip-term'),
(726, 26418, '1.41', '516303441125125', 'Station Termination Panel', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'station-term-panel'),
(727, 26418, '1.42', '516300341225381', 'Stationary PDU Box', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'station-pdu-box'),
(728, 26418, '1.43', '516324340426003', 'IPS PDU Box', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'ips-pdu'),
(729, 26418, '1.44', '', 'DC-DC Converter (Relay racks)', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'dc-dc-conv'),
(730, 26418, '1.45', '', 'RTU-1', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rtu-1'),
(731, 26418, '1.46', '', 'RTU-2', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rtu-2'),
(732, 26418, '1.47', '', 'Station Radio Power Supply card-1', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'station-radio-1'),
(733, 26418, '1.48', '', 'Station Radio Power Supply card-2', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'station-radio-2'),
(734, 26418, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'next-gen-radio-1'),
(735, 26418, '1.50', '', 'Next Gen/. Cal Amp Radio Modem-2', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'next-gen-radio-2'),
(736, 26418, '1.51', '', 'RS 232-OFC converter 1 (RTU-1)', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rs-232-conv-rtu-1'),
(737, 26418, '1.52', '', 'RS 232-OFC converter 2 (RTU-2)', NULL, '', NULL, 'Not Installed', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'rs-232-conv-rtu-2'),
(740, 26418, '1.55', '', 'RIU Power Supply Card-2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-power-2'),
(741, 26418, '1.56', '', 'RIU communication card 1-Remote', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-comm-remote-1'),
(742, 26418, '1.57', '', 'RIU communication card 2-Remote', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-comm-remote-2'),
(743, 26418, '1.58', '516111201025666', 'FIU Scanner Card 1', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-scan-1'),
(744, 26418, '1.59', '516111201025833', 'FIU Scanner Card 2', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-scan-2'),
(745, 26418, '1.60', '516111201025290', 'FIU Scanner Card 3', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-scan-3'),
(746, 26418, '1.61', '516111201025818', 'FIU Scanner Card 4', NULL, 'S.no. Matched with IC/ATR as verified on 5/6/2026', NULL, 'Matching', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'fiu-scan-4'),
(747, 26418, '1.62', '', 'RIU Battery Charge Cum Filter-1', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-battery-1'),
(748, 26418, '1.63', '', 'RIU Battery Charge Cum Filter-2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-battery-2'),
(749, 26418, '1.64', '', 'RTU EMI FILTER_1', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-emi-1'),
(750, 26418, '1.65', '', 'RTU EMI FILTER_2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'riu-emi-2'),
(751, 26418, '1.66', '', 'TCAS EMI FILTER _1', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'tcas-emi-1'),
(752, 26418, '1.67', '', 'TCAS EMI FILTER _2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'tcas-emi-2'),
(753, 26418, '1.68', '', 'TCAS Cable Extender', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'tcas-cable-extender'),
(754, 26418, '1.69', '', 'RS 485 OFC CONVERTER', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_15'),
(755, 26418, '1.70', '', 'RIU battery -1', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_17'),
(756, 26418, '1.71', '', 'RIU battery-2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_18'),
(757, 26418, '1.72', '', 'RIU battery -3', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_19'),
(758, 26418, '1.73', '', 'RIU battery-4', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_20'),
(759, 26418, '1.74', '', 'RIU FIU Termination Card 1', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_22'),
(760, 26418, '1.75', '', 'RIU FIU Termination Card 2', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_23'),
(761, 26418, '1.76', '', 'RIU FIU Termination Card 3', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_24'),
(762, 26418, '1.77', '', 'RIU FIU Termination Card 4', NULL, '', NULL, 'Not Applicable', '2026-06-19 15:52:56', '2026-06-23 11:05:06', 'template_row_25'),
(866, 26017, '1.53', NULL, '', NULL, '', NULL, NULL, '2026-06-23 15:04:26', '2026-06-24 06:50:42', 'riu-power-1'),
(868, 26014, '1.53', '', 'RIU Power Supply Card-1', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:04:26', '2026-06-24 06:50:42', 'riu-power-1'),
(870, 26015, '1.53', '516139200224051', 'RIU Power Supply Card-1', NULL, 'S no. Matched with\nIC/ATR verified on\n30/05/2026', NULL, 'Matching', '2026-06-23 15:04:27', '2026-06-24 06:50:42', 'riu-power-1'),
(872, 26417, '1.53', NULL, '', NULL, '', NULL, NULL, '2026-06-23 15:04:27', '2026-06-24 06:50:42', 'riu-power-1'),
(874, 111111, '1.53', NULL, '', NULL, '', NULL, NULL, '2026-06-23 15:04:28', '2026-06-24 06:50:42', 'riu-power-1'),
(876, 260150, '1.53', NULL, '', NULL, '', NULL, NULL, '2026-06-23 15:04:29', '2026-06-24 06:50:42', 'riu-power-1'),
(922, 26014, '1.69', '', 'RS 485 OFC CONVERTER', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_15'),
(923, 26014, '1.70', '', 'RIU battery -1', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_17'),
(924, 26014, '1.71', '', 'RIU battery-2', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_18'),
(925, 26014, '1.72', '', 'RIU battery -3', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_19'),
(926, 26014, '1.73', '', 'RIU battery-4', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_20'),
(927, 26014, '1.74', '', 'RIU FIU Termination Card 1', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_22'),
(928, 26014, '1.75', '', 'RIU FIU Termination Card 2', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_23'),
(929, 26014, '1.76', '', 'RIU FIU Termination Card 3', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_24'),
(930, 26014, '1.77', '', 'RIU FIU Termination Card 4', NULL, '', NULL, 'Not Applicable', '2026-06-23 15:55:55', '2026-06-23 17:08:33', 'template_row_25'),
(987, 26418, '1.53', NULL, '', NULL, '', NULL, NULL, '2026-06-24 05:38:25', '2026-06-24 06:50:42', 'riu-power-1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dc_convertor`
--
ALTER TABLE `dc_convertor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gps_gsm_antenna`
--
ALTER TABLE `gps_gsm_antenna`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `installation_of_kavach_equipment`
--
ALTER TABLE `installation_of_kavach_equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ips`
--
ALTER TABLE `ips`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `laying_of_sectional_ofc_cable`
--
ALTER TABLE `laying_of_sectional_ofc_cable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loginpage`
--
ALTER TABLE `loginpage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `networking_rack`
--
ALTER TABLE `networking_rack`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outdoor_cabling`
--
ALTER TABLE `outdoor_cabling`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pdu`
--
ALTER TABLE `pdu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relay_rack`
--
ALTER TABLE `relay_rack`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report_versions`
--
ALTER TABLE `report_versions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfid_tags`
--
ALTER TABLE `rfid_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rf_antennas`
--
ALTER TABLE `rf_antennas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `riu`
--
ALTER TABLE `riu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `row_templates`
--
ALTER TABLE `row_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rtu`
--
ALTER TABLE `rtu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `smocip`
--
ALTER TABLE `smocip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `station`
--
ALTER TABLE `station`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `station_id` (`station_id`),
  ADD UNIQUE KEY `unique_station_combo` (`station_id`,`railway_zone`,`division`);

--
-- Indexes for table `tag_to_tag_distance`
--
ALTER TABLE `tag_to_tag_distance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tower`
--
ALTER TABLE `tower`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verification_of_equipment_serial_numbers`
--
ALTER TABLE `verification_of_equipment_serial_numbers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dc_convertor`
--
ALTER TABLE `dc_convertor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `gps_gsm_antenna`
--
ALTER TABLE `gps_gsm_antenna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=533;

--
-- AUTO_INCREMENT for table `installation_of_kavach_equipment`
--
ALTER TABLE `installation_of_kavach_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `ips`
--
ALTER TABLE `ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `laying_of_sectional_ofc_cable`
--
ALTER TABLE `laying_of_sectional_ofc_cable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loginpage`
--
ALTER TABLE `loginpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `networking_rack`
--
ALTER TABLE `networking_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `outdoor_cabling`
--
ALTER TABLE `outdoor_cabling`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pdu`
--
ALTER TABLE `pdu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `relay_rack`
--
ALTER TABLE `relay_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `report_versions`
--
ALTER TABLE `report_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rfid_tags`
--
ALTER TABLE `rfid_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rf_antennas`
--
ALTER TABLE `rf_antennas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `riu`
--
ALTER TABLE `riu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `row_templates`
--
ALTER TABLE `row_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `rtu`
--
ALTER TABLE `rtu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `smocip`
--
ALTER TABLE `smocip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tag_to_tag_distance`
--
ALTER TABLE `tag_to_tag_distance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tower`
--
ALTER TABLE `tower`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `verification_of_equipment_serial_numbers`
--
ALTER TABLE `verification_of_equipment_serial_numbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1029;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
