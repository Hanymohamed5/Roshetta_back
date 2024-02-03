const express = require('express')
const { updateUser, getUsers, getUser, deleteUser, uploadUserImage, resizeImage } = require("../controllers/userController")
const { updateUserValidator } = require("../utils/validators/userValidator")

const router = express.Router();

router
.route('/').get(getUsers)
router.route('/:id').put(uploadUserImage, resizeImage,updateUserValidator, updateUser).get(getUser).delete(deleteUser)

module.exports = router;