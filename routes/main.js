const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const catchPostsController = require('../controllers/catchPosts')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const path = require('path')
const fs = require('fs')

router.get('/welcome', homeController.getWelcome)
router.get('/', homeController.getIndex)
router.get('/mostLiked', homeController.getIndexByMostLiked)
router.get('/mostCommented', homeController.getIndexByMostCommented)
router.get('/login', ensureGuest, authController.getLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.get('/catchPosts/:id/catchPost', catchPostsController.getCatchPostById)
router.get('/createCatchPage', ensureAuth, catchPostsController.getCreateCatchPage)
router.get('/catchPosts/:userName', catchPostsController.getCatchPostsByUserId)
// router.get('/.well-known/pki-validation/470DFCB181B2A7D3780BCEAA6E911361.txt', async (req, res) =>{
//     res.sendFile('./470DFCB181B2A7D3780BCEAA6E911361.txt', { __dirname, __filename })
// })

router.get('/.well-known/pki-validation/470DFCB181B2A7D3780BCEAA6E911361.txt', homeController.getSslCert)
router.get('/apple-touch-icon.png', homeController.getAppleIcon)
router.get('/favicon-32x32.png', homeController.getFavicon32)
router.get('/favicon-16x16.png', homeController.getFavicon16)
router.get('/site.webmanifest', homeController.getWebManifest)
// router.get('/manifest.json', homeController.getWebManifest)



router.post('/login', authController.postLogin)
router.post('/signup', authController.postSignup)

module.exports = router


// router.get("/.well-known/pki-validation/6BFB7F1676F92A093F1BF1E6E425082F.txt",async function(req,res){
//     res.sendFile(path.join('/.well-known/pki-validation/', './6BFB7F1676F92A093F1BF1E6E425082F.txt'), { root: __dirname })
// })