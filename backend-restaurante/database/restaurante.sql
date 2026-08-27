-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-03-2025 a las 22:01:31
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `restaurante`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id` int(6) UNSIGNED NOT NULL,
  `platillo` varchar(50) NOT NULL,
  `precio` int(11) NOT NULL,
  `mesa` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `observaciones` varchar(100) DEFAULT NULL,
  `cliente` varchar(100) DEFAULT NULL,
  `fecha` varchar(20) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id`, `platillo`, `precio`, `mesa`, `cantidad`, `observaciones`, `cliente`, `fecha`, `estado`) VALUES
(1, 'Sopa de pollo', 20000, 0, 2, 'sin cebolla y tomate', NULL, '2020-11-16T20:00', 'entregado'),
(13, 'Meat Town', 0, 0, 2, 'con peperoni', 'rosa', '2020-11-16T21:30', 'preparando'),
(14, 'Lasagna', 0, 0, 2, 'sin cebolla', 'fulanito', '2020-11-16T20:00', 'preparando'),
(15, 'Ravioli', 0, 0, 4, 'bastante', 'cristian', '2023-10-27T19:24', 'entregado'),
(16, 'Today\'s Soup', 0, 0, 1, 'con papa', 'sofia', '2020-11-16T20:00', 'entregado'),
(17, 'Parma', 0, 0, 2, 'sin queso', 'casiano', '2023-10-14T23:25', 'entregado'),
(19, 'Sopa de cerdo', 20000, 0, 1, 'sin cebolla', 'Rosa Melo', '2020-11-16T20:00', 'preparar'),
(20, 'pizza calzoni', 35000, 0, 1, 'arto queso', 'Rascael Alberto', '2020-11-16T20:00', 'preparar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(6) UNSIGNED NOT NULL,
  `user` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `user`, `name`, `rol`, `password`) VALUES
(1, 'Pedrito', 'Pedro Reales', 'chef', '1234'),
(8, 'armando pedidos', 'armando', 'cajero', '1234'),
(9, 'ratatui', 'ratatui', 'chef', '1234'),
(10, 'Pedroncho', 'Pedro Reales', 'chef', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
