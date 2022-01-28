const mongoose = require('mongoose')

const todoScehma = new mongoose.Schema({
    todolist: { type: String, required:true},
 
}, { timestamps: true })

module.exports = mongoose.model("todo", todoScehma)