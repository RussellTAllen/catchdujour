const bcrypt = require('bcrypt')
const mongoose = require('mongoose')



const UserSchema = new mongoose.Schema({
  userName: { type: String },
  email: { type: String },
  password: String,
  admin: {
    type: Boolean,
    default: false
  },
  moderator: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: String
  },
  catchCount: {
    type: Number,
    default: 0
  },
  following: [new mongoose.Schema(
    { 
      userId: String,
      userName: String
     },
    { _id: false },
  )],
  followedBy: [new mongoose.Schema(
    { 
      userId: String,
      userName: String
     },
    { _id: false },
  )],
  omittedCatchegories: {
    type: Array,
    default: ['nsfw']
  },
  tags: {
    type: Array,
    default: ['founder']
  },
  preferredSort: {
    type: String,
    default: 'new'
  },
})

// Password hash middleware. 
UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})


// Helper method for validating user's password.
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}


const myModule = module.exports = mongoose.model('User', UserSchema)
myModule.UserSchema = UserSchema
