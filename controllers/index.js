// controllers/index.js
const Apartment = require('../models/apartment.model');
const Reservation = require('../models/reservation.model');

// Controlador para obtener y mostrar todos los apartamentos
const getApartments = async (req, res) => {
    try {
        const apartments = await Apartment.find();
        res.render('apartments-list', { apartments });
    } catch (error) {
        console.error('Error al obtener los apartamentos:', error);
        res.status(500).send('Error al obtener los apartamentos');
    }
};

// Controlador para obtener y mostrar un apartamento específico
const getApartmentById = async (req, res) => {
    try {
        const { idApartment } = req.params;
        const selectedApartment = await Apartment.findById(idApartment);
        if (!selectedApartment) {
            return res.status(404).send('Apartamento no encontrado');
        }
        res.render('detail-apartment', { selectedApartment });
    } catch (error) {
        console.error('Error al obtener el apartamento:', error);
        res.status(500).send('Error al obtener el apartamento');
    }
};

// Controlador para buscar apartamentos por diferentes criterios
const searchApartments = async (req, res) => {
    const { maxPrice, minGuests, city, startDate, endDate } = req.query;

    let query = {};

    if (maxPrice) {
        query.price = { $lte: maxPrice };
    }

    if (minGuests) {
        query.maxGuests = { $gte: minGuests };
    }

    if (city) {
        query['location.city'] = city;
    }

    try {
        let apartments = await Apartment.find(query);

        if (startDate && endDate) {
            const reservations = await Reservation.find({
                startDate: { $lte: new Date(endDate) },
                endDate: { $gte: new Date(startDate) }
            }).populate('apartment');

            const unavailableApartmentIds = reservations.map(reservation => reservation.apartment._id);
            apartments = apartments.filter(apartment => !unavailableApartmentIds.includes(apartment._id));
        }

        res.render('apartments-list', { apartments });
    } catch (error) {
        console.error('Error al buscar los apartamentos:', error);
        res.status(500).send('Error al buscar los apartamentos');
    }
};

// Controlador para procesar una nueva reserva
const postNewReservation = async (req, res) => {
    try {
        const { email, startDate, endDate, idApartment } = req.body;

        // Verificar que las fechas son válidas
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).send('La fecha de fin debe ser posterior a la fecha de inicio');
        }

        // Buscar el apartamento
        const apartment = await Apartment.findById(idApartment);
        if (!apartment) {
            return res.status(404).send('Apartamento no encontrado');
        }

        // Verificar la disponibilidad del apartamento
        const overlappingReservations = await Reservation.find({
            apartment: idApartment,
            startDate: { $lt: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
        });

        if (overlappingReservations.length > 0) {
            return res.status(400).send('El apartamento no está disponible entre las fechas seleccionadas');
        }

        // Crear la nueva reserva
        const newReservation = await Reservation.create({
            email,
            startDate,
            endDate,
            apartment: idApartment
        });

        res.json(newReservation);
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).send('Error al crear la reserva');
    }
};

// Controlador para mostrar el formulario de edición de un apartamento
const getEditApartmentForm = async (req, res) => {
    try {
        const { idApartment } = req.params;
        const apartment = await Apartment.findById(idApartment);
        if (!apartment) {
            return res.status(404).send('Apartamento no encontrado');
        }
        res.render('edit-apartment', { apartment });
    } catch (error) {
        console.error('Error al obtener el formulario de edición:', error);
        res.status(500).send('Error al obtener el formulario de edición');
    }
};

// Controlador para actualizar un apartamento
const updateApartment = async (req, res) => {
    try {
        const { idApartment } = req.params;
        const updatedData = req.body;
        const apartment = await Apartment.findById(idApartment);
        if (!apartment) {
            return res.status(404).send('Apartamento no encontrado');
        }

        // Actualizar los datos del apartamento
        Object.assign(apartment, updatedData);
        await apartment.save();

        res.redirect(`/apartment/${idApartment}`);
    } catch (error) {
        console.error('Error al actualizar el apartamento:', error);
        res.status(500).send('Error al actualizar el apartamento');
    }
};

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation,
    getEditApartmentForm,
    updateApartment
};
