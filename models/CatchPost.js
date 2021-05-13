const mongoose = require('mongoose')
const User = require('./User')

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  user: User.UserSchema
})

const CatchPostSchema = new mongoose.Schema({
  catchTitle: {
    type: String,
    required: true,
  },
  catchPost: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  postedBy: {
    type: User.UserSchema,
    required: true,
    unique: false,
    sparse: true
  },
  likes: {
    type: Number,
    default: 0,
    required: true
  },
  likedBy: {
    type: [User.UserSchema],
    default: [],
    unique: false,
    sparse: true
  },
  comments: {
    type: [CommentSchema],
    required: true
  },
  catchegories: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('CatchPost', CatchPostSchema)
