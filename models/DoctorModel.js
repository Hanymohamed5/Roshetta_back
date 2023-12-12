const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: [2, 'To short doctor name'],
        maxlength: [32, 'To long doctor name'],
    },
    specilization: {
        type: Number,
        trim: true,
    },
    city: {
        type: [Number],
        trim: true,
        minlength: [2, 'To short city name'],
        maxlength: [32, 'To long city name'],
    },
    price: {
        type: Number,
        trim: true,
        required: [true, "price is required"],
        max: [200000, "to long price"]
    },
    isfavourite: {
        type: Boolean,
        default: false,
    },
    aboutDoctor: {
        type: String,
    },
    image: String,
});

module.exports = mongoose.model('Doctor', DoctorSchema);