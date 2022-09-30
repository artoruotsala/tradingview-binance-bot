# ************************************************************
# Sequel Ace SQL dump
# Version 20035
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 5.5.5-10.9.3-MariaDB-1:10.9.3+maria~ubu2204)
# Database: tradingview-binance-db
# Generation Time: 2022-09-30 06:50:12 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table alltrades
# ------------------------------------------------------------

DROP TABLE IF EXISTS `alltrades`;

CREATE TABLE `alltrades` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ticker` char(16) DEFAULT NULL,
  `quantity` text DEFAULT NULL,
  `buyPrice` text DEFAULT NULL,
  `sellPrice` text DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table tickers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tickers`;

CREATE TABLE `tickers` (
  `ticker` char(11) NOT NULL,
  `quantity` text DEFAULT NULL,
  `buyPrice` text DEFAULT NULL,
  `sellPrice` text DEFAULT NULL,
  `pyramids` int(11) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `highest` text DEFAULT NULL,
  PRIMARY KEY (`ticker`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `tickers` WRITE;
/*!40000 ALTER TABLE `tickers` DISABLE KEYS */;

INSERT INTO `tickers` (`ticker`, `quantity`, `buyPrice`, `sellPrice`, `pyramids`, `timestamp`, `highest`)
VALUES
	('BTCUSDT','0','0','0',0,0,'0');

/*!40000 ALTER TABLE `tickers` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
