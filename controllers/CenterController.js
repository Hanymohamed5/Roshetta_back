const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const Center = require('../models/centerModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `center-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/centers/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});


// @desc    Get list of centers
// @route   GET /api/v1/centers
// @access  Public
exports.getCenters = factory.getAll(Center);

// @desc    Get specific center by id
// @route   GET /api/v1/centers/:id
// @access  Public
exports.getCenter = factory.getOne(Center);

// @desc    Create center
// @route   POST  /api/v1/centers
// @access  Private
exports.createCenter = factory.createOne(Center);

// @desc    Update specific center
// @route   PUT /api/v1/centers/:id
// @access  Private
exports.updateCenter = factory.updateOne(Center);

// @desc    Delete specific center
// @route   DELETE /api/v1/centers/:id
// @access  Private
exports.deleteCenter = factory.deleteOne(Center);