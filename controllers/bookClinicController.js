const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Clinic = require('./../models/clinicModel');
const User = require('../models/userModel');
const BookingClinic = require('../models/bookClinicModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlersFactory');
const AppError = require('./../utils//apiError');
const expressAsyncHandler = require('express-async-handler');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get the currently booked doctor
    const clinic = await Clinic.findById(req.params.clinicId);

    // 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/clinic/${clinic.name}`,
        client_reference_id: req.params.clinicId,
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `${clinic.name} Clinic`,
                        description: `${clinic.bio}`,
                    },
                    unit_amount: clinic.price * 100, // Convert price to smallest currency unit
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

const createBookingClinicCheckout = async session => {
    try {
        const clinicId = session.client_reference_id;
        const clinic = await Clinic.findById(clinicId);
        const user = await User.findOne({ email: session.customer_email });
        
        // Check if user exists
        if (!user) {
            throw new Error('User not found');
        }

        const price = session.amount_total / 100; // 'amount_total' contains the total amount in the smallest currency unit
        await BookingClinic.create({ clinic: clinicId, user: user.id, price });
        console.log('BookingClinic created:', { clinic: clinicId, user: user.id, price });
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new AppError('Error creating booking', 500);
    }
};


exports.webhookCheckout = catchAsync (async(req, res, next) => {
    const signature = req.headers['stripe-signature'];
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_Clinic
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
  
    if (event.type === 'checkout.session.completed'){
        createBookingClinicCheckout(event.data.object);

  res.status(200).json({ received: true });
    }
  });


exports.getUserBookings = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;

    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const bookingsClinic = await BookingClinic.find({ user: userId })
        .skip(skip)
        .limit(limit);

    const totalBookings = await BookingClinic.countDocuments({ user: userId });

    if (!bookings || bookings.length === 0) {
        return next(new AppError('No bookings found for this user', 404));
    }

    res.status(200).json({
        status: 'success',
        results: bookingsClinic.length,
        totalBookings,
        data: {
            bookingsClinic
        }
    });
});


exports.createBooking = factory.createOne(BookingClinic);
exports.getBooking = factory.getOne(BookingClinic);
exports.getAllBookings = factory.getAll(BookingClinic);
exports.updateBooking = factory.updateOne(BookingClinic);
exports.deleteBooking = factory.deleteOne(BookingClinic);