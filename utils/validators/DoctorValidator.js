const slugify = require('slugify');
const { check, body } = require('express-validator');
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
    .withMessage('Too long Doctor name')
    ,
  
  check('specilization')
  .notEmpty()
  .withMessage('specilization required')
  .isLength({ min: 2 })
  .withMessage('Too short specilization name')
  .isLength({ max: 32 })
  .withMessage('Too long specilization name'),

  check('location')
  .notEmpty()
  .withMessage('location required')
  .isLength({ min: 2 })
  .withMessage('Too short location')
  .isLength({ max: 32 })
  .withMessage('Too long location'),

  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),

    check('price')
    .notEmpty()
    .withMessage('Doctor price is required')
    .isNumeric()
    .withMessage('Doctor price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  validatorMiddleware,

];

exports.updateDoctorValidator = [
  check('id').isMongoId().withMessage('Invalid Doctor id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteDoctorValidator = [
  check('id').isMongoId().withMessage('Invalid Doctor id format'),
  validatorMiddleware,
];