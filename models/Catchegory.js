const mongoose = require('mongoose')

const CatchegorySchema = new mongoose.Schema({
    catchegories: {
        type: Array,
    }
})

module.exports = mongoose.model('Catchegory', CatchegorySchema)
