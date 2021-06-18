const mongoose = require('mongoose')
const User = require('./User')

const CommentSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true
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
    )],
  })

  module.exports = mongoose.model('Comment', CommentSchema)