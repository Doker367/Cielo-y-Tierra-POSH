const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const app = express();
const port = process.env.PORT || 4000;

// Middleware para analizar JSON y datos codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Esto es necesario para procesar application/x-www-form-urlencoded

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API
app.use('/api', productRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});