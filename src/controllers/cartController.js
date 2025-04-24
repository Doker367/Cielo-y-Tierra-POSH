const { promisePool } = require('../config/db');

class CartController {
    static async addToCart(req, res) {
        try {
            const { usuario_id, producto_id, cantidad } = req.body;
            console.log('Datos recibidos para agregar al carrito:', { usuario_id, producto_id, cantidad });

            if (!usuario_id || !producto_id || !cantidad) {
                return res.status(400).json({ message: 'Todos los campos (usuario_id, producto_id, cantidad) son requeridos' });
            }

            console.log('Iniciando proceso para agregar al carrito...');

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
}

module.exports = CartController;