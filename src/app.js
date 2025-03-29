const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Configuración de Handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

const db = require('./config/db');

// Middleware para analizar JSON y datos codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Esto es necesario para procesar application/x-www-form-urlencoded

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

// Importar el controlador de usuarios
const UserController = require('./controllers/user.controllers');

// Ruta para obtener todos los usuarios
app.get('/api/users', UserController.getUsers);

// Ruta para obtener un usuario por ID
app.get('/api/users/:id', UserController.getUser);

// Ruta para crear un nuevo usuario
app.post('/api/users', UserController.createUser);

// Ruta para actualizar un usuario por ID
app.put('/api/users/:id', UserController.updateUser);

// Ruta para eliminar un usuario por ID
app.delete('/api/users/:id', UserController.deleteUser);

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/pages', express.static(path.join(__dirname, '../public/pages')));

// Rutas de la API
app.use('/api', productRoutes);

module.exports = app;