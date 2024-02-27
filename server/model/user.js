const mongoose = require('mongoose')

const user_schema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    age: { type: Number },
    primaryContact: {
        contact: { type: Number },
        otp: { type: Number },
        isVerified: { type: Boolean, default: false }
    },
    alternateContact: {
        contact: { type: Number },
        otp: { type: Number },
        isVerified: { type: Boolean, default: false }
    },
    password: { type: String }
})

user_model = mongoose.model('user', user_schema)
module.exports = user_model