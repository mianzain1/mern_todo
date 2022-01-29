const express = require("express");
const router = express.Router();
const toDoModel = require("../models/todo.model");
const requireAuth = require("../middleware/permission");
const todoModel = require("../models/todo.model");
const validateToDoInput = require("../validation/todoValidation")
// @route  Get /api/todos/test
// @desc   Test Todo Route
// @Access Public
router.get("/test", (req, res) => {
    res.send("ToDo's Route is working")
})

// @route  POST /api/todos/new
// @desc   create new todo
// @Access Private
router.post("/new", requireAuth, async (req, res) => {
    try {
        //create new todo
        const newTodo = new toDoModel({
            user: req.user._id,
            content: req.body.content,
            complete: false
        })
        //save new todo to the database
        await newTodo.save();
        return res.status(200).json(newTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json("something is wrong" + error)
    }
});

// @route  POST /api/todos/current
// @desc   current user todo
// @Access Private

router.get("/current", requireAuth, async (req, res) => {
    try {
        const { isValid } = validateToDoInput(req.body);
        if (!isValid) {
            res.status(400).json(errors)

        }
        const completeTodos = await todoModel.find({ user: req.user._id, complete: true }).sort({ completeAt: -1 });
        const incompleteTodos = await todoModel.find({ user: req.user._id, complete: false }).sort({ createdAt: -1 });
        return res.json({ incompleteTodos: incompleteTodos, completeTodos: completeTodos })
    } catch (error) {
        console.log(error);
        res.status(500).json("something is wrong" + error)
    }
})


module.exports = router
