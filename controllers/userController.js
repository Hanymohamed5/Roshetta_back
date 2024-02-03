const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Users = require("../models/userModel");

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
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = factory.updateOne(Users);

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