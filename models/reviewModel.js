
const mongoose = require('mongoose');
const Doctor = require('./DoctorModel');
const Clinic = require('./clinicModel');
const Center = require('./centerModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      //required: [true, 'Review must belong to a doctor.']
    },
    clinic: {
      type: mongoose.Schema.ObjectId,
      ref: 'Clinic',
      //required: [true, 'Review must belong to a clinic.']
    },
    center: {
      type: mongoose.Schema.ObjectId,
      ref: 'Center',
      //required: [true, 'Review must belong to a center.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
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

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name image'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;