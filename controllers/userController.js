const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Users = require("../models/userModel");
const jwt = require('jsonwebtoken');

// Upload single image
exports.uploadUserImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});


// @desc    Update specific user
// @route   PUT /api/v1/users/update
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Get user information from the token
  const token = req.headers.authorization.split(' ')[1]; // Assuming the token is included in the Authorization header
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if the user ID from the token matches the user ID in the request body
  if (decoded.id !== req.params.id) {
    res.status(401).json({
      message: 'Unauthorized to update this user'
    });
  }

  // Update the user based on the decoded user ID
  const updatedUser = await Users.findByIdAndUpdate(decoded.id, req.body, {
    new: true,
    runValidators: true,
  }
  ).select('-googleId');

  if (!updatedUser) {
    return next(new ApiError('User not found', 404));
  }

  // Get a new token for the updated user
  const newToken = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    data: {
      token: newToken,
      user: updatedUser,
    },
  });
});




// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Public

exports.getUsers = factory.getAll(Users)

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = factory.getOne(Users);

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(Users);