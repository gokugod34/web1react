const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Requerir archivo de rutas
const mainRoutes = require('./routes/main');

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Utilizar rutas
app.use('/', mainRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
