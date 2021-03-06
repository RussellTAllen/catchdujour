const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const { ensureAuth } = require('../middleware/auth')

router.put('/followUser', ensureAuth, usersController.followUser)
router.put('/unfollowUser', ensureAuth, usersController.unfollowUser)
router.put('/omitCatchegory', ensureAuth, usersController.omitCatchegory)
router.put('/allowCatchegory', ensureAuth, usersController.allowCatchegory)
router.get('/profile', usersController.getProfile)

module.exports = router