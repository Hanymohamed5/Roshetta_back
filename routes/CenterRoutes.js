const express = require('express');

const {
  getCenter,
  createCenter,
  getCenters,
  updateCenter,
  deleteCenter,
  uploadCategoryImage,
  resizeImage
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
    uploadCategoryImage,
    resizeImage,
    createCenterValidator,
    createCenter
  )
  .get(getCenters)
router
  .route('/:id')
  .get(getCenterValidator, getCenter)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCenterValidator,
    updateCenter
  )
  .delete(
    deleteCenterValidator,
    deleteCenter
  );

module.exports = router;