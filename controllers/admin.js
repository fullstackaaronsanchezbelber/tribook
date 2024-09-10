// importar el modelo
const Apartment = require('../models/apartment.model');

// Controlador para mostrar el formulario de nuevo apartamento
const getNewApartmentForm = (req, res) => {
    res.render('new-apartment', {
        apartment: {}
    });
};

// Controlador para mostrar el formulario de edición de un apartamento existente
const getEditApartmentForm = async (req, res) => {
    const { idApartment } = req.params;
    const apartment = await Apartment.findById(idApartment);
    res.render('new-apartment', {
        apartment
    });
};

// Controlador para procesar la creación o edición de un apartamento
const postNewApartment = async (req, res) => {
    const { id } = req.body;

    // Asegúrate de que req.body.services sea un objeto
    const services = req.body.services || {};
    const location = req.body.location || {};
    const coordinates = location.coordinates || {};

    // Si hay un ID, actualiza el apartamento
    if (id) {
        await Apartment.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            size: req.body.size,
            mainPhoto: req.body.mainPhoto,
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
            },
            maxGuests: req.body.maxGuests || 1,
            photos: req.body.photos || [],
            rooms: req.body.rooms || 1,
            beds: req.body.beds || 1,
            bathrooms: req.body.bathrooms || 1
        });
        req.flash('success_msg', `Datos del apartamento actualizados.`);
        return res.redirect(req.get('referer'));
    }

    // Si no hay ID, crea un nuevo apartamento
    await Apartment.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        size: req.body.size,
        mainPhoto: req.body.mainPhoto,
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
        },
        maxGuests: req.body.maxGuests || 1,
        photos: req.body.photos || [],
        rooms: req.body.rooms || 1,
        beds: req.body.beds || 1,
        bathrooms: req.body.bathrooms || 1
    });

    req.flash('success_msg', `Apartamento ${req.body.title} creado correctamente`);
    res.redirect('/');
};

module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditApartmentForm
};
