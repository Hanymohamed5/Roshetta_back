const express = require('express');
const bookingController = require('./../controllers/bookClinicController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:clinicId',
    authController.protect,
    bookingController.getCheckoutSession
);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
.route('/:id')
.get(bookingController.getBooking)
.patch(bookingController.updateBooking)
.delete(bookingController.deleteBooking);



module.exports = router;