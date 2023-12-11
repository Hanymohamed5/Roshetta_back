const express = require('express')
const { updateUser, getUsers } = require("../controllers/userController")
const { updateUserValidator } = require("../utils/validators/userValidator")

const router = express.Router();

router
.route('/').get(getUsers)
router.route('/:id').put(updateUserValidator, updateUser)

module.exports = router;