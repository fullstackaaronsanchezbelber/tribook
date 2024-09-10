// Rutas de administrador
const express = require('express');
const router = express.Router();

// importar controladores
const adminControllers = require('../controllers/admin.js');

// Ruta para mostrar el formulario para añadir un nuevo apartamento
router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);

// Ruta para manejar el POST del formulario de añadir o editar apartamento
router.post('/apartment/new-apartment', adminControllers.postNewApartment);

// Ruta para mostrar el formulario de edición de un apartamento específico
router.get('/apartment/:idApartment/edit', adminControllers.getEditAparmentForm);

module.exports = router;
