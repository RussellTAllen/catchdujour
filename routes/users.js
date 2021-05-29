const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.put('/followUser', ensureAuth, usersController.followUser)
router.put('/unfollowUser', ensureAuth, usersController.unfollowUser)
router.put('/omitCatchegory', ensureAuth, usersController.omitCatchegory)

module.exports = router