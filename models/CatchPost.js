const mongoose = require('mongoose')
const User = require('./User')
// const {ObjectId} = mongoose.Schema.Types

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
  // likes: [{type: ObjectId, ref:"User"}],
  // likedBy: [{type: ObjectId, ref:"User"}],
  // comments: {
  //   type: [CommentSchema],
  //   required: true
  // },
  catchegories: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('CatchPost', CatchPostSchema)