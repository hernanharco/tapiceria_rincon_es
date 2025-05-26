-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3329
-- Tiempo de generación: 26-05-2025 a las 22:57:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_tapiceria_es`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add data client', 7, 'add_dataclient'),
(26, 'Can change data client', 7, 'change_dataclient'),
(27, 'Can delete data client', 7, 'delete_dataclient'),
(28, 'Can view data client', 7, 'view_dataclient'),
(29, 'Can add data company', 8, 'add_datacompany'),
(30, 'Can change data company', 8, 'change_datacompany'),
(31, 'Can delete data company', 8, 'delete_datacompany'),
(32, 'Can view data company', 8, 'view_datacompany'),
(33, 'Can add pago', 9, 'add_pago'),
(34, 'Can change pago', 9, 'change_pago'),
(35, 'Can delete pago', 9, 'delete_pago'),
(36, 'Can view pago', 9, 'view_pago'),
(37, 'Can add document', 10, 'add_document'),
(38, 'Can change document', 10, 'change_document'),
(39, 'Can delete document', 10, 'delete_document'),
(40, 'Can view document', 10, 'view_document'),
(41, 'Can add data document', 11, 'add_datadocument'),
(42, 'Can change data document', 11, 'change_datadocument'),
(43, 'Can delete data document', 11, 'delete_datadocument'),
(44, 'Can view data document', 11, 'view_datadocument'),
(45, 'Can add footer document', 12, 'add_footerdocument'),
(46, 'Can change footer document', 12, 'change_footerdocument'),
(47, 'Can delete footer document', 12, 'delete_footerdocument'),
(48, 'Can view footer document', 12, 'view_footerdocument');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$600000$ftNhKVDxpbhlWC1HoHYtTI$96FJYRarFn+OoeyzE0B8BBn1rDrxy8UirtJZt85oeDI=', '2025-05-26 20:17:45.287449', 1, 'harango', '', '', 'harango@gmail.com', 1, 1, '2025-05-26 20:17:33.954334');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `django_admin_log`
--

INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
(1, '2025-05-26 20:41:43.417803', 'Y9509223W', 'Jenny Katerine Osorio Rueda (Y9509223W)', 1, '[{\"added\": {}}]', 8, 1),
(2, '2025-05-26 20:43:42.128383', 'Q-8350064-E', 'Hospital De San Agustin (Q-8350064-E)', 1, '[{\"added\": {}}]', 7, 1),
(3, '2025-05-26 20:44:20.548058', '23-0033', 'Factura 23-0033', 1, '[{\"added\": {}}]', 10, 1),
(4, '2025-05-26 20:53:51.338345', '1', 'Línea de 23-0033', 1, '[{\"added\": {}}]', 11, 1),
(5, '2025-05-26 20:54:10.701682', '2', 'Línea de 23-0033', 1, '[{\"added\": {}}]', 11, 1),
(6, '2025-05-26 20:55:31.504343', '2', 'Línea de Factura 23-0033', 1, '[{\"added\": {}}]', 12, 1),
(7, '2025-05-26 20:57:00.519216', '1', 'Pago - Transferencia BBVA ES9801820606870201760037', 1, '[{\"added\": {}}]', 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(7, 'mi_app', 'dataclient'),
(8, 'mi_app', 'datacompany'),
(11, 'mi_app', 'datadocument'),
(10, 'mi_app', 'document'),
(12, 'mi_app', 'footerdocument'),
(9, 'mi_app', 'pago'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-05-26 20:16:20.818273'),
(2, 'auth', '0001_initial', '2025-05-26 20:16:28.805325'),
(3, 'admin', '0001_initial', '2025-05-26 20:16:30.788435'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-05-26 20:16:30.829427'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-05-26 20:16:31.219747'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-05-26 20:16:32.062726'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-05-26 20:16:34.045275'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-05-26 20:16:34.377825'),
(9, 'auth', '0004_alter_user_username_opts', '2025-05-26 20:16:34.417385'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-05-26 20:16:35.038390'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-05-26 20:16:35.175307'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-05-26 20:16:35.283469'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-05-26 20:16:35.485452'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-05-26 20:16:35.669797'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-05-26 20:16:35.917954'),
(16, 'auth', '0011_update_proxy_permissions', '2025-05-26 20:16:36.006486'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-05-26 20:16:36.167915'),
(18, 'mi_app', '0001_initial', '2025-05-26 20:16:40.103822'),
(19, 'sessions', '0001_initial', '2025-05-26 20:16:40.424962'),
(20, 'mi_app', '0002_datadocument_cod_factura', '2025-05-26 20:40:53.607005'),
(21, 'mi_app', '0003_alter_datacompany_address', '2025-05-26 20:40:54.277792'),
(22, 'mi_app', '0004_alter_dataclient_address', '2025-05-26 20:42:19.191985'),
(23, 'mi_app', '0005_remove_datadocument_cod_factura', '2025-05-26 20:46:01.931728'),
(24, 'mi_app', '0006_remove_datadocument_base_imponible_and_more', '2025-05-26 20:51:52.449504');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('d6vwomc522ioykaz56tovmscz00ux221', '.eJxVjDsOwjAQBe_iGlleG_8o6XMGa71e4wCKpXwqxN0hUgpo38y8l0i4rS1tC89pLOIiQJx-t4z04GkH5Y7TrUvq0zqPWe6KPOgih174eT3cv4OGS_vWwVti8tp4pWs0VLmEkNEC6FpIOaW5IFXjCF20ZyDyFkK01YNDYCXeH-8eOAM:1uJeGX:vdKlbC5bF4mBRrCXG1kNuVHqBoMUOm9FbqeKgPbSXuA', '2025-06-09 20:17:45.366960');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mi_app_dataclient`
--

