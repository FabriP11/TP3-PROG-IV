CREATE DATABASE IF NOT EXISTS tp3_transporte;

USE tp3_transporte;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    patente VARCHAR(20) NOT NULL UNIQUE,
    anio SMALLINT UNSIGNED NOT NULL,
    capacidad_carga DECIMAL(10,2) NOT NULL
);

-- Tabla de conductores
CREATE TABLE conductores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    numero_licencia VARCHAR(30) NOT NULL UNIQUE,
    fecha_alta_licencia DATE NOT NULL,
    fecha_vencimiento_licencia DATE NOT NULL
);

-- Tabla de viajes
CREATE TABLE viajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    conductor_id INT NOT NULL,
    fecha_salida DATETIME NOT NULL,
    fecha_llegada DATETIME NOT NULL,
    origen VARCHAR(150) NOT NULL,
    destino VARCHAR(150) NOT NULL,
    kilometros DECIMAL(10,2) NOT NULL,
    observaciones TEXT,

    FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (conductor_id)
        REFERENCES conductores(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);