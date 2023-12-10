const express = require('express');

const slideController = require('../controllers/slideController')

  const router = express.Router();

  router.route('/')
  .get(slideController.getBrands)
  .post(
    slideController.uploadBrandImage,
    slideController.resizeImage,
    slideController.createBrand
  )

  router
  .route('/:id')
  .delete(slideController.deleteBrand);

module.exports = router;