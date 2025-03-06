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

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/pages', express.static(path.join(__dirname, '../public/pages')));

module.exports = app;