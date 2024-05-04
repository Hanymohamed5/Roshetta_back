const express = require('express');
const authController = require('../controllers/authController');

const {
  getCenter,
  createCenter,
  getCenters,
  updateCenter,
  deleteCenter,
  //uploadLogoImage,
  //resizeImage,
  uploadCenterImages,
  resizeCenterImages
} = require('../controllers/CenterController');
const {
  createCenterValidator,
  getCenterValidator,
  updateCenterValidator,
  deleteCenterValidator,
} = require('../utils/validators/CenterValidator');

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    //uploadLogoImage,
    //resizeImage,
    uploadCenterImages,
    resizeCenterImages,
    createCenterValidator,
    createCenter
  )
  .get(authController.protect,getCenters)
router
  .route('/:id')
  .get(authController.protect,getCenterValidator, getCenter)
  .put(
    authController.protect,
    //uploadCategoryImage,
    //resizeImage,
    updateCenterValidator,
    updateCenter
  )
  .delete(
    authController.protect,
    deleteCenterValidator,
    deleteCenter
  );

module.exports = router;