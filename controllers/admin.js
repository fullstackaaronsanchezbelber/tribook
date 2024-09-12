// importar el modelo
const Apartment = require('../models/apartment.model');
const Reservation = require('../models/reservation.model');

// Controlador para mostrar el formulario de nuevo apartamento
const getNewApartmentForm = (req, res) => {
    res.render('new-apartment', {
        apartment: {}
    });
};

// Controlador para mostrar el formulario de edición de un apartamento existente
const getEditApartmentForm = async (req, res) => {
    try {
        const { idApartment } = req.params;
        const apartment = await Apartment.findById(idApartment);
        if (!apartment) {
            req.flash('error_msg', 'Apartamento no encontrado.');
            return res.redirect('/');
        }
        res.render('new-apartment', {
            apartment
        });
    } catch (err) {
        req.flash('error_msg', 'Hubo un error al cargar el apartamento.');
        res.redirect('/');
    }
};

// Controlador para procesar la creación o edición de un apartamento
const postNewApartment = async (req, res) => {
    try {
        const { id } = req.body;
        const services = req.body.services || {};
        const location = req.body.location || {};
        const coordinates = location.coordinates || {};

        const apartmentData = {
            title: req.body.title,
            description: req.body.description,
            rules: req.body.rules,  // Normas de uso del apartamento
            price: req.body.price,
            size: req.body.size,
            mainPhoto: req.body.mainPhoto,
            photos: req.body.photos || [],  // Array de fotos adicionales
            maxGuests: req.body.maxGuests || 1,
            rooms: req.body.rooms || 1,
            beds: req.body.beds || 1,
            bathrooms: req.body.bathrooms || 1,
            services: {
                wifi: services.wifi || false,
                airConditioner: services.airConditioner || false,
                kitchen: services.kitchen || false,
                disability: services.disability || false,
                heater: services.heater || false,
                tv: services.tv || false
            },
            location: {
                province: location.province || '',
                city: location.city || '',
                coordinates: {
                    lat: coordinates.lat || 0,
                    lng: coordinates.lng || 0
                }
            }
        };

        // Validación de los campos requeridos
        if (!apartmentData.title || !apartmentData.description || !apartmentData.price || !apartmentData.size || !apartmentData.mainPhoto || !apartmentData.location.city || !apartmentData.location.province) {
            req.flash('error_msg', 'Por favor, completa todos los campos requeridos.');
            return res.redirect(req.get('referer'));
        }

        if (id) {
            // Si hay un ID, actualiza el apartamento
            await Apartment.findByIdAndUpdate(id, apartmentData);
            req.flash('success_msg', `Datos del apartamento actualizados.`);
        } else {
            // Si no hay ID, crea un nuevo apartamento
            await Apartment.create(apartmentData);
            req.flash('success_msg', `Apartamento ${req.body.title} creado correctamente`);
        }

        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Hubo un error al procesar el apartamento.');
        res.redirect('/');
    }
};

// Controlador para listar apartamentos en la página principal
const listApartments = async (req, res) => {
    try {
        const apartments = await Apartment.find({});
        res.render('apartment-list', { apartments });
    } catch (err) {
        req.flash('error_msg', 'Error al listar los apartamentos.');
        res.redirect('/');
    }
};

// Controlador para mostrar el detalle de un apartamento
const getApartmentDetail = async (req, res) => {
    try {
        const { idApartment } = req.params;
        const apartment = await Apartment.findById(idApartment);
        if (!apartment) {
            req.flash('error_msg', 'Apartamento no encontrado.');
            return res.redirect('/');
        }
        res.render('apartment-detail', { apartment });
    } catch (err) {
        req.flash('error_msg', 'Error al cargar el apartamento.');
        res.redirect('/');
    }
};

// Controlador para filtrar apartamentos
const searchApartments = async (req, res) => {
    try {
        const { maxGuests, maxPrice, city, startDate, endDate } = req.query;
        let filter = {};

        if (maxGuests) filter.maxGuests = { $gte: maxGuests };
        if (maxPrice) filter.price = { $lte: maxPrice };
        if (city) filter['location.city'] = city;

        const apartments = await Apartment.find(filter);
        res.render('apartment-list', { apartments });
    } catch (err) {
        req.flash('error_msg', 'Error al filtrar los apartamentos.');
        res.redirect('/');
    }
};

// Controlador para hacer una reserva
const makeReservation = async (req, res) => {
    try {
        const { idApartment, startDate, endDate, email } = req.body;
        const apartment = await Apartment.findById(idApartment);

        if (!apartment) {
            req.flash('error_msg', 'Apartamento no encontrado.');
            return res.redirect('/');
        }

        // Verificar si hay una reserva existente que coincida con las fechas
        const existingReservation = await Reservation.find({
            apartment: idApartment,
            $or: [
                { startDate: { $lt: endDate, $gte: startDate } },
                { endDate: { $gt: startDate, $lte: endDate } }
            ]
        });

        if (existingReservation.length > 0) {
            req.flash('error_msg', 'El apartamento no está disponible en las fechas seleccionadas.');
            return res.redirect('/apartment/' + idApartment);
        }

        // Crear una nueva reserva
        await Reservation.create({
            apartment: idApartment,
            startDate,
            endDate,
            email
        });

        req.flash('success_msg', 'Reserva realizada con éxito.');
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Error al procesar la reserva.');
        res.redirect('/');
    }
};

module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditApartmentForm,
    listApartments,
    getApartmentDetail,
    searchApartments,
    makeReservation
};
