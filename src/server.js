const app = require('./app');
const port = process.env.PORT || 4000;
const server = app.listen(port)
  .on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`El puerto ${port} está ocupado. Intentando con el siguiente puerto...`);
      server.close();
      app.listen(port + 1)
        .on('listening', () => {
          console.log(`Servidor corriendo en http://localhost:${port + 1}`);
        });
    }
  })
  .on('listening', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });