// Rutas de autentificación
const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth');

// Ruta para mostrar el formulario de login
router.get('/login', authControllers.getLoginForm);

// Ruta para procesar el formulario de login
router.post('/login', authControllers.postLoginForm);

// Ruta para cerrar sesión
router.get('/logout', authControllers.logout);

module.exports = router;
