const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const Clinic = require('../models/clinicModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');

exports.uploadClinicImages = uploadMixOfImages([
  {
    name: 'logo',
    maxCount: 1,
  },
  {
    name: 'clinicPhotos',
    maxCount: 10,
  },
]);

exports.resizeClinicImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.logo) {
    const imageCoverFileName = `clinic-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.logo[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/clinics/${imageCoverFileName}`);

    // Save image into our db
    req.body.logo = imageCoverFileName;
  }
    //2- Image processing for images
    if (req.files.clinicPhotos) {
      req.body.clinicPhotos = [];
      await Promise.all(
        req.files.clinicPhotos.map(async (img, index) => {
          const imageName = `clinic-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/clinicProfile/${imageName}`);
  
          // Save image into our db
          req.body.clinicPhotos.push(imageName);
        })
      );
  
      next();
    }
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

