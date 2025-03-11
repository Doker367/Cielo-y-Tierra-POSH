#!/bin/bash 
# Cargar variables de entorno
if [ -f "../../.env" ]; then
    export $(cat ../../.env | grep -v '#' | awk '/=/ {print $1}')
fi

# Verificar variables requeridas
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
    echo "Error: Variables de entorno requeridas no están definidas"
    echo "Asegúrate de que DB_USER, DB_PASSWORD y DB_NAME estén definidas en el archivo .env"
    exit 1
fi

# Crear base de datos y usuario
mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

# Importar esquema si existe
if [ -f "$SCHEMA_FILE" ]; then
    mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${SCHEMA_FILE}
    echo "Schema importado exitosamente"
else
    echo "Archivo de schema no encontrado en: ${SCHEMA_FILE}"
fi