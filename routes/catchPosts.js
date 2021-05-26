const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home') 
const catchPostsController = require('../controllers/catchPosts') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// router.get('/', ensureAuth, catchPostsController.getCatchPosts)
// Removed this, testing routing 5/19
// router.get('/', ensureAuth, homeController.getIndex)
// Should this be here?
// router.get('/catchPosts', catchPostsController.getCatchPostsById)

// router.get('/catchPosts/:id/catchPost', catchPostsController.getCatchPostById)
// router.get('/catchPosts', catchPostsController.getCatchPostsByUserId)
// router.get('/catchPosts/:id', catchPostsController.getCatchPostsByPostId)

router.get('/getCatchPostToEdit', catchPostsController.getCatchPostToEdit)

router.post('/createCatchPost', ensureAuth, catchPostsController.createCatchPost)
router.post('/initCatchegory', catchPostsController.initCatchegory)

router.put('/likeCatchPost', ensureAuth, catchPostsController.likeCatchPost)
router.put('/:id/comment', ensureAuth, catchPostsController.addComment)
router.put('/createCatchegory', ensureAuth, catchPostsController.createCatchegory)
router.put('/omitCatchegory', ensureAuth, catchPostsController.omitCatchegory)

router.delete('/deleteCatchPost', ensureAuth, catchPostsController.deleteCatchPost)
router.delete('/deleteComment', ensureAuth, catchPostsController.deleteComment)

module.exports = router