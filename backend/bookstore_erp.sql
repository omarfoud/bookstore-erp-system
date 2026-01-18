-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2026 at 11:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookstore_erp`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('Present','Absent','Leave') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `date`, `status`) VALUES
(1, 1, '2025-12-06', 'Absent'),
(2, 1, '2025-12-06', 'Leave'),
(3, 1, '2025-12-06', 'Absent'),
(4, 1, '2025-12-11', 'Present'),
(5, 2, '2025-12-11', 'Present'),
(6, 3, '2025-12-20', 'Absent');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `vendor_id` int(11) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT 10.00,
  `is_digital` tinyint(1) DEFAULT 0,
  `image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `price`, `stock`, `vendor_id`, `cost_price`, `is_digital`, `image_url`) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 15.00, 90, 1, 10.00, 0, NULL),
(2, 'Clean Code', 'Robert Martin', 45.00, 16, 1, 10.00, 0, NULL),
(3, 'Python Crash Course', 'Eric Matthes', 30.00, 48, 1, 10.00, 0, NULL),
(4, 'الرحيق المختوم - بحث في السيرة النبوية على صاحبها أفضل الصلاة والسلام', ' صفي الرحمن المباركفوري', 80.00, 315, 1, 50.00, 0, 'https://ibnaljawzi.com/ExDzrA'),
(5, 'الحرافيش', 'نجيب محفوظ', 100.00, 199, 1, 65.00, 0, 'https://www.goodreads.com/book/show/5295735');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `password`, `address`) VALUES
(1, 'John Doe', 'user@test.com', '$2b$12$e5s4w/BRTFMDKUR/eZOdmuOHmVq65ra59y8NzS7p/ZSeVbQe9OvhS', NULL),
(4, 'omar', 'omarfouda117@gmail.com', '$2b$12$pSlPfvpgM33ud.FugTzWNOw4lSgYrCT.zBQLejpKmk1m/TC2ouFsa', NULL),
(6, 'عمر علي إبراهيم فودة', 'omarfouda112@gmail.com', '$2b$12$z7.9iW0y.ThenaSHmZIsKudQJx4Fjm2bNNtXrhA3ObRVvoQMxw6Fi', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `hire_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `vendor_id`, `name`, `position`, `salary`, `hire_date`) VALUES
(1, 1, 'Alice Smith', 'Store Manager', 3000.00, '2023-01-15'),
(2, 1, 'omar', 'developer', 50000.00, '2025-12-11'),
(3, 1, 'sabry', 'developer', 10000.00, '2025-12-20');

-- --------------------------------------------------------

--
-- Table structure for table `finances`
--

CREATE TABLE `finances` (
  `id` int(11) NOT NULL,
  `transaction_type` enum('Income','Expense') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finances`
--

INSERT INTO `finances` (`id`, `transaction_type`, `amount`, `description`, `transaction_date`) VALUES
(1, 'Income', 45.00, 'Book Sale Revenue', '2025-12-05 19:39:30'),
(2, 'Income', 30.00, 'Book Sale Revenue', '2025-12-06 16:18:38'),
(3, 'Income', 60.00, 'Book Sale Revenue', '2025-12-06 18:35:44'),
(4, 'Income', 15.00, 'Book Sale Revenue', '2025-12-06 18:39:01'),
(5, 'Income', 45.00, 'Book Sale Revenue', '2025-12-06 19:32:06'),
(6, 'Income', 75.00, 'Book Sale Revenue', '2025-12-10 10:33:32'),
(7, 'Income', 90.00, 'Book Sale Revenue', '2025-12-10 10:35:04'),
(8, 'Income', 15.00, 'Book Sale Revenue', '2025-12-10 10:50:12'),
(9, 'Income', 15.00, 'Book Sale Revenue', '2025-12-10 11:00:43'),
(10, 'Expense', 7500.00, 'Procurement Order for Book ID 4', '2025-12-11 17:58:58'),
(11, 'Income', 640.00, 'Book Sale Revenue', '2025-12-11 18:08:14'),
(12, 'Income', 400.00, 'Book Sale Revenue', '2025-12-11 18:21:18'),
(13, 'Income', 160.00, 'Book Sale Revenue', '2025-12-16 20:43:07'),
(14, 'Income', 100.00, 'Book Sale Revenue', '2025-12-20 08:42:10'),
(15, 'Expense', 7500.00, 'Procurement Order for Book ID 5', '2025-12-20 08:43:56');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `book_id`, `vendor_id`, `quantity`, `total_cost`, `order_date`) VALUES
(1, 4, 1, 150, 7500.00, '2025-12-11 17:58:58'),
(2, 5, 1, 50, 7500.00, '2025-12-20 08:43:56');

-- --------------------------------------------------------

--
-- Table structure for table `sales_orders`
--

CREATE TABLE `sales_orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'Completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`id`, `customer_id`, `book_id`, `quantity`, `total_price`, `order_date`, `status`) VALUES
(1, 1, 2, 1, 45.00, '2025-12-06 19:32:06', 'Completed'),
(2, 1, 1, 2, 30.00, '2025-12-10 10:33:32', 'Completed'),
(3, 1, 1, 1, 15.00, '2025-12-10 10:33:32', 'Completed'),
(4, 1, 3, 1, 30.00, '2025-12-10 10:33:32', 'Completed'),
(5, 1, 2, 2, 90.00, '2025-12-10 10:35:04', 'Completed'),
(6, 1, 1, 1, 15.00, '2025-12-10 10:50:12', 'Completed'),
(7, 1, 1, 1, 15.00, '2025-12-10 11:00:43', 'Completed'),
(8, 1, 4, 8, 640.00, '2025-12-11 18:08:14', 'Completed'),
(9, 1, 4, 5, 400.00, '2025-12-11 18:21:18', 'Completed'),
(11, 1, 5, 1, 100.00, '2025-12-20 08:42:10', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `plan_name` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('Active','Expired') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Main Books Admin', 'admin@store.com', '$2b$12$ARjuzKSX.xPG9PLE.mzZjOMylZFtt2zFvilmGNwAuXA0SOrIp4gCy', 'admin'),
(2, 'Super Admin', 'admin@erp.com', '$2b$12$CfGY/LIRYOcXpaa6ePnW9eXmr0LZm411JQXH6O86JAbZHoG05voqC', 'super_admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `books_ibfk_1` (`vendor_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employees_ibfk_1` (`vendor_id`);

--
-- Indexes for table `finances`
--
ALTER TABLE `finances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `sales_orders_ibfk_1` (`customer_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `finances`
--
ALTER TABLE `finances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD CONSTRAINT `sales_orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_orders_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
