const express = require("express");
const router = express.Router()
const UserModel = require("../models/User.model.js")
const bcrypt = require('bcryptjs')
const validateRegisterInput = require("../validation/registerValidation")

// @route Get /api/auth/test @publicRoute
router.get("/test", (req, res) => {

    res.send("thi is a test route your application auth routes is working")
})

//@route Post request Register user 
// /api/auth/register @publicRoute
router.post("/register", async (req, res) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body)
        if (!isValid) {
            return res.status(400).json(errors)
        }
        //checking for existing user
        const existingUser = await UserModel.findOne({ email: new RegExp("^" + req.body.email + "$", "i") });
        if (existingUser) {
            return res
                .status(200).json("this email is already there")
        }
        //hashing password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //creating new user
        const newUser = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        //saving new user 
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
    } catch (error) {
        res.status(500).json("something is wrong" + error)
    }
})

module.exports = router