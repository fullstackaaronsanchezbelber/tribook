const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    rules: {
        type: String,
        required: [true, 'Las normas de uso son obligatorias']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    size: {
        type: Number,
        required: [true, 'El tamaño es obligatorio']
    },
    mainPhoto: {
        type: String,
        required: [true, 'La foto principal es obligatoria']
    },
    photos: [
        {
            url: String,
            description: String
        }
    ],
    services: {
        wifi: { type: Boolean, default: false },
        airConditioner: { type: Boolean, default: false },
        kitchen: { type: Boolean, default: false },
        disability: { type: Boolean, default: false },
        heater: { type: Boolean, default: false },
        tv: { type: Boolean, default: false }
    },
    location: {
        province: {
            type: String,
            required: [true, 'La provincia es obligatoria']
        },
        city: {
            type: String,
            required: [true, 'La ciudad es obligatoria']
        },
        coordinates: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
        }
    },
    maxGuests: { type: Number, default: 1 },
    rooms: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Apartment', apartmentSchema);
