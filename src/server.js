const app = require('./app');
const port = process.env.PORT || 4000;

function startServer(port) {
  const server = app.listen(port)
    .on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`El puerto ${port} está ocupado. Intentando con el siguiente puerto...`);
        startServer(port + 1); // Intentar con el siguiente puerto
      } else {
        console.error('Error al iniciar el servidor:', error);
      }
    })
    .on('listening', () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}

startServer(port);