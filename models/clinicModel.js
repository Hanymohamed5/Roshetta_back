const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

//const autoIncrement = require('mongoose-sequence')(mongoose);

const ClinicSchema = new mongoose.Schema(
  {
    //_id: Number,
    logo: {
      type: String,
      //required: [true, 'Product Image cover is required'],
    },
    name: {
      type: String,
      trim: true,
      unique: [true, 'Clinic must be unique'],
      minlength: [2, 'To short Clinic name'],
      maxlength: [32, 'To long Clinic name'],
    },
    rateAvg : {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
  },
  clinicPhotos: [String],
    specilization: {
      type: Number,
      trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    trim: true,
    max: [200000, 'Too long product price'],
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

    ClinicSchema.virtual("doctors", {
      ref: "Doctor",
      foreignField: "clinic",
      localField: "_id"
    }
    );
    ClinicSchema.virtual('reviews', {
      ref: 'Review',
      foreignField: 'clinic',
      localField: '_id',
    });
//ClinicSchema.plugin(autoIncrement);
//ClinicSchema.plugin(autoIncrement, { id: '_id', inc_field: 'clinic_counter' });
/*ClinicSchema.pre("save", function (next) {
  let doc = this;
  sequencing.getSequenceNextValue("Clinic_id").
  then(counter => {
      //console.log("asdasd", counter);
      if(!counter) {
         sequencing.insertCounter("Clinic_id")
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

module.exports = mongoose.model('Clinic', ClinicSchema);