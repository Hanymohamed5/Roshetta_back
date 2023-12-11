const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")

const factory = require('./handlersFactory');
const Users = require("../models/userModel")

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const { MedicalHistory } = req.body;
    const { firstName } = req.body;
    const { lastName } = req.body;


    const user = await Users.findOneAndUpdate(
        { _id: id },
        {
            name,
            MedicalHistory,
            firstName,
            lastName
        },
        { new: true });

    if (!user) {
        return next(new ApiError(`No user for this id ${id}`, 404))
    }
    res.status(200).json({ data: user });
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Public

exports.getUsers = factory.getAll(Users)