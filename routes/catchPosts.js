const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home') 
const catchPostsController = require('../controllers/catchPosts') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// router.get('/', ensureAuth, catchPostsController.getCatchPosts)
router.get('/', ensureAuth, homeController.getIndex)
// Should this be here?
// router.get('/catchPosts', catchPostsController.getCatchPostsById)
router.post('/createCatchPost', catchPostsController.createCatchPost)
router.post('/initCatchegory', catchPostsController.initCatchegory)
router.put('/likeCatchPost', catchPostsController.likeCatchPost)
router.put('/comment/:id', catchPostsController.addComment)
router.put('/createCatchegory', catchPostsController.createCatchegory)
router.put('/omitCatchegory', catchPostsController.omitCatchegory)
router.delete('/deleteCatchPost', catchPostsController.deleteCatchPost)

module.exports = router