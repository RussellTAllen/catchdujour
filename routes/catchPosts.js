const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home') 
const catchPostsController = require('../controllers/catchPosts') 
const { ensureAuth } = require('../middleware/auth')

router.post('/createCatchPost', ensureAuth, catchPostsController.createCatchPost)
router.post('/initCatchegory', catchPostsController.initCatchegory)

router.put('/editCatchPost', ensureAuth, catchPostsController.editCatchPost)
router.put('/likeCatchPost', ensureAuth, catchPostsController.likeCatchPost)
router.put('/:id/comment', ensureAuth, catchPostsController.addComment)
router.put('/editComment', ensureAuth, catchPostsController.editComment)
router.put('/likeComment', ensureAuth, catchPostsController.likeComment)
router.put('/createCatchegory', ensureAuth, catchPostsController.createCatchegory)
router.put('/updateCatchegoryCount', ensureAuth, catchPostsController.updateCatchegoryCount)

router.delete('/deleteCatchPost', ensureAuth, catchPostsController.deleteCatchPost)
router.delete('/deleteComment', ensureAuth, catchPostsController.deleteComment)

module.exports = router