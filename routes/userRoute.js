const express = require('express')
const { updateUser } = require("../controllers/userController")
const { updateUserValidator } = require("../utils/validators/userValidator")

const router = express.Router();
router
    .route('/:id').put(updateUserValidator, updateUser)

module.exports = router;