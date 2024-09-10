// importar el modelo
const Apartment = require('../models/apartment.model');

// Controlador para mostrar el formulario de nuevo apartamento
const getNewApartmentForm = (req, res) => {
    res.render('new-apartment', {
        apartment: {}
    });
};

// Controlador para mostrar el formulario de edición de un apartamento existente
const getEditAparmentForm = async (req, res) => {
    const { idApartment } = req.params;
    const apartment = await Apartment.findById(idApartment);
    res.render('new-apartment', {
        apartment
    });
};

// Controlador para procesar la creación o edición de un apartamento
const postNewApartment = async (req, res) => {
    const { id } = req.body;

    // Si hay un ID, actualiza el apartamento
    if (id) {
        await Apartment.findByIdAndUpdate(id, req.body);
        req.flash('success_msg', `Datos del apartamento actualizados.`);
        return res.redirect(req.get('referer'));
    }

    // Si no hay ID, crea un nuevo apartamento
    await Apartment.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        size: req.body.size,
        mainPhoto: req.body.mainPhoto
    });

    req.flash('success_msg', `Apartamento ${req.body.title} creado correctamente`);
    res.redirect('/');
};

module.exports = {
    getNewApartmentForm,
    postNewApartment,
    getEditAparmentForm
};
