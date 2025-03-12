const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de tener configurada la conexión a tu base de datos

// Ruta para obtener todos los productos
router.get('/api/products', async (req, res) => {
    try {
        const productos = await db.query('SELECT id, nombre, descripcion, precio, descuento, imagen FROM productos');
        res.json(productos.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

module.exports = router;
