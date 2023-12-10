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
    .withMessage('Too long Center name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  
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
    .withMessage('center price is required')
    .isNumeric()
    .withMessage('center price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  validatorMiddleware,

];

exports.updateCenterValidator = [
  check('id').isMongoId().withMessage('Invalid center id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCenterValidator = [
  check('id').isMongoId().withMessage('Invalid center id format'),
  validatorMiddleware,
];