const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Configurar CORS y parseadores de cuerpo de peticiones
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Requerir archivo de rutas
const mainRoutes = require('./routes/main');
const apiRoutes = require('./api');

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Utilizar rutas
app.use('/', mainRoutes);
app.use('/', apiRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
