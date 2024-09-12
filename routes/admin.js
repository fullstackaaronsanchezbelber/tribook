const express = require('express');
const router = express.Router();

// Importar controladores
const adminControllers = require('../controllers/admin.js');

// Ruta para mostrar el formulario para añadir un nuevo apartamento
router.get('/apartment/new-apartment', adminControllers.getNewApartmentForm);

// Ruta para manejar el POST del formulario de añadir o editar apartamento
router.post('/apartment/new-apartment', adminControllers.postNewApartment);

// Ruta para mostrar el formulario de edición de un apartamento específico
router.get('/apartment/:idApartment/edit', adminControllers.getEditApartmentForm);

// Ruta para POST el formulario de edición de un apartamento específico
router.post('/apartment/:idApartment/edit', adminControllers.postEditApartmentForm);

// Ruta para listar apartamentos
router.get('/', adminControllers.listApartments);

// Ruta para mostrar el detalle de un apartamento
router.get('/apartment/:idApartment', adminControllers.getApartmentDetail);

// Ruta para filtrar apartamentos
router.get('/search', adminControllers.searchApartments);

// Ruta para hacer una nueva reserva
router.post('/apartment/new-reservation', adminControllers.makeReservation);

module.exports = router;
