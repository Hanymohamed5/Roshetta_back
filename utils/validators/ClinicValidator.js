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
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  
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
    .withMessage('clinic price is required')
    .isNumeric()
    .withMessage('clinic price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  validatorMiddleware,

];

exports.updateClinicValidator = [
  check('id').isMongoId().withMessage('Invalid clinic id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteClinicValidator = [
  check('id').isMongoId().withMessage('Invalid clinic id format'),
  validatorMiddleware,
];