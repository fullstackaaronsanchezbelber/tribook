// routes/index.js
const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/index.js');

// Ruta para mostrar todos los apartamentos
router.get('/', indexControllers.getApartments);

// Ruta para buscar apartamentos por diferentes criterios
router.get('/search', indexControllers.searchApartments);

// Ruta para ver el detalle de un apartamento específico
router.get('/apartment/:idApartment', indexControllers.getApartmentById);

// Ruta para procesar nuevas reservas
router.post('/apartment/new-reservation', indexControllers.postNewReservation);

// Ruta para mostrar el formulario de edición de un apartamento
router.get('/admin/apartment/:idApartment/edit', indexControllers.getEditApartmentForm);

// Ruta para procesar la actualización de un apartamento
router.post('/admin/apartment/:idApartment/edit', indexControllers.updateApartment);

module.exports = router;
