// src/controllers/user.controller.js
const { pool } = require('../config/db'); // Importar el pool de conexiones

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
exports.createUser = (req, res) => {
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

    // Verificar si el correo ya existe
    const checkQuery = "SELECT id FROM usuarios WHERE correo = ?";
    console.log("Executing query to check email:", checkQuery, [correo]); // Debugging log
    pool.query(checkQuery, [correo], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo:', err);
            return res.status(500).json({ message: "Error al verificar el correo", error: err });
        }
        if (results.length > 0) {
            console.log("Correo ya registrado:", correo); // Debugging log
            return res.status(409).json({ message: "El correo ya está registrado" });
        }

        // Insertar el nuevo usuario
        const insertQuery = "INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)";
        console.log("Executing query to insert user:", insertQuery, [nombre_usuario, correo, contrasena]); // Debugging log
        pool.query(insertQuery, [nombre_usuario, correo, contrasena], (err, result) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                return res.status(500).json({ message: "Error al registrar usuario", error: err });
            }
            console.log("Usuario registrado exitosamente:", result); // Debugging log
            res.json({
                message: 'Usuario registrado exitosamente',
                data: { id: result.insertId, nombre_usuario, correo }
            });
        });
    });
};

// Función para iniciar sesión
exports.loginUser = (req, res) => {
    const { correo, nombre_usuario, contrasena } = req.body;

    // Validar que al menos correo o nombre_usuario y contrasena estén presentes
    if ((!correo && !nombre_usuario) || !contrasena) {
        return res.status(400).json({
            message: "Debe proporcionar correo o nombre_usuario, y la contraseña"
        });
    }

    // Construir la consulta dinámica según los campos proporcionados
    const query = correo
        ? "SELECT id, nombre_usuario, correo FROM usuarios WHERE correo = ? AND contrasena = ?"
        : "SELECT id, nombre_usuario, correo FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?";
    const params = correo ? [correo, contrasena] : [nombre_usuario, contrasena];

    pool.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.status(500).json({ message: "Error al iniciar sesión", error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
        res.json({
            message: "Inicio de sesión exitoso",
            user: results[0]
        });
    });
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

