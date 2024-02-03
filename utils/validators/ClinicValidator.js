const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getClinicValidator = [
  check('id').isMongoId().withMessage('Invalid Clinicc id format'),
  validatorMiddleware,
];

exports.createClinicValidator = [
  check('name')
    .notEmpty()
    .withMessage('Clinic required')
    .isLength({ min: 2 })
    .withMessage('Too short Clinic name')
    .isLength({ max: 32 })
    .withMessage('Too long Clinic name')
    ,
  
    check('specilization')
    .notEmpty()
    .withMessage('specilization required')
    .isNumeric()
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

  check(' rateAvg')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),

    check('price')
    .notEmpty()
    .withMessage('clinic price is required')
    .isNumeric()
    .withMessage('clinic price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  validatorMiddleware,

];

exports.updateClinicValidator = [
  check('id').isMongoId().withMessage('Invalid clinic id format'),
  validatorMiddleware,
];

exports.deleteClinicValidator = [
  check('id').isMongoId().withMessage('Invalid clinic id format'),
  validatorMiddleware,
];