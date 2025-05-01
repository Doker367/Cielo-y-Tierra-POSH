const { promisePool } = require('../config/db');
const jwt = require('jsonwebtoken');

class CartController {
    static async addToCart(req, res) {
        try {
            const { producto_id, cantidad } = req.body;
            console.log('Datos recibidos para agregar al carrito:', { producto_id, cantidad });

            if (!producto_id || !cantidad) {
                return res.status(400).json({ message: 'Todos los campos (producto_id, cantidad) son requeridos' });
            }

            console.log('Iniciando proceso para agregar al carrito...');

            // Obtener el ID del usuario autenticado desde el token JWT
            const authHeader = req.headers.authorization;
            console.log('Encabezado Authorization recibido:', authHeader); // Registro del encabezado Authorization
            if (!authHeader) {
                return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
            }

            const token = authHeader.split(' ')[1];
            console.log('Token JWT recibido:', token); // Registro del token JWT
            let usuario_id;
            try {
                const decoded = jwt.verify(token, 'secreto'); // Verificar y decodificar el token
                usuario_id = decoded.id;
                console.log('ID del usuario extraído del token:', usuario_id); // Registro del ID del usuario
            } catch (error) {
                console.error('Error al verificar el token JWT:', error);
                return res.status(403).json({ message: 'Token no válido' });
            }

            // Ignorar cualquier usuario_id enviado en el cuerpo de la solicitud
            if (req.body.usuario_id) {
                console.warn('El usuario_id enviado en el cuerpo será ignorado.');
            }

            // Verificar si el usuario existe antes de agregar al carrito
            console.log('Verificando si el usuario existe en la base de datos...');
            const [userRows] = await promisePool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
            console.log('Resultado de la verificación del usuario:', userRows);

            if (userRows.length === 0) {
                console.warn('El usuario no existe en la base de datos.');
                return res.status(404).json({ message: 'El usuario no existe' });
            }

            // Verificar si el producto existe antes de agregar al carrito
            console.log('Verificando si el producto existe en la base de datos...');
            const [productRows] = await promisePool.query('SELECT producto_id FROM productos_posh WHERE producto_id = ?', [producto_id]);
            console.log('Resultado de la verificación del producto:', productRows);

            if (productRows.length === 0) {
                console.warn('El producto no existe en la base de datos.');
                return res.status(404).json({ message: 'El producto no existe' });
            }

            console.log('Ejecutando consulta para agregar o actualizar el carrito...');
            const [result] = await promisePool.query(
                'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE cantidad = cantidad + ?',
                [usuario_id, producto_id, cantidad, cantidad]
            );
            console.log('Resultado de la consulta de carrito:', result);

            res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            res.status(500).json({ message: 'Error al agregar al carrito' });
        }
    }

    static async getCartByUserId(req, res) {
        try {
            const { userId } = req.params;
            const [rows] = await promisePool.query(
                `SELECT c.id, p.nombre, p.precio, c.cantidad, (p.precio * c.cantidad) AS total
                 FROM carrito c
                 JOIN productos_posh p ON c.producto_id = p.producto_id
                 WHERE c.usuario_id = ?`,
                [userId]
            );
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).json({ message: 'Error al obtener el carrito' });
        }
    }

    static async updateCartQuantity(req, res) {
        try {
            const { producto_id, cantidad } = req.body;
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
            }

            const token = authHeader.split(' ')[1];
            let usuario_id;
            try {
                const decoded = jwt.verify(token, 'secreto');
                usuario_id = decoded.id;
            } catch (error) {
                return res.status(403).json({ message: 'Token no válido' });
            }

            console.log('Cantidad recibida:', cantidad);
            console.log('Producto ID recibido:', producto_id);
            console.log('Usuario ID:', usuario_id);

            if (cantidad === 0) {
                await promisePool.query('DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?', [usuario_id, producto_id]);
                return res.status(200).json({ message: 'Producto eliminado del carrito' });
            }

            console.log('Valores antes de la consulta UPDATE:', { usuario_id, producto_id, cantidad });
            const [updateResult] = await promisePool.query('UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?', [cantidad, usuario_id, producto_id]);
            console.log('Resultado de la consulta UPDATE:', updateResult);

            const [carritoState] = await promisePool.query('SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?', [usuario_id, producto_id]);
            console.log('Estado del carrito después de la consulta UPDATE:', carritoState);

            if (updateResult.affectedRows === 0) {
                console.warn('No se encontró el producto en el carrito para actualizar.');
            }

            res.status(200).json({ message: 'Cantidad actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar la cantidad en el carrito:', error);
            res.status(500).json({ message: 'Error al actualizar la cantidad en el carrito' });
        }
    }

    static async deleteFromCart(req, res) {
        try {
            const { producto_id } = req.body;
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
            }

            const token = authHeader.split(' ')[1];
            let usuario_id;
            try {
                const decoded = jwt.verify(token, 'secreto');
                usuario_id = decoded.id;
            } catch (error) {
                return res.status(403).json({ message: 'Token no válido' });
            }

            await promisePool.query('DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?', [usuario_id, producto_id]);
            res.status(200).json({ message: 'Producto eliminado del carrito' });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
        }
    }
}

module.exports = CartController;