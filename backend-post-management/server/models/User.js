const mongoose = require('mongoose')
let UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String     
    }
)
module.exports = mongoose.model('User', UserSchema)