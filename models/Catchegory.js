const mongoose = require('mongoose')

const CatchegorySchema = new mongoose.Schema({
    // catchegories: [
        catchegory: String,
        count: Number, 
    // ]
})

module.exports = mongoose.model('Catchegory', CatchegorySchema)