CREATE TABLE `mi_app_dataclient` (
  `cif` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `city` varchar(100) NOT NULL,
  `number` varchar(20) NOT NULL,
  `company_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mi_app_dataclient`
--

INSERT INTO `mi_app_dataclient` (`cif`, `name`, `address`, `zip_code`, `city`, `number`, `company_id`) VALUES
('Q-8350064-E', 'Hospital De San Agustin', 'Camino de Heroes S/N', '33400', 'Aviles', '0000', 'Y9509223W');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mi_app_datacompany`
--

CREATE TABLE `mi_app_datacompany` (
  `cif` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `city` varchar(100) NOT NULL,
  `number` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mi_app_datacompany`
--

INSERT INTO `mi_app_datacompany` (`cif`, `name`, `address`, `zip_code`, `city`, `number`, `email`) VALUES
('Y9509223W', 'Jenny Katerine Osorio Rueda', 'Gonzales Abarca N 24', '33400', 'Aviles', '602573781', 'tapiceriarincon2@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mi_app_datadocument`
--

CREATE TABLE `mi_app_datadocument` (
  `id` bigint(20) NOT NULL,
  `referencia` varchar(50) NOT NULL,
  `descripcion` longtext NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `dto` decimal(5,2) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `documento_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mi_app_datadocument`
--

INSERT INTO `mi_app_datadocument` (`id`, `referencia`, `descripcion`, `cantidad`, `precio`, `dto`, `importe`, `documento_id`) VALUES
(1, '1', 'Tapizado de Asiento Butaca - Pediatria\r\nArmazon de Hierro Color Granate\r\nMateriales', 2.00, 32.00, 0.00, 64.00, '23-0033'),
(2, '2', 'Mano de Obra', 2.00, 57.00, 0.00, 114.00, '23-0033');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mi_app_document`
--

CREATE TABLE `mi_app_document` (
  `num_factura` varchar(50) NOT NULL,
  `fecha_factura` date NOT NULL,
  `observaciones` longtext DEFAULT NULL,
  `cod_cliente_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mi_app_document`
--

INSERT INTO `mi_app_document` (`num_factura`, `fecha_factura`, `observaciones`, `cod_cliente_id`) VALUES
('23-0033', '2023-02-10', 'Cliente Constante', 'Q-8350064-E');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mi_app_footerdocument`
--

CREATE TABLE `mi_app_footerdocument` (
  `id` bigint(20) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `base_imponible` decimal(10,2) NOT NULL,
  `iva` decimal(5,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `footer_documento_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mi_app_footerdocument`
--

INSERT INTO `mi_app_footerdocument` (`id`, `subtotal`, `base_imponible`, `iva`, `total`, `footer_documento_id`) VALUES
(2, 358.00, 358.00, 75.18, 433.18, '23-0033');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mi_app_pago`
--

CREATE TABLE `mi_app_pago` (
  `id` bigint(20) NOT NULL,
  `forma_pago` varchar(100) NOT NULL,
  `empresa_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mi_app_pago`
--

INSERT INTO `mi_app_pago` (`id`, `forma_pago`, `empresa_id`) VALUES
(1, 'Transferencia BBVA ES9801820606870201760037', 'Y9509223W');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indices de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indices de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indices de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indices de la tabla `mi_app_dataclient`
--
ALTER TABLE `mi_app_dataclient`
  ADD PRIMARY KEY (`cif`),
  ADD KEY `mi_app_dataclient_company_id_1330189b_fk_mi_app_datacompany_cif` (`company_id`);

--
-- Indices de la tabla `mi_app_datacompany`
--
ALTER TABLE `mi_app_datacompany`
  ADD PRIMARY KEY (`cif`);

--
-- Indices de la tabla `mi_app_datadocument`
--
ALTER TABLE `mi_app_datadocument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mi_app_datadocument_documento_id_780efe39_fk_mi_app_do` (`documento_id`);

--
-- Indices de la tabla `mi_app_document`
--
ALTER TABLE `mi_app_document`
  ADD PRIMARY KEY (`num_factura`),
  ADD KEY `mi_app_document_cod_cliente_id_3d72313e_fk_mi_app_dataclient_cif` (`cod_cliente_id`);

--
-- Indices de la tabla `mi_app_footerdocument`
--
ALTER TABLE `mi_app_footerdocument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mi_app_footerdocumen_footer_documento_id_30bd4974_fk_mi_app_do` (`footer_documento_id`);

--
-- Indices de la tabla `mi_app_pago`
--
ALTER TABLE `mi_app_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mi_app_pago_empresa_id_4b7f8c43_fk_mi_app_datacompany_cif` (`empresa_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `mi_app_datadocument`
--
ALTER TABLE `mi_app_datadocument`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `mi_app_footerdocument`
--
ALTER TABLE `mi_app_footerdocument`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `mi_app_pago`
--
ALTER TABLE `mi_app_pago`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Filtros para la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Filtros para la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `mi_app_dataclient`
--
ALTER TABLE `mi_app_dataclient`
  ADD CONSTRAINT `mi_app_dataclient_company_id_1330189b_fk_mi_app_datacompany_cif` FOREIGN KEY (`company_id`) REFERENCES `mi_app_datacompany` (`cif`);

--
-- Filtros para la tabla `mi_app_datadocument`
--
ALTER TABLE `mi_app_datadocument`
  ADD CONSTRAINT `mi_app_datadocument_documento_id_780efe39_fk_mi_app_do` FOREIGN KEY (`documento_id`) REFERENCES `mi_app_document` (`num_factura`);

--
-- Filtros para la tabla `mi_app_document`
--
ALTER TABLE `mi_app_document`
  ADD CONSTRAINT `mi_app_document_cod_cliente_id_3d72313e_fk_mi_app_dataclient_cif` FOREIGN KEY (`cod_cliente_id`) REFERENCES `mi_app_dataclient` (`cif`);

--
-- Filtros para la tabla `mi_app_footerdocument`
--
ALTER TABLE `mi_app_footerdocument`
  ADD CONSTRAINT `mi_app_footerdocumen_footer_documento_id_30bd4974_fk_mi_app_do` FOREIGN KEY (`footer_documento_id`) REFERENCES `mi_app_document` (`num_factura`);

--
-- Filtros para la tabla `mi_app_pago`
--
ALTER TABLE `mi_app_pago`
  ADD CONSTRAINT `mi_app_pago_empresa_id_4b7f8c43_fk_mi_app_datacompany_cif` FOREIGN KEY (`empresa_id`) REFERENCES `mi_app_datacompany` (`cif`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
