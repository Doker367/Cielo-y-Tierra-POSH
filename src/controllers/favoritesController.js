const { promisePool } = require('../config/db');

// Agregar un producto a favoritos
exports.addToFavorites = async (req, res) => {
    const { usuario_id, producto_id } = req.body;
    try {
        await promisePool.query(
            'INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE producto_id = producto_id',
            [usuario_id, producto_id]
        );
        res.status(200).json({ message: 'Producto agregado a favoritos correctamente' });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ message: 'Error al agregar a favoritos' });
    }
};

// Obtener productos favoritos de un usuario
exports.getFavorites = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const [result] = await promisePool.query(
            'SELECT p.nombre, p.precio FROM favoritos f JOIN productos_posh p ON f.producto_id = p.producto_id WHERE f.usuario_id = ?',
            [usuario_id]
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener los favoritos:', error);
        res.status(500).json({ message: 'Error al obtener los favoritos' });
    }
};