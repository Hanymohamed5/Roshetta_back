const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');


const router = express.Router();

router.route('/google').post(passport.authenticate('google-plus-token'), authController.authGoogle);

router.route('/facebook').post(passport.authenticate('facebook-token'),authController.authfacebook);

//router.route('/apple').post(passport.authenticate('apple-token'), authController.authapple);


module.exports = router;