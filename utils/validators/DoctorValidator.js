// const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getDoctorValidator = [
    check('id').isMongoId().withMessage('Invalid Doctor id format'),
    validatorMiddleware,
];

exports.createDoctorValidator = [
    check('name')
        .notEmpty()
        .withMessage('Doctor required')
        .isLength({ min: 2 })
        .withMessage('Too short Doctor name')
        .isLength({ max: 32 })
        .withMessage('Too long Doctor name'),

    check('specilization')
        .notEmpty()
        .withMessage('specilization required')
        .withMessage('specilization must be a number')
        .isLength({ min: 1 })
        .withMessage('Rating must be above or equal 1.0'),

    check('location')
        .notEmpty()
        .withMessage('city required')
        .withMessage('city must be a number')
        .isLength({ min: 1 })
        .withMessage('Too short city')
        .isLength({ max: 32 })
        .withMessage('Too long city'),

    check('price')
        .notEmpty()
        .withMessage('clinic price is required')
        .isNumeric()
        .withMessage('clinic price must be a number')
        .isLength({ max: 32 })
        .withMessage('To long price'),
    validatorMiddleware,

]

exports.updateDoctorValidator = [
    check('id').isMongoId().withMessage('Invalid Doctor id format'),
    validatorMiddleware,
];

exports.deleteDoctorValidator = [
    check('id').isMongoId().withMessage('Invalid Doctor id format'),
    validatorMiddleware,
];