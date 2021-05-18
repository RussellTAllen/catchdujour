const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const catchPostsController = require('../controllers/catchPosts')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/mostLiked', homeController.getIndexByMostLiked)
router.get('/mostCommented', homeController.getIndexByMostCommented)
router.get('/login', authController.getLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.get('/catchPost/:id', catchPostsController.getCatchPostById)
router.get('/catchPosts', catchPostsController.getCatchPostsByUserId)


// router.get('/:id', homeController.getCatchPostById)

router.post('/login', authController.postLogin)
router.post('/signup', authController.postSignup)

module.exports = router