const mongoose = require('mongoose')

const userScehma = new mongoose.Schema({
    username: { type: String, required: true, unique: true, min: 3, max: 12 },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, unique: true, min: 3, max: 14 },
}, { timestamps: true })

module.exports = mongoose.model("user", userScehma)