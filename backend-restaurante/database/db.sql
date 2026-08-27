CREATE DATABASE restaurant;

--using the database
use restaurant;

--creating a table 
CREATE TABLE pedido(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    platillo VARCHAR(50) NOT NULL,
    precio INTEGER  NOT NULL,
    cantidad INTEGER  NOT NULL,
    observaciones VARCHAR (100),
    cliente VARCHAR (100),
    fecha VARCHAR (20),
    estado VARCHAR(20)
);

CREATE TABLE users(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50) NOT NULL,
    name VARCHAR (50) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    password VARCHAR(50)
);



--Para mostrar todas las tablas
SHOW TABLES; 
