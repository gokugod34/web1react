const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const userController = require('./controllers/userController');
const cartController = require('./controllers/cartController');
const apiRoutes = require('./routes/api');
const app = express();
const port = 3000;

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar carpeta de archivos estáticos
app.use(express.static('public'));

// Configurar captura de datos de formularios (req.body)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173']
}));

app.use('/api', apiRoutes);

// Configurar sesiones
app.use(session({
    secret: 'miEcommerceSecretKey',
    resave: false,
    saveUninitialized: false
}));

// Middleware para inicializar el carrito en la sesión
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// Middleware global para contar los items totales en el carrito
app.use((req, res, next) => {
    const cart = req.session.cart;
    const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
    res.locals.cartTotalItems = total;
    res.locals.cartCount = total;
    next();
});

const mainController = require('./controllers/mainController');

// Rutas
app.get('/', mainController.index);

app.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Iniciar Sesión' });
});

app.get('/register', userController.register);
app.post('/register', userController.processRegister);

const productRoute = require('./routes/productRoute');
app.use('/products', productRoute);

const productController = require('./controllers/productController');
app.get('/search', productController.search);
app.get('/categories/:category', productController.showCategory);

app.get('/cart', cartController.list);
app.post('/cart/add', cartController.add);
app.post('/cart/update', cartController.update);
app.post('/cart/clear', cartController.clear);

app.get('/checkout', cartController.checkout);

// Middleware para manejar error 404
app.use((req, res, next) => {
    res.status(404).render('not-found', { title: 'Página no encontrada' });
});

// Middleware para manejar errores 500 (debe estar al final y tener 4 parámetros)
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Asegurar que las variables locales del carrito estén inicializadas para evitar caídas en el header.ejs
    res.locals.cartTotalItems = res.locals.cartTotalItems || 0;
    res.locals.cartCount = res.locals.cartCount || 0;
    
    res.status(500).render('error-server');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

