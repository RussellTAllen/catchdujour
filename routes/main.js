const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const catchPostsController = require('../controllers/catchPosts')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.get('/:id', homeController.getCatchPost)
router.get('/catchPosts', catchPostsController.getCatchPostsByUser)
router.get('/catchPosts/:id', catchPostsController.getCatchPost)
router.put('/likeCatchPost/:id', catchPostsController.likeCatchPost)
router.post('/signup', authController.postSignup)

module.exports = router