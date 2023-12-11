const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //trim: true,
      //unique: [true, 'SubCategory must be unique'],
      minlength: [2, 'To short Doctor name'],
      maxlength: [32, 'To long Doctor name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    specilization: {
      type: String,
      trim: true,
      minlength: [2, 'To short Doctor name'],
      maxlength: [32, 'To long Doctor name'],
    },
    location: {
      type: String,
      trim: true,
      minlength: [2, 'To short Doctor name'],
      maxlength: [32, 'To long Doctor name'],
    },
    image: String,
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
      default: 0,
    },
    review: {
      type: String,
      trim: true,
    },
    AboutDoctor: {
      type: String
    },
    Clinics: {
      
    },
    Centers: {
      
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', DoctorSchema);