-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 25. Jan 2019 um 12:21
-- Server-Version: 10.1.36-MariaDB
-- PHP-Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `login`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `logindaten`
--

CREATE TABLE `logindaten` (
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `vorname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nachname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passwort` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `logindaten`
--

INSERT INTO `logindaten` (`username`, `vorname`, `nachname`, `passwort`) VALUES
('ellihassler12', '', '', '1234');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `token`
--

CREATE TABLE `token` (
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `token` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `token`
--

INSERT INTO `token` (`username`, `token`) VALUES
('ellihassler12', 274673);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `logindaten`
--
ALTER TABLE `logindaten`
  ADD PRIMARY KEY (`username`);

--
-- Indizes für die Tabelle `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`username`);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_ibfk_1` FOREIGN KEY (`username`) REFERENCES `logindaten` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
