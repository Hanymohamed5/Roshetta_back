const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCenterValidator = [
  check('id').isMongoId().withMessage('Invalid Center id format'),
  validatorMiddleware,
];

exports.createCenterValidator = [
  check('name')
    .notEmpty()
    .withMessage('Center required')
    .isLength({ min: 2 })
    .withMessage('Too short Center name')
    .isLength({ max: 32 })
    .withMessage('Too long Center name'),
  
  
    /*check('specilization')
    .notEmpty()
    .withMessage('specilization required')
    .isNumeric()
    .withMessage('specilization must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0'),*/

  check('location')
        .notEmpty()
        .withMessage('city required')
        .withMessage('city must be a number')
        .isLength({ min: 1 })
        .withMessage('Too short city')
        .isLength({ max: 32 })
        .withMessage('Too long city'),

  check('rateAvg')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),

    check('price')
    .notEmpty()
    .withMessage('center price is required')
    .isNumeric()
    .withMessage('center price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  validatorMiddleware,

];

exports.updateCenterValidator = [
  check('id').isMongoId().withMessage('Invalid center id format'),
  validatorMiddleware,
];

exports.deleteCenterValidator = [
  check('id').isMongoId().withMessage('Invalid center id format'),
  validatorMiddleware,
];