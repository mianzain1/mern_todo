const { Schema, model } = require('mongoose')

const todoScehma = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    content: { type: String, required: true },
    complete: { type: Boolean, default: false },
    completedAt: { type: Date }

}, { timestamps: true })

module.exports = model("todo", todoScehma)