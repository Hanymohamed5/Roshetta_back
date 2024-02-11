const express = require('express')
const { updateUser, getUsers, getUser, deleteUser, uploadUserImage, resizeImage } = require("../controllers/userController")
const { updateUserValidator } = require("../utils/validators/userValidator")

const router = express.Router();

router
.route('/').get(getUsers)
router.route('/:id').get(getUser).delete(deleteUser);
// Instead of router.route('/:id').put(...), you might consider:
router.route('/update').put(uploadUserImage, resizeImage,updateUser)


module.exports = router;