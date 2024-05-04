const express = require('express');

const slideController = require('../controllers/slideController');
const authController = require('../controllers/authController');

  const router = express.Router();

  router.route('/')
  .get(authController.protect,slideController.getBrands)
  .post(
    authController.protect,
    slideController.uploadBrandImage,
    slideController.resizeImage,
    slideController.createBrand
  )

  router
  .route('/:id')
  .delete(authController.protect,slideController.deleteBrand);

module.exports = router;