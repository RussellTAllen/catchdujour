const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home') 
const catchPostsController = require('../controllers/catchPosts') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureAuth, catchPostsController.getCatchPosts)
// router.get('/', ensureAuth, homeController.getIndex)
router.get('/:id', catchPostsController.getCatchPost)
router.post('/createCatchPost', ensureAuth, catchPostsController.createCatchPost)
router.post('/initCatchegory', catchPostsController.initCatchegory)
router.put('/createCatchegory', ensureAuth, catchPostsController.createCatchegory)
router.put('/likeCatchPost/:id', ensureAuth, catchPostsController.likeCatchPost)
router.put('/omitCatchegory', ensureAuth, catchPostsController.omitCatchegory)
router.delete('/deleteCatchPost', ensureAuth, catchPostsController.deleteCatchPost)

module.exports = router