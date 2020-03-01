const mongoose = require('mongoose')
let TagSchema = new mongoose.Schema(
    {
        title: { type: String, unique: true }
    }
)
module.exports = mongoose.model('Tag', TagSchema)