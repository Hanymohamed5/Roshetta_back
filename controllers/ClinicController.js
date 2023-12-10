const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const Clinic = require('../models/clinicModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `clinic-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/clinics/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});


// @desc    Get list of clinics
// @route   GET /api/v1/clinics
// @access  Public
exports.getClinics = factory.getAll(Clinic);

// @desc    Get specific doctor by id
// @route   GET /api/v1/clinics/:id
// @access  Public
exports.getClinic = factory.getOne(Clinic);

// @desc    Create clinic
// @route   POST  /api/v1/clinics
// @access  Private
exports.createClinic = factory.createOne(Clinic);

// @desc    Update specific clinic
// @route   PUT /api/v1/clinics/:id
// @access  Private
exports.updateClinic = factory.updateOne(Clinic);

// @desc    Delete specific clinic
// @route   DELETE /api/v1/clinics/:id
// @access  Private
exports.deleteClinic = factory.deleteOne(Clinic);