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
    const token = createToken(User._id);
    return res.status(200).json({ success: true, token })
}

const authapple = async (req, res, next) => {
    const token = createToken(User._id);
    return res.status(200).json({ success: true, token })
}

module.exports = { authGoogle, authfacebook, authapple }