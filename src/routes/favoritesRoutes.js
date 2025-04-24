const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Ruta para agregar un producto a favoritos
router.post('/', favoritesController.addToFavorites);

// Ruta para obtener los productos favoritos de un usuario
router.get('/:usuario_id', favoritesController.getFavorites);

module.exports = router;