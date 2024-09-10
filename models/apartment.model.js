const { Schema, model } = require('mongoose');

// Definimos los servicios permitidos
const allowedServices = [
    'wifi',
    'airConditioner',
    'kitchen',
    'disability',
    'heater',
    'tv'
];

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    size: {
        type: Number,
        required: [true, 'El tamaño es obligatorio'],
        min: [0, 'El tamaño no puede ser negativo']
    },
    mainPhoto: {
        type: String,
        required: [true, 'La foto principal es obligatoria'],
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: props => `${props.value} no es una URL válida de imagen!`
        }
    },
    services: {
        wifi: {
            type: Boolean,
            default: false
        },
        airConditioner: {
            type: Boolean,
            default: false
        },
        kitchen: {
            type: Boolean,
            default: false
        },
        disability: {
            type: Boolean,
            default: false
        },
        heater: {
            type: Boolean,
            default: false
        },
        tv: {
            type: Boolean,
            default: false
        }
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
            lat: {
                type: Number,
                required: [true, 'La latitud es obligatoria'],
                min: -90,
                max: 90
            },
            lng: {
                type: Number,
                required: [true, 'La longitud es obligatoria'],
                min: -180,
                max: 180
            }
        }
    },
    maxGuests: {
        type: Number,
        required: [true, 'El número máximo de huéspedes es obligatorio'],
        min: [1, 'Debe haber al menos un huésped']
    },
    photos: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v);
            },
            message: props => `${props.value} no es una URL válida de imagen!`
        }
    }],
    rooms: {
        type: Number,
        required: [true, 'El número de habitaciones es obligatorio'],
        min: [1, 'Debe haber al menos una habitación']
    },
    beds: {
        type: Number,
        required: [true, 'El número de camas es obligatorio'],
        min: [1, 'Debe haber al menos una cama']
    },
    bathrooms: {
        type: Number,
        required: [true, 'El número de baños es obligatorio'],
        min: [1, 'Debe haber al menos un baño']
    }
});

// Validación personalizada para asegurar que solo se incluyan servicios permitidos
apartmentSchema.pre('validate', function(next) {
    const serviceKeys = Object.keys(this.services);
    if (!serviceKeys.every(key => allowedServices.includes(key))) {
        return next(new Error('Se ha incluido un servicio no válido'));
    }
    next();
});

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;
