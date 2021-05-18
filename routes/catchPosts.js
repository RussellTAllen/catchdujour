const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home') 
const catchPostsController = require('../controllers/catchPosts') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// router.get('/', ensureAuth, catchPostsController.getCatchPosts)
router.get('/', ensureAuth, homeController.getIndex)
// Should this be here?
// router.get('/catchPosts', catchPostsController.getCatchPostsById)
router.post('/createCatchPost', ensureAuth, catchPostsController.createCatchPost)
router.post('/initCatchegory', catchPostsController.initCatchegory)
router.put('/likeCatchPost', ensureAuth, catchPostsController.likeCatchPost)
router.put('/:id/comment', ensureAuth, catchPostsController.addComment)
router.put('/createCatchegory', ensureAuth, catchPostsController.createCatchegory)
router.put('/omitCatchegory', ensureAuth, catchPostsController.omitCatchegory)
router.delete('/deleteCatchPost', ensureAuth, catchPostsController.deleteCatchPost)

module.exports = router