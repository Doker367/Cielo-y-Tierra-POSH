-- Crear tabla de categorías
CREATE TABLE categorias_posh (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Crear tabla de marcas
CREATE TABLE marcas (
    id_marca INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    pais_origen VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Crear tabla de productos 
CREATE TABLE productos_posh (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_categoria INT,
    id_marca INT,
    precio_regular DECIMAL(10,2) NOT NULL,
    precio_descuento DECIMAL(10,2),
    contenido_ml INT,
    grados_alcohol DECIMAL(4,2),
    imagen_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias_posh(id_categoria),
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);
-- Crear tabla de inventario
CREATE TABLE inventario (
    id_inventario INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT,
    cantidad INT NOT NULL DEFAULT 0,
    ubicacion VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos_posh(id_producto)
);
-- Crear tabla de calificaciones
CREATE TABLE calificaciones (
    id_calificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT,
    puntuacion DECIMAL(3,2) CHECK (puntuacion >= 0 AND puntuacion <= 5),
    comentario TEXT,
    nombre_usuario VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos_posh(id_producto)
);
-- Insertar datos de ejemplo en categorías
INSERT INTO categorias_posh (nombre, descripcion) VALUES
('Posh Tradicional', 'Bebidas tradicionales de posh sin sabores añadidos'),
('Posh Saborizado', 'Variedades de posh con sabores especiales'),
('Posh Premium', 'Línea premium de posh añejado');
-- Insertar datos de ejemplo en marcas
INSERT INTO marcas (nombre, descripcion, pais_origen) VALUES
('Cielo y Tierra', 'Marca principal de posh artesanal', 'México'),
('Ancestral', 'Posh tradicional de Chiapas', 'México'),
('Spirit of Maya', 'Posh premium con técnicas ancestrales', 'México');
-- Insertar datos de ejemplo en productos
INSERT INTO productos_posh (nombre, descripcion, id_categoria, id_marca, precio_regular, precio_descuento, contenido_ml, grados_alcohol) VALUES
('Posh Tradicional 750ml', 'Posh tradicional de caña de azúcar', 1, 1, 350.00, 280.00, 750, 35.00),
('Posh Ámbar', 'Posh añejado con ámbar', 3, 1, 450.00, 360.00, 750, 38.00),
('Posh Frutal', 'Posh saborizado con frutas tropicales', 2, 2, 380.00, 320.00, 750, 30.00);
-- Insertar datos de ejemplo en inventario
INSERT INTO inventario (id_producto, cantidad, ubicacion) VALUES
(1, 100, 'Almacén Principal'),
(2, 50, 'Almacén Premium'),
(3, 75, 'Almacén Principal');
-- Insertar datos de ejemplo en calificaciones
INSERT INTO calificaciones (id_producto, puntuacion, comentario, nombre_usuario) VALUES
(1, 4.5, 'Excelente sabor tradicional', 'Juan Pérez'),
(2, 5.0, 'El mejor posh premium que he probado', 'María García'),
(3, 4.0, 'Muy buen balance de sabores', 'Carlos López');