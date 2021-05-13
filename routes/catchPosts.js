const express = require('express')
const router = express.Router()
const catchPostsController = require('../controllers/catchPosts') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureAuth, catchPostsController.getCatchPosts)

router.post('/createCatchPost', catchPostsController.createCatchPost)

router.put('/omitCatchegory', catchPostsController.omitCatchegory)

// router.put('/markIncomplete', catchPostsController.markIncomplete)

router.delete('/deleteCatchPost', catchPostsController.deleteCatchPost)

module.exports = router