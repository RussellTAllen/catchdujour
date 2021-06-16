const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const catchPostRoutes = require('./routes/catchPosts')
const userRoutes = require('./routes/users')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

// SSL cert
// app.get('/.well-known/pki-validation/470DFCB181B2A7D3780BCEAA6E911361_HTTP_FILE_UPLOAD_VERIFY_METHOD.txt', function (req, res, next) {
//   res.send('470DFCB181B2A7D3780BCEAA6E911361_HTTP_FILE_UPLOAD_VERIFY_METHOD content');
// });

// Setting up express and libraries
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
app.use(methodOverride('_method'))

// Sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/catchPosts', catchPostRoutes)
app.use('/users', userRoutes)


app.listen(process.env.PORT, ()=>{
    console.log('Server is running on port '+process.env.PORT)
})