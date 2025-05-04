-- Agregar columna 'rol' a la tabla 'usuarios'
ALTER TABLE usuarios
ADD COLUMN rol ENUM('admin', 'user') NOT NULL DEFAULT 'user';

-- Asignar el rol 'admin' a un usuario específico (por ejemplo, con id = 1)
UPDATE usuarios SET rol = 'admin' WHERE id = 1;

-- Asegurarse de que todos los demás usuarios tengan el rol 'user'
UPDATE usuarios SET rol = 'user' WHERE rol IS NULL;

ALTER TABLE usuarios
DROP COLUMN estado;
