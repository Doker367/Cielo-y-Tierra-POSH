// src/controllers/user.controller.js
const { pool, promisePool } = require('../config/db'); // Importar el pool de conexiones y el pool de promesas
const bcrypt = require('bcrypt'); // Importar bcrypt para cifrar contraseñas
const jwt = require('jsonwebtoken'); // Importar JWT para manejar tokens

// Función para obtener todos los usuarios
exports.getUsers = (req, res) => {
    const query = "SELECT id, nombre_usuario, correo FROM usuarios"; // Removed rol and estado
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            return res.status(500).json({ message: "Error al obtener usuarios", error: err });
        }
        res.json(results);
    });
};

// Función para obtener un usuario por ID
exports.getUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const query = "SELECT id, nombre_usuario, correo FROM usuarios WHERE id = ?"; // Removed rol and estado
    pool.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al obtener el usuario:', err);
            return res.status(500).json({ message: "Error al obtener usuario", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(results[0]);
    });
};

// Función para crear un usuario
exports.createUser = async (req, res) => {
    console.log("Headers:", req.headers); // Verifica los encabezados de la solicitud
    console.log("Request body received:", req.body); // Verifica el cuerpo de la solicitud

    const { nombre_usuario, correo, contrasena } = req.body;

    // Validar que los campos requeridos no estén vacíos
    if (!nombre_usuario || !correo || !contrasena) {
        console.log("Validation failed: Missing fields"); // Debugging log
        return res.status(400).json({
            message: "Todos los campos (nombre_usuario, correo, contrasena) son obligatorios"
        });
    }

    try {
        // Verificar si el correo ya existe
        const checkQuery = "SELECT id FROM usuarios WHERE correo = ?";
        console.log("Executing query to check email:", checkQuery, [correo]); // Debugging log
        const [results] = await promisePool.query(checkQuery, [correo]);

        if (results.length > 0) {
            console.log("Correo ya registrado:", correo); // Debugging log
            return res.status(409).json({ message: "El correo ya está registrado" });
        }

        // Cifrar la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar el nuevo usuario
        const insertQuery = "INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)";
        console.log("Executing query to insert user:", insertQuery, [nombre_usuario, correo, hashedPassword]); // Debugging log
        const [result] = await promisePool.query(insertQuery, [nombre_usuario, correo, hashedPassword]);

        console.log("Usuario registrado exitosamente:", result); // Debugging log
        res.json({
            message: 'Usuario registrado exitosamente',
            data: { id: result.insertId, nombre_usuario, correo }
        });
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ message: "Error al registrar usuario", error: err });
    }
};

// Función para iniciar sesión
exports.loginUser = async (req, res) => {
    try {
        const { correo, nombre_usuario, contrasena } = req.body;

        if (!contrasena || (!correo && !nombre_usuario)) {
            return res.status(400).json({
                code: 4001,
                message: "Debes proporcionar (correo o nombre de usuario) y contraseña",
            });
        }

        const query = correo 
            ? "SELECT * FROM usuarios WHERE correo = ?"
            : "SELECT * FROM usuarios WHERE nombre_usuario = ?";

        const params = [correo || nombre_usuario];
        const [users] = await promisePool.query(query, params);

        if (users.length === 0) {
            return res.status(404).json({
                code: 4004,
                message: "Usuario no encontrado",
            });
        }

        const user = users[0];
        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({
                code: 4003,
                message: "Contraseña incorrecta",
            });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.id, email: user.correo }, 'secreto', { expiresIn: '1h' });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                correo: user.correo,
                rol: user.rol // Incluir el rol del usuario en la respuesta
            }
        });

    } catch (error) {
        res.status(500).json({
            code: 5000,
            message: "Error interno del servidor",
        });
    }
};

// Función para actualizar un usuario
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, correo } = req.body; // Removed rol and estado
    const query = "UPDATE usuarios SET nombre_usuario = ?, correo = ? WHERE id = ?"; // Removed rol and estado
    pool.query(query, [nombre_usuario, correo, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).json({ message: "Error al actualizar usuario", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario actualizado correctamente" });
    });
};

// Función para eliminar un usuario
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM usuarios WHERE id = ?";
    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).json({ message: "Error al eliminar usuario", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    });
};

// Función para obtener el usuario autenticado desde el token
exports.getAuthenticatedUser = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No se proporcionó un token" });
    }
    

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secreto', (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token no válido" });
        }

        const query = "SELECT id, nombre_usuario, correo FROM usuarios WHERE id = ?";
        pool.query(query, [user.id], (err, results) => {
            if (err) {
                console.error('Error al obtener el usuario autenticado:', err);
                return res.status(500).json({ message: "Error al obtener usuario autenticado", error: err });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.json(results[0]);
        });
    });
};


