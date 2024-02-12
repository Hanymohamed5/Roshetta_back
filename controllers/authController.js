const { encode } = require('punycode');
const User = require('../models/userModel');
const factory = require('./handlersFactory');
const jwt = require('jsonwebtoken');
const createToken = require('../utils/createToken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const passport = require('../middlewares/passport');

exports.authGoogle = asyncHandler(async (req, res, next) => {
  const user = req.user;

  try {
    // Check if the user exists in the database
    let existingUser = await User.findOne({ googleId: user.googleId });

    if (!existingUser) {
      // If the user doesn't exist, save it in the database
      existingUser = await User.create({
        googleId: user.googleId,
        // Add other properties from req.user if needed
      });
    }

    // Remove the googleId, __v, and _id from the user object
    const { googleId, __v, _id, ...userWithoutSensitiveData } = existingUser.toObject();

    // Check if MedicalHistory exists before attempting to delete its properties
    if (userWithoutSensitiveData.MedicalHistory) {
      // Remove id and _id from MedicalHistory
      delete userWithoutSensitiveData.MedicalHistory.id;
      delete userWithoutSensitiveData.MedicalHistory._id;
    }

    // Get or create a new token for the user
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: userWithoutSensitiveData, // Send the user object without sensitive data
      },
    });
  } catch (error) {
    // Handle any other errors
    return res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

exports.authfacebook = asyncHandler(async (req, res, next) => {
  const user = req.user;

  try {
    // Check if the user exists in the database
    let existingUser = await User.findOne({ facebookId: user.facebookId });

    if (!existingUser) {
      // If the user doesn't exist, save it in the database
      existingUser = await User.create({
        facebookId: user.facebookId,
        // Add other properties from req.user if needed
      });
    }

    // Remove the facebookId, __v, and _id from the user object
    const { facebookId, __v, _id, ...userWithoutSensitiveData } = existingUser.toObject();

    // Check if MedicalHistory exists before attempting to delete its properties
    if (userWithoutSensitiveData.MedicalHistory) {
      // Remove id and _id from MedicalHistory
      delete userWithoutSensitiveData.MedicalHistory.id;
      delete userWithoutSensitiveData.MedicalHistory._id;
    }

    // Get or create a new token for the user
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: userWithoutSensitiveData, // Send the user object without sensitive data
      },
    });
  } catch (error) {
    // Handle any other errors
    return res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});


exports.authapple = asyncHandler(async(req,res, next) => {
  const user = req.user;

  // Get or create a new token for the user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  })
}) 

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      res.status(401).json({
        message: 'You are not login, Please login to get access this route'
      })
    }
  
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    res.status(401).json({
      message: 'The user that belong to this token does no longer exist'
    });
  }
    next();
  });