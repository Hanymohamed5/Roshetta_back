const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const Doctor = require('../models/DoctorModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures.js');

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `
  https://roshetta-wy5u.onrender.com/doctor-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`https://roshetta-wy5u.onrender.com/uploads/doctors/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

// @desc    Get list of doctors
// @route   GET /api/v1/doctors
// @access  Public
exports.getDoctors = factory.getAll(Doctor);

// @desc    Get specific doctor by id
// @route   GET /api/v1/doctors/:id
// @access  Public
exports.getDoctor = factory.getOne(Doctor, "reviews");

// @desc    Create doctor
// @route   POST  /api/v1/doctors
// @access  Private
exports.createDoctor = factory.createOne(Doctor);


// @desc    Update specific doctor
// @route   PUT /api/v1/doctors/:id
// @access  Private
exports.updateDoctor = factory.updateOne(Doctor);


// @desc    Delete specific doctor
// @route   DELETE /api/v1/doctors/:id
// @access  Private
exports.deleteDoctor = factory.deleteOne(Doctor);