const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

// Configuración de Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('home'); // Renderiza el archivo home.hbs
});

// Ruta para la API de productos
app.get('/api/products', async (req, res) => {
    try {
        const ProductController = require('./controllers/productController');
        const products = await ProductController.getProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/pages', express.static(path.join(__dirname, '../public/pages')));

module.exports = app;