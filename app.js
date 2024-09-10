// app.js

// Importar módulos de terceros
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const dotenv = require('dotenv');

// Configurar variables de entorno
dotenv.config();

// Importar las rutas públicas
const indexRoutes = require('./routes/index.js');

// Importar las rutas de administrador
const adminRoutes = require('./routes/admin.js');

// Importar las rutas de autentificación
const authRoutes = require('./routes/auth.js');

// Crear una instancia del servidor Express
const app = express();

// Middleware para procesar peticiones POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'miSecretoSuperSecreto',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true en producción con HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

// Inicializar flash
app.use(flash());

// Middleware para hacer disponibles las variables globales en las vistas
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAuthenticated || false;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Usar el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// Middleware para proteger las rutas de administrador
app.use('/admin', (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta página');
        res.redirect('/login');
    }
});

// Usar las rutas
app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use('/', indexRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('404', { url: req.originalUrl });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { error: err });
});

// Conectar a MongoDB y arrancar el servidor
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a la base de datos');
    app.listen(PORT, () => {
        console.log(`Servidor escuchando correctamente en el puerto ${PORT}`);
    });
})
.catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});
