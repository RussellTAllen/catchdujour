const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const catchPostsController = require('../controllers/catchPosts')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/welcome', homeController.getWelcome)
router.get('/', homeController.getIndex)
router.get('/mostLiked', homeController.getIndexByMostLiked)
router.get('/mostCommented', homeController.getIndexByMostCommented)
router.get('/login', ensureGuest, authController.getLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.get('/catchPosts/:id/catchPost', catchPostsController.getCatchPostById)
router.get('/catchProfile', catchPostsController.getProfile)
router.get('/createCatchPage', ensureAuth, catchPostsController.getCreateCatchPage)
router.get('/catchPosts/:userName', catchPostsController.getCatchPostsByUserId)

router.post('/login', authController.postLogin)
router.post('/signup', authController.postSignup)

module.exports = router