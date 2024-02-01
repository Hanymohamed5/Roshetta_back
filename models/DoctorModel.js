const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

//const autoIncrement = require('mongoose-sequence')(mongoose);

const DoctorSchema = new mongoose.Schema({
    _id: Number,
    name: {
        type: String,
        trim: true,
        minlength: [2, 'To short doctor name'],
        maxlength: [32, 'To long doctor name'],
    },
    specilization: {
        type: [Number],
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
    clinic: String,
});
//DoctorSchema.plugin(autoIncrement);

 DoctorSchema.pre("save", function (next) {
     let doc = this;
     sequencing.getSequenceNextValue("Doctor_id").
     then(counter => {
         if(!counter) {
            sequencing.insertCounter("Doctor_id")
             .then(counter => {
                 doc._id = counter;
                 console.log(doc)
                 next();
             })
             .catch(error => next(error))
         } else {
             doc._id = counter;
             next();
         }
     })
     .catch(error => next(error))
 });

module.exports = mongoose.model('Doctor', DoctorSchema);