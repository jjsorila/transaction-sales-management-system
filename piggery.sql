-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2023 at 08:06 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `piggery`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `email`, `password`) VALUES
('admin', 'admin@gmail.com', '$2a$10$GUBo6lG7PR3D4V0w0uSHYOnWJg4mCIxgL3igL7coXQaGDDraWgHSa');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` varchar(500) NOT NULL,
  `description` longtext DEFAULT NULL,
  `event_date` datetime DEFAULT NULL,
  `badge` varchar(200) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `description`, `event_date`, `badge`, `username`) VALUES
('1f4e3c1d-2547-4b79-81d7-627853b2ded3', 'hatdog', '2023-01-28 00:00:00', 'hatdog', 'joey '),
('8ee4e043-32ce-4f90-8c12-5ab2457655eb', 'Read Harry Potter', '2023-01-27 00:00:00', 'Reading', 'sample ');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` varchar(500) NOT NULL,
  `item` longtext DEFAULT NULL,
  `quantity` int(100) DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `expense_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `item`, `quantity`, `unit_price`, `total_price`, `expense_date`) VALUES
('9e1d898c-5f4a-48a9-9fe3-9b8ef434673a', 'sdasdas', 123, 123, 15129, '2023-07-01');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` varchar(500) NOT NULL,
  `recipient` varchar(100) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `quantity` int(100) DEFAULT NULL,
  `unit_price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `recipient`, `total_price`, `transaction_date`, `quantity`, `unit_price`) VALUES
('0c2ada25-ab64-469a-a1a9-c12d1deebf2e', 'Aya', 1000, '2023-01-25 00:00:00', 10, 100),
('0eef8a4c-cb6c-4329-91b0-ae57e32895e3', '321', 103041, '2023-07-14 00:00:00', 321, 321),
('dd7ffcc7-0ed6-4f35-ac3c-227d078414d7', 'sdfsdsd', 15129, '2023-07-19 00:00:00', 123, 123);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD UNIQUE KEY `Username(UNIQUE)` (`username`),
  ADD UNIQUE KEY `Email(UNIQUE)` (`email`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD UNIQUE KEY `expense_id` (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD UNIQUE KEY `transaction_id` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
