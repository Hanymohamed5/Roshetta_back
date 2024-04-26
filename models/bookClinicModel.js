const mongoose = require('mongoose');

const bookingClinicSchema = new mongoose.Schema({
  clinic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Clinic',
    required: [true, 'Booking must belong to a Clinic!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
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

bookingClinicSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'clinic',
    select: 'name'
  });
  next();
});

const BookingClinic = mongoose.model('BookingClinic', bookingClinicSchema);

module.exports = BookingClinic;