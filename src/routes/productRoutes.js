const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const usercontroller = require('../controllers/user.controllers');

const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controllers');

// Middleware para analizar JSON y datos codificados en URL
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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

// Ruta para crear un usuario
router.post('/users', createUser);

// Nueva ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para actualizar un usuario (PUT)
router.put('/users/:id', updateUser);

// Ruta para eliminar un usuario (DELETE)
router.delete('/users/:id', deleteUser);

module.exports = router;
