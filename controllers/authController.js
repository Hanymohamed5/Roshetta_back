const { encode } = require('punycode');
const User = require('../models/userModel');
const factory = require('./handlersFactory');
const jwt = require('jsonwebtoken');
const createToken = require('../utils/createToken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const passport = require('../middlewares/passport');

exports.authGoogle = asyncHandler(async(req, res, next) => {
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

exports.authfacebook = asyncHandler(async(req, res, next) => {
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