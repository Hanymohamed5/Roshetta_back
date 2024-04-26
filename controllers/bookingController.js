const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Doctor = require('./../models/DoctorModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlersFactory');
const AppError = require('./../utils//apiError');
const expressAsyncHandler = require('express-async-handler');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get the currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);

    // 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/doctor/${doctor.name}`,
        client_reference_id: req.params.doctorId,
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `${doctor.name} Doctor`,
                        description: `${doctor.bio}`,
                    },
                    unit_amount: doctor.price * 100, // Convert price to smallest currency unit
                },
                quantity: 1
            }
        ],
        mode: 'payment' // Specify the mode as 'payment'
    });

    // 3. Return session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

exports.webhookCheckout = catchAsync (async(req, res, next) => {
    const signature = req.headers['stripe-signature'];
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
  
    if (event.type === 'checkout.session.completed'){
        console.log('Create Book Here....');
    }
  });


exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

