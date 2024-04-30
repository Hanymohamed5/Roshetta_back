const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    //required: [true, 'Booking must belong to a Doctor!']
  },
  clinic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Clinic',
    //required: [true, 'Booking must belong to a Doctor!']
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

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'doctor',
    select: 'name'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;