const express = require("express");
const router = express.Router();
const toDoModel = require("../models/todo.model");
const requireAuth = require("../middleware/permission");
const todoModel = require("../models/todo.model");
const validateToDoInput = require("../validation/todoValidation");


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
        const { isValid, errors } = validateToDoInput(req.body);
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

// @route  PUT /api/todo/:todoId/complete
// @desc   Mark a todo as complete
// @Access Private
router.put("/:todoId/complete", requireAuth, async (req, res) => {
    try {
        const toDo = await todoModel.findOne({
            user: req.user._id,
            _id: req.params.todoId
        })
        if (!toDo) {
            return res.status(404).json("cannot find TODO")
        }
        if (toDo.complete) {
            return res.status(404).json("Todo is already complete")
        }
        const updateToDo = await todoModel.findByIdAndUpdate({
            user: req.user_.id,
            _id: req.params.todoId
        },
            {
                complete: true,
                completeAt: new Date()
            },
            {
                new: true
            },
        )
        return res.json(updateToDo)

    } catch (error) {
        console.log(error);
        res.status(500).json("something is wrong" + error)
    }
});

// @route  PUT /api/todo/:todoId/Incomplete
// @desc   Mark a todo as incomplete
// @Access Private
router.put("/:todoId/incomplete", requireAuth, async (req, res) => {
    try {
        const toDo = await todoModel.findOne({ user: req.user._id, _id: req.params.todoId })
        if (!toDo) {
            res.status(404).json("cannot find todo")
        }
        if (!toDo.complete) {
            return res.status(400).json("todo is already complete");
        }
        const updatedToDo = await todoModel.findByIdAndUpdate({
            user: req.user._id,
            _id: req.params.todoId,
            complete: false,
            completeAt: null
        }, { new: true })
        res.json(updatedToDo)
    } catch (error) {
        console.log(error);
        res.status(500).json("something is wrong" + error)
    }
})

// @route  PUT /api/todo/:todoId/Incomplete
// @desc   Update todo
// @Access Private
router.put("/:todoId", requireAuth, async (req, res) => {
    try {
        const toDo = await todoModel.findOne({ user: req.user._id, _id: req.params.todoId })
        if (!toDo) {
            res.status(404).json("cannot find todo")
        }
        const { isValid, errors } = validateToDoInput(req.body)
        if (!valid) {
            return res.status(400).json(errors);
        }
        const updatedTodo = await todoModel.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.todoId
            },
            {
                content: req.body.content
            },
            {
                new: true
            }
        );
        return res.json(updatedTodo)

    } catch (error) {
        console.log(error);
        res.status(500).json("something is wrong" + error)
    }
});


// @route  PUT /api/todo/:todoId/Incomplete
// @desc   Update todo
// @Access Private
router.delete("/:toDoId", requireAuth, async (req, res) => {
    try {

        const deleteTodo = await todoModel.findByIdAndDelete({ user: req.user._id, _id: req.params.toDoId })
        return res.json("Todo has been deleted")
    } catch (error) {
        console.log(error);
        res.status(500).json("something is wrong" + error)
    }

})



module.exports = router
