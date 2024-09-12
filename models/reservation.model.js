const { Schema, model } = require('mongoose');

const reservationSchema = new Schema({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        match: [/\S+@\S+\.\S+/, 'El email no es válido']
    },
    startDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    apartment: { 
        type: Schema.Types.ObjectId, 
        ref: 'Apartment',
        required: [true, 'El ID del apartamento es obligatorio']
    }
});

// Validación para asegurar que startDate es antes que endDate
reservationSchema.pre('validate', function(next) {
    if (this.startDate >= this.endDate) {
        this.invalidate('endDate', 'La fecha de fin debe ser posterior a la fecha de inicio');
    }
    next();
});

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;
