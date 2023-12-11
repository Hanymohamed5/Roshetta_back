const { encode } = require('punycode');
const User = require('../models/userModel');
const factory = require('./handlersFactory');
const jwt = require('jsonwebtoken');
const createToken = require('../utils/createToken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.authGoogle = asyncHandler(async(req, res, next) => {
  return res.status(200).json({ success: true})
})

exports.authfacebook = asyncHandler(async(req, res, next) => {
  return res.status(200).json({ success: true})
})

const authapple = async (req, res, next) => {
    const token = createToken(User._id);
    return res.status(200).json({ success: true, token })
}

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
      return next(
        new ApiError(
          'You are not login, Please login to get access this route',
          401
        )
      );
    }
  
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  });