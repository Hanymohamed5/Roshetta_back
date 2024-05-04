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
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0'],
        
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
    // parent referance 
    clinic: {
        type: mongoose.Schema.ObjectId,
        ref: "Clinic",
        //required: [true, "Doctor must belong to clinic"]
    },

    // parent referance 
    center: {
        type: mongoose.Schema.ObjectId,
        ref: "Center",
        //required: [true, "Doctor must belong to center"]
    },
},
{
    toJSON: { 
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: { virtuals: true }
  }
);

DoctorSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'doctor',
    localField: '_id',
  });

  DoctorSchema.pre(/^find/, function (next) {
    this.populate({ path: "clinic"})
    next();
});

DoctorSchema.pre(/^find/, function (next) {
    this.populate({ path: "center"})
    next();
});

const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}uploads/doctors/${doc.image}`;
        doc.image = imageUrl
    }
};

DoctorSchema.post('init', (doc) => {
    setImageURL(doc)
});

DoctorSchema.post('save', (doc) => {
    setImageURL(doc)
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