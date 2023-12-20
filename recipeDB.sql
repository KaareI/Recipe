-- MySQL dump 10.13  Distrib 8.1.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: recipes
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `recipe`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Category` varchar(50) DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `Time` int DEFAULT NULL,
  `Instructions` varchar(1000) DEFAULT NULL,
  `Ingredients` varchar(500) DEFAULT NULL,
  `ImageURL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`ID`, `Name`, `Category`, `Type`, `Time`, `Instructions`, `Ingredients`, `ImageURL`) VALUES (2,'Pasta carbonara','PASTAD','SOOLANE',45,'Sega 3-4 munakollast koos 100 g riivjuustuga. Kurna keedetud pasta, lisa see pannile peekoni ja küüslauguga ning sega kiiresti munaseguga.\n\nMaitsesta soola ja värskelt jahvatatud musta pipraga. Serveeri kohe koos rohkelt riivitud juustuga. Nüüd saad nautida maitsvat pasta carbonarat!','1 spl oliiviõli, 225g peekonit, 1-2 küüslauguküünt, 3-4 muna, 100g riivjuustu, 450g spagette, sool, pipar','https://drive.google.com/uc?id=1PmXCCX-fE1CkpUw6fENh-tTUiLvUPk9E'),(12,'Küpsisekook','KOOGID','MAGUS',45,'1. Eelsoojenda ahi 180 kraadini Celsiuse järgi. Kata küpsetusplaat küpsetuspaberiga.\n2. Vahusta või suhkruga, kuni segu on hele ja kohev. Lisa ükshaaval munad, jätkates vahustamist.\n3. Sega omavahel jahu, küpsetuspulber, vanillsuhkur ja sool. Lisa kuivained võivahule ja sega ühtlaseks tainaks.\n4. Lisa hakitud pähklid ja šokolaadilaastud ning sega taigent.\n5. Määri tainas küpsetuspaberiga kaetud plaadile ja silu pind ühtlaseks.\n6. Küpseta eelsoojendatud ahjus umbes 25-30 minutit või kuni küpsisekook on kuldpruun.\n7. Lase küpsisekoogil jahtuda ja lõika seejärel ruutudeks.','1 tass võid, 1 tass suhkrut, 2 muna, 2 tassitäit jahu, 1 tl küpsetuspulbrit, 1 tl vanillisuhkrut, Näpuotsaga soola, 1 tass hakitud pähkleid (näiteks sarapuupähklid või kreeka pähklid), 1 tass šokolaadilaaste\n','https://drive.google.com/uc?id=16v3IxPcqyemdR-wnI3_uGQ87HsFSjYVu'),(13,'Kreeka salat','SALATID','SOOLANE',20,'1. Kombineeri hakitud tomatid, tükeldatud kurk, õhukeselt viilutatud punane sibul, tükeldatud feta juust, ja mustad oliivid suures kausis.\n2. Puista üle kuivatatud oreganoga.\n3. Vala üle oliiviõli ja punaveiniäädikaga.\n4. Maitsesta soola ja pipraga vastavalt oma maitsele.\n5. Sega kõik koostisosad õrnalt, et maitseained ühtlaselt jaotuksid.\n6. Lase salatil enne serveerimist mõned minutid külmikus seista, et maitsed paremini seguneksid.\n7. Serveeri ja naudi värsket ja maitsvat kreeka salatit!','4 tomatit, 1 kurk, 1 punane sibul, 200 g feta juustu, 100 g musti oliive, 1 tl kuivatatud oreganot, 2 spl oliiviõli, 1 spl punaveiniäädikat, sool, pipar','https://drive.google.com/uc?id=19R2TuWNMGME1xxTOJIJUbuxlS7jtkMjL');
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-16 13:48:54
