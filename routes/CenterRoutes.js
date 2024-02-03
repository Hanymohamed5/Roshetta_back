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
  .get(getCenterValidator, getCenter)
  .put(
    //uploadCategoryImage,
    //resizeImage,
    updateCenterValidator,
    updateCenter
  )
  .delete(
    deleteCenterValidator,
    deleteCenter
  );

module.exports = router;