const express = require('express')

const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

exports.getLogin = async (req, res) => {
  await req.user
  if (req.user) {
    
    return res.redirect('/welcome')
  }
  // res.render('login', {
  //   title: 'Login'
  // })
  console.log('line 15 of auth.js')
  res.render('login', {
    title: 'Login'
  })
}
  
exports.postLogin = (req, res, next) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })

  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('/login')
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      req.flash('errors', info)
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      req.flash('success', { msg: 'Success! You are logged in.' })
      console.log('line 36 is running')
      // res.redirect(req.session.returnTo || '/')
      res.redirect(req.session.returnTo || '/welcome')
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err)
    req.user = null
    res.redirect('/')
  })
}

exports.getSignup = (req, res) => {
  if (req.user) {
    console.log('redirecting to /')
    // return res.redirect('/catchPosts')
    return res.redirect('/welcome')
  }
  res.render('signup', {
    title: 'Create Account'
  })
}

exports.postSignup = (req, res, next) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  if (req.body.userName.includes(' ')) validationErrors.push({ msg: 'Usernames cannot include any white-space'})
  if (validationErrors.length) {
    req.flash('errors', validationErrors)
    return res.redirect('../signup')
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    startDate: new Date(),
    following: [
      { 
        userId: '60c321ada7991f2ae0266a8f',
        userName: 'RussellCatch'
       }]
  })
 
  User.findOne({$or: [
    {email: req.body.email},
    {userName: req.body.userName}
  ]}, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address or username already exists.' })
      return res.redirect('../signup')
    }
    user.save((err) => {
      if (err) { return next(err) }
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }

        User.findByIdAndUpdate('60c321ada7991f2ae0266a8f', {
          $addToSet: { 
              followedBy: { 
                  userId: user._id,
                  userName: user.userName                    
              }
          }
        })
        res.redirect('/welcome')
      })
    })
  })
}