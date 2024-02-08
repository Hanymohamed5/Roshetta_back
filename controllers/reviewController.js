const Review = require('./../models/reviewModel');
const factory = require('./handlersFactory');
// const catchAsync = require('./../utils/catchAsync');
const asyncHandler = require('express-async-handler');

exports.setDoctorUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
// @desc    Create a review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
  });
});

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);