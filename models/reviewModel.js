
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


// calc rating avrage Doctor
reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const result = await this.aggregate([
    // Stage 1: Get all reviews in specific doctor
    {
      $match: { doctor: doctorId, }
    },
    // Stage 2: Grouping reviews based on doctorId and calc avgratings 
    {
      $group: {
        _id: 'doctor',
        avgRatings: { $avg: "$ratings" },
      }
    },
  ]);
  if (result.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      ratingsAverage: result[0].avgRatings,
    })
  } else {
    await Doctor.findByIdAndUpdate(doctorId, {
      ratingsAverage: 0,
    })
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatings(this.doctor)
});

reviewSchema.post('deleteOne', async function () {
  await this.constructor.calcAverageRatings(this.doctor);
});


//// calc rating avrage clinic
reviewSchema.statics.calcAverageRatings = async function (clinicId) {
  const result = await this.aggregate([
    // Stage 1: Get all reviews in specific clinic
    {
      $match: { clinic: clinicId, }
    },
    // Stage 2: Grouping reviews based on clinicId and calc avgratings 
    {
      $group: {
        _id: 'Clinic',
        avgRatings: { $avg: "$ratings" },
      }
    },
  ]);
  if (result.length > 0) {
    await Clinic.findByIdAndUpdate(clinicId, {
      ratingsAverage: result[0].avgRatings,
    })
  } else {
    await Clinic.findByIdAndUpdate(clinicId, {
      ratingsAverage: 0,
    })
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatings(this.clinic)
});

reviewSchema.post('deleteOne', async function () {
  await this.constructor.calcAverageRatings(this.clinic);
});



//// calc rating avrage center 
reviewSchema.statics.calcAverageRatings = async function (centerId) {
  const result = await this.aggregate([
    // Stage 1: Get all reviews in specific Center
    {
      $match: { center: centerId, }
    },
    // Stage 2: Grouping reviews based on centerId and calc avgratings 
    {
      $group: {
        _id: 'Center',
        avgRatings: { $avg: "$ratings" },
      }
    },
  ]);
  if (result.length > 0) {
    await Center.findByIdAndUpdate(centerId, {
      ratingsAverage: result[0].avgRatings,
    })
  } else {
    await Center.findByIdAndUpdate(centerId, {
      ratingsAverage: 0,
    })
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatings(this.center)
});

reviewSchema.post('deleteOne', async function () {
  await this.constructor.calcAverageRatings(this.center);
});



const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;