
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
      min: [1, 'Min rating value is 1.0'],
      max: [5, 'Max rating value is 5.0'],
      required: [true, 'Review ratings required'],
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

// average for doctors
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  doctorId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { doctor: doctorId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'doctor',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Doctor.findByIdAndUpdate(doctorId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.doctor);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.doctor);
});

// average for clinics
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  clinicId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { clinic: clinicId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'doctor',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Clinic.findByIdAndUpdate(clinicId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Clinic.findByIdAndUpdate(clinicId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.clinic);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.clinic);
});

// average for centers
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  centerId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { center: centerId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'doctor',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Center.findByIdAndUpdate(centerId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Center.findByIdAndUpdate(centerId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.center);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.center);
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;