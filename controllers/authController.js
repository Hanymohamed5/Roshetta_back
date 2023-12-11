const { encode } = require('punycode');
const User = require('../models/userModel');
const factory = require('./handlersFactory');
const jwt = require('jsonwebtoken');
const createToken = require('../utils/createToken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const authGoogle = async (req, res, next) => {
    const token = createToken(User._id);
    return res.status(200).json({ success: true, token }) 
}

const authfacebook = async (req, res, next) => {
    return res.status(200).json({ success: true})
}

const authapple = async (req, res, next) => {
    const token = createToken(User._id);
    return res.status(200).json({ success: true, token })
}

// @desc   make sure the user is logged in
const protect = asyncHandler(async (req, res, next) => {
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
    const decoded = jwt.verify(token, "secrethany");
  
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user that belong to this token does no longer exist',
          401
        )
      );
    }
    req.user = currentUser;
    next();
  });

module.exports = { authGoogle, authfacebook, authapple, protect }