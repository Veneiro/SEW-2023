SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `DataBase_Videojuegos_SEW` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE `DataBase_Videojuegos_SEW`;


DROP TABLE IF EXISTS `escaparate`;
CREATE TABLE IF NOT EXISTS `escaparate` (
  `cliente_dni` varchar(9) COLLATE utf8_spanish_ci NOT NULL,
  `videojuego_referencia` varchar(9) COLLATE utf8_spanish_ci NOT NULL,
  `dia_comprado` datetime NOT NULL,
  UNIQUE KEY `cliente_dni` (`cliente_dni`,`videojuego_referencia`),
  KEY `videojuego_referencia` (`videojuego_referencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


INSERT INTO `escaparate` (`cliente_dni`, `videojuego_referencia`, `dia_comprado`) VALUES
('53522342P', '000X', '2023-12-19 00:48:00'),
('53522342P', '001X', '2023-12-18 23:53:46');


DROP TABLE IF EXISTS `generos`;
CREATE TABLE IF NOT EXISTS `generos` (
  `id` varchar(9) COLLATE utf8_spanish_ci NOT NULL,
  `tipo` varchar(32) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


INSERT INTO `generos` (`id`, `tipo`) VALUES
('AR', 'Arcade'),
('PL', 'Plataformas'),
('SH', 'Shooter'),
('HS', 'Heroe Shooter'),
('MA', 'Mundo Abierto'),
('AC', 'Acción'),
('DE', 'Deportes'),
('TE', 'Terror');


DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `dni` varchar(9) COLLATE utf8_spanish_ci NOT NULL,
  `nombre` varchar(32) COLLATE utf8_spanish_ci NOT NULL,
  `apellidos` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `telefono` varchar(13) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


INSERT INTO `clientes` (`dni`, `nombre`, `apellidos`, `email`, `telefono`) VALUES
('53522342P', 'Mateo', 'Rico Iglesias', 'UO277172@uniovi.es', '636557454');


DROP TABLE IF EXISTS `videojuegos`;
CREATE TABLE IF NOT EXISTS `videojuegos` (
  `referencia` varchar(9) COLLATE utf8_spanish_ci NOT NULL,
  `titulo` varchar(32) COLLATE utf8_spanish_ci NOT NULL,
  `genero_id` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `director` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `distribuidora` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `desarrolladora` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `portada` varchar(64) COLLATE utf8_spanish_ci DEFAULT NULL,
  `ha_ganado_goty` int(11) NOT NULL,
  PRIMARY KEY (`referencia`),
  KEY `genero_id` (`genero_id`),
  KEY `desarrolladora` (`desarrolladora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


INSERT INTO `videojuegos` (`referencia`, `titulo`, `genero_id`, `director`, `distribuidora`, `desarrolladora`, `portada`, `ha_ganado_goty`) VALUES
('000X', 'Overwatch', 'HS', 'Aaron Keller', 'Blizzard', 'Blizzard', './multimedia/imagenes/overwatch.jpg', 1),
('001X', 'Metal Slug', 'AR', 'SNK', 'SNK', 'SNK', './multimedia/imagenes/metal_slug.jpg', 0),
('002X', 'Grand Theft Auto V', 'MA', 'Steve Martin', 'Rockstar Games', 'Rockstar North', './multimedia/imagenes/gtav.jpg', 1),
('003X', 'Horizon Zero Dawn', 'MA', 'Mathijs de Jonge', 'Sony Interactive Entertainment', 'Guerrilla Games', './multimedia/imagenes/horizon.jpg', 0),
('004X', 'Alien Isolation', 'TE', 'Alistair Hope', 'Sega 20th Century Fox', 'The Creative Assembly', './multimedia/imagenes/alien.jpg', 0),
('005X', 'Call of Duty: Black Ops 3', 'SH', 'Jason Blundel', 'Activision', 'Treyarch','./multimedia/imagenes/bo3.jpg', 0),
('006X', 'BioShock', 'AC', 'Ken Levine', '2K Games', '2K Boston', './multimedia/imagenes/bioshock.jpg', 1),
('007X', 'FIFA 23', 'DE', 'EA', 'EA', 'EA Canada', './multimedia/imagenes/fifa.jpg', 0),
('008X', 'Sea Of Thieves', 'AC', 'Gregg Mayles', 'Xbox Game Studios', 'Rare', './multimedia/imagenes/piratas.jpg', 0),
('009X', 'Red Dead Redemption', 'MA', 'Kevin Hoare / Rod Edge', 'Rockstar Games', 'Rockstar San Diego', './multimedia/imagenes/rdr.jpg', 1),
('010X', 'The Legend of Zelda: BOTW', 'AC', 'Hidemaro Fujibayashi', 'Nintendo', 'Nintendo Entertainment Planning and Development', './multimedia/imagenes/botw.jpg', 1),
('011X', 'Mario Bros Wii', 'PL', 'Shigeyuki Asuke', 'Nintendo', 'Nintendo Entertainment Analysis and Development', './multimedia/imagenes/mario_bros.jpg', 0);

DROP TABLE IF EXISTS `desarrolladoras`;
CREATE TABLE IF NOT EXISTS `desarrolladoras` (
  `nombre` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `fundación` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `empleados` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  `web` varchar(64) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

INSERT INTO `desarrolladoras` (nombre, fundación, empleados, web) VALUES
('Blizzard', '1991', '4600', 'www.blizzard.com'),
('SNK', '1978', '199', 'www.snk-corp.co.jp'),
('Rockstar North', '1988', 'N', 'www.rockstarnorth.com'),
('Guerrilla Games', '2000', '1920', 'www.guerrilla-games.com'),
('The Creative Assembly', '1987', '550', 'www.creative-assembly.com'),
('Treyarch', '1996', '250', 'www.treyarch.com'),
('2K Boston', '1997', 'N', 'www.ghoststorygames.com'),
('EA Canada', '1983', '3000', 'www.ea.com/careers/locations?modal-id=vancouver'),
('Rare', '1985', '200', 'www.rare.co.uk'),
('Rockstar San Diego', '1984', 'N', 'www.rockstarsandiego.com'),
('Nintendo Entertainment Planning and Development', '2015', 'N', 'nintendo.com'),
('Nintendo Entertainment Analysis and Development', '1983', '500', 'Nintendo.co.jp');

ALTER TABLE `escaparate`
  ADD CONSTRAINT `escaparate_ibfk_1` FOREIGN KEY (`cliente_dni`) REFERENCES `clientes` (`dni`),
  ADD CONSTRAINT `escaparate_ibfk_2` FOREIGN KEY (`videojuego_referencia`) REFERENCES `videojuegos` (`referencia`);

ALTER TABLE `videojuegos`
  ADD CONSTRAINT `videojuegos_ibfk_1` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),
  ADD CONSTRAINT `videojuegos_ibfk_2` FOREIGN KEY (`desarrolladora`) REFERENCES `desarrolladoras` (`nombre`);
COMMIT;