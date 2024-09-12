// Importar los modelos
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
        res.render('edit-apartment', {
            apartment
        });
    } catch (err) {
        req.flash('error_msg', 'Hubo un error al cargar el apartamento.');
        res.redirect('/');
    }
};

// Controlador para procesar la edición de un apartamento
const postEditApartmentForm = async (req, res) => {
    try {
        const { idApartment } = req.params; // Obtener el ID del apartamento desde los parámetros de la ruta
        const services = req.body.servicios || []; // Array de servicios
        const gps = req.body.gps ? req.body.gps.split(',') : [0, 0]; // Array de coordenadas
        
        const apartmentData = {
            title: req.body.title,
            description: req.body.description,
            rules: req.body.rules,  // Normas de uso del apartamento
            price: req.body.price,
            size: req.body.size,
            mainPhoto: req.body.mainPhoto,
            photos: req.body.descripcionesFotos ? req.body.descripcionesFotos.split(',').map(photo => ({ url: '', description: photo.trim() })) : [],  // Fotos adicionales
            maxGuests: req.body.maxPersonas || 1, // maxGuests es maxPersonas
            rooms: req.body.habitaciones || 1, // rooms es habitaciones
            beds: req.body.camas || 1, // beds es camas
            bathrooms: req.body.banos || 1, // bathrooms es banos
            services: {
                wifi: services.includes('Wifi'),
                airConditioner: services.includes('Aire Acondicionado'),
                kitchen: services.includes('Cocina'),
                disability: services.includes('Accesibilidad'),
                heater: services.includes('Calefacción'),
                tv: services.includes('TV')
            },
            location: {
                province: req.body.province || '',
                city: req.body.city || '',
                coordinates: {
                    lat: parseFloat(gps[0]) || 0,
                    lng: parseFloat(gps[1]) || 0
                }
            }
        };

        // Validación de los campos requeridos
        if (!apartmentData.title || !apartmentData.description || !apartmentData.price || !apartmentData.size || !apartmentData.mainPhoto) {
            req.flash('error_msg', 'Por favor, completa todos los campos requeridos.');
            console.log('Error en los campos requeridos:', apartmentData);
            return res.redirect(req.get('referer'));
        }

        // Actualizar el apartamento en la base de datos
        await Apartment.findByIdAndUpdate(idApartment, apartmentData, { new: true });
        req.flash('success_msg', `Apartamento actualizado correctamente.`);
        res.redirect(`/apartment/${idApartment}`); // Redirigir a la vista de detalle del apartamento actualizado
    } catch (err) {
        console.error('Error al actualizar el apartamento:', err);
        req.flash('error_msg', 'Hubo un error al actualizar el apartamento.');
        res.redirect(`/apartment/${idApartment}/edit`); // Redirigir de nuevo al formulario de edición en caso de error
    }
};


// Controlador para procesar la creación o edición de un apartamento
const postNewApartment = async (req, res) => {
    console.log('AQUIII', req.body);
    try {
        const { id } = req.body;
        const services = req.body.servicios || []; // Array de servicios
        const gps = req.body.gps ? req.body.gps.split(',') : [0, 0]; // Array de coordenadas
        
        const apartmentData = {
            title: req.body.title,
            description: req.body.description,
            rules: req.body.rules,  // Normas de uso del apartamento
            price: req.body.price,
            size: req.body.size,
            mainPhoto: req.body.mainPhoto,
            photos: req.body.descripcionesFotos ? req.body.descripcionesFotos.split(',').map(photo => ({ url: '', description: photo.trim() })) : [],  // Fotos adicionales
            maxGuests: req.body.maxPersonas || 1, // maxGuests es maxPersonas
            rooms: req.body.habitaciones || 1, // rooms es habitaciones
            beds: req.body.camas || 1, // beds es camas
            bathrooms: req.body.banos || 1, // bathrooms es banos
            services: {
                wifi: services.includes('Wifi'),
                airConditioner: services.includes('Aire Acondicionado'),
                kitchen: services.includes('Cocina'),
                disability: services.includes('Accesibilidad'),
                heater: services.includes('Calefacción'),
                tv: services.includes('TV')
            },
            location: {
                province: req.body.provincia || '',
                city: req.body.city || '',
                coordinates: {
                    lat: parseFloat(gps[0]) || 0,
                    lng: parseFloat(gps[1]) || 0
                }
            }
        };

        // Validación de los campos requeridos
        if (!apartmentData.title || !apartmentData.description || !apartmentData.price || !apartmentData.size || !apartmentData.mainPhoto) {
            req.flash('error_msg', 'Por favor, completa todos los campos requeridos.');
            console.log('Error en los campos requeridos:', apartmentData);
            return res.redirect(req.get('referer'));
        }

        if (id) {
            // Si hay un ID, actualiza el apartamento
            await Apartment.findByIdAndUpdate(id, apartmentData);
            req.flash('success_msg', `Datos del apartamento actualizados.`);
        } else {
            // Si no hay ID, crea un nuevo apartamento
            await Apartment.create(apartmentData);
            console.log('Apartamento creado:', apartmentData);
            req.flash('success_msg', `Apartamento ${req.body.title} creado correctamente.`);
        }

        res.redirect('/');
    } catch (err) {
        console.error('Error al procesar el apartamento:', err);
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
            return res.redirect('/'); // Redirigir a la página principal si no se encuentra el apartamento
        }

        // Convertir fechas a objetos Date para comparación
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Verificar si hay una reserva existente que coincida con las fechas
        const existingReservation = await Reservation.find({
            apartment: idApartment,
            $or: [
                { startDate: { $lt: end, $gte: start } },
                { endDate: { $gt: start, $lte: end } }
            ]
        });

        if (existingReservation.length > 0) {
            req.flash('error_msg', 'El apartamento no está disponible en las fechas seleccionadas.');
            return res.redirect(`/apartment/${idApartment}`);
        }

        // Crear una nueva reserva
        await Reservation.create({
            apartment: idApartment,
            startDate: startDate,
            endDate: endDate,
            email: email
        });

        req.flash('success_msg', 'Reserva realizada con éxito.');
        res.redirect('/');
    } catch (err) {
        console.error('Error al procesar la reserva:', err);
        req.flash('error_msg', 'Error al procesar la reserva.');
        res.redirect('/'); // Redirigir a la página principal en caso de error
    }
};

module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditApartmentForm,
    listApartments,
    getApartmentDetail,
    searchApartments,
    makeReservation,
    postEditApartmentForm
};

