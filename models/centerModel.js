const mongoose = require('mongoose');
const sequencing = require("../config/sequencing");

const autoIncrement = require('mongoose-sequence')(mongoose);

const CenterSchema = new mongoose.Schema(
  {
    _id: Number,
    name: {
      type: String,
      trim: true,
      unique: [true, 'Center must be unique'],
      minlength: [2, 'To short Center name'],
      maxlength: [32, 'To long Center name'],
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
    //image: String,
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [200000, 'Too long product price'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      //default: 0,
    },
    review: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      //required: [true, 'Product Image cover is required'],
    },
    images: [String],
    doctors: {
      
    }
  },
);

CenterSchema.pre("save", function (next) {
  let doc = this;
  sequencing.getSequenceNextValue("Center_id").
  then(counter => {
      //console.log("asdasd", counter);
      if(!counter) {
         sequencing.insertCounter("Center_id")
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

module.exports = mongoose.model('Center', CenterSchema);