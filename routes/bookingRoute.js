const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:doctorId',
    authController.protect,
    bookingController.getCheckoutSession
);
router.get('/checkoutClinic-session/:clinicId',
    authController.protect,
    bookingController.getCheckoutClinicSession
);
router.get('/checkoutCenter-session/:centerId',
    authController.protect,
    bookingController.getCheckoutCenterSession
);

router
  .route('/')
  .get(authController.protect,bookingController.getAllBookings)
  .post(authController.protect,bookingController.createBooking);

router
.route('/:id')
.get(authController.protect,bookingController.getBooking)
.patch(authController.protect,bookingController.updateBooking)
.delete(authController.protect,bookingController.deleteBooking);



module.exports = router;