const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

//const autoIncrement = require('mongoose-sequence')(mongoose);

const DoctorSchema = new mongoose.Schema({
    //_id: Number,
    image: String,
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
    rateAvg : {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    bio: {
        type: String,
    },
    price: {
        type: Number,
        trim: true,
        required: [true, "price is required"],
        max: [200000, "to long price"]
    },
    location: {
        type: String,
        trim: true,
        minlength: [2, 'To short city name'],
        maxlength: [32, 'To long city name'],
    },
    isfavourite: {
        type: Boolean,
        default: false,
    },
    isOnline : {
        type : Boolean,
        default : false
    },
    clinics: {
        type: [Object]
    },
    medicalCenter: {
        type: [Object]
    },
    reviews: {
        type: [Object]
    }
});
//DoctorSchema.plugin(autoIncrement);

 /*DoctorSchema.pre("save", function (next) {
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
 });*/

module.exports = mongoose.model('Doctor', DoctorSchema);