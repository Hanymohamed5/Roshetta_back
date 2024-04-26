const express = require('express')
const { updateUser, getUsers, getUser, deleteUser, uploadUserImage, resizeImage } = require("../controllers/userController")
const { updateUserValidator } = require("../utils/validators/userValidator")
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router
.route('/').get(getUsers)
router.route('/:id').get(getUser).delete(deleteUser);
// Instead of router.route('/:id').put(...), you might consider:
router.route('/update').put(uploadUserImage, resizeImage,updateUser)

router.get('/:userId/bookings', // Assuming you want to protect this route
    bookingController.getUserBookings
);


module.exports = router;