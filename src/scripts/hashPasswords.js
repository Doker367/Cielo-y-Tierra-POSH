const { promisePool } = require('../config/db');
const bcrypt = require('bcrypt');

(async () => {
    try {
        // Obtener todos los usuarios con contraseñas sin cifrar
        const [users] = await promisePool.query("SELECT id, contrasena FROM usuarios");

        for (const user of users) {
            // Cifrar la contraseña
            const hashedPassword = await bcrypt.hash(user.contrasena, 10);

            // Actualizar la contraseña en la base de datos
            await promisePool.query("UPDATE usuarios SET contrasena = ? WHERE id = ?", [hashedPassword, user.id]);
            console.log(`Contraseña actualizada para el usuario con ID: ${user.id}`);
        }

        console.log("Todas las contraseñas han sido actualizadas.");
        process.exit(0);
    } catch (error) {
        console.error("Error al actualizar contraseñas:", error);
        process.exit(1);
    }
})();
