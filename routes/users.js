const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.put('/followUser', ensureAuth, usersController.followUser)

module.exports = router