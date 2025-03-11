const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await ProductController.getProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});
// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductController.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});
module.exports = router;