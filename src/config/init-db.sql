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
-- Crear tabla de clasificaciones
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único para cada usuario
    nombre_usuario VARCHAR(50) NOT NULL, -- Nombre de usuario único
    correo VARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico único
    contrasena VARCHAR(255) NOT NULL, -- Contraseña encriptada
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de registro
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
INSERT INTO productos_posh (nombre, descripcion, categoria_id, marca_id, precio, contenido_ml) VALUES
('Posh Tradicional 750ml', 'Posh tradicional de caña de azúcar, elaborado artesanalmente en Chiapas.', 1, 1, 350.00, 750),
('Posh Ámbar', 'Posh añejado con ámbar, con un sabor suave y aromático.', 3, 1, 450.00, 750),
('Posh Frutal', 'Posh saborizado con frutas tropicales como mango, piña y maracuyá.', 2, 2, 380.00, 750),
('Posh de Café', 'Posh destilado con granos de café arábica de Chiapas, con un aroma intenso.', 2, 3, 400.00, 750),
('Posh de Naranja', 'Posh con un toque cítrico de naranja valenciana, ideal para cócteles.', 2, 2, 370.00, 750),
('Posh de Mango', 'Posh saborizado con mango ataulfo, dulce y refrescante.', 2, 1, 390.00, 750),
('Posh de Piña', 'Posh con un refrescante sabor a piña natural, perfecto para el verano.', 2, 3, 380.00, 750),
('Posh de Maracuyá', 'Posh con el exótico sabor del maracuyá, ideal para paladares aventureros.', 2, 2, 410.00, 750),
('Posh de Cacao', 'Posh con notas de cacao puro de Chiapas, un deleite para los amantes del chocolate.', 3, 1, 450.00, 750),
('Posh de Canela', 'Posh con un toque especiado de canela, perfecto para días fríos.', 2, 3, 360.00, 750);
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


