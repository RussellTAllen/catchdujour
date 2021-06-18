const mongoose = require('mongoose')
const User = require('./User')
// const Comment = require('./Comment')

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    require: true
  },
  user: {
    type: User.UserSchema,
    sparse: true,
    unique: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [new mongoose.Schema(
    { 
      userId: String,
      userName: String
     },
    { _id: false },
  )] 
})

const CatchPostSchema = new mongoose.Schema({
  catchTitle: {
    type: String,
    required: true,
  },
  catchContent: {
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
    type: { user: User.UserSchema },
    required: true,
    unique: false,
    sparse: true
  },
  likes: { 
    type: Number, 
    default: 0
  },
  likedBy: {
    type: [User.UserSchema,
    { unique: false,
    sparse: true}],
    default: [],
    sparse: true,
    unique: false,
  },
  comments: {
    type: [CommentSchema],
    sparse: true,
    unique: false
  },
  commentsLength:{
    type: Number,
    default: 0
  },
  catchegories: {
    type: Array,
    default: []
  },
  catchLink: {
    type: String,
    default: 'none'
  }
})

module.exports = mongoose.model('CatchPost', CatchPostSchema)