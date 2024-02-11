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

  // Update the user based on the decoded user ID
  const userId = decoded.id;

  // Construct the update query
  const updateQuery = { _id: userId };

  // Update the user without using findByIdAndUpdate
  const updatedUser = await Users.updateOne(updateQuery, { $set: req.body }, {
    runValidators: true,
  });

  if (updatedUser.nModified === 0) {
    // No user was modified, meaning the user wasn't found
    return next(new ApiError('User not found', 404));
  }
  // Fetch the updated user
  const updatedUserData = await Users.findOne(updateQuery).select('-googleId');
  // Get a new token for the updated user
  const newToken = jwt.sign({ id: updatedUserData._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    data: {
      token: newToken,
      user: updatedUserData,
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