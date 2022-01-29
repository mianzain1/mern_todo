const express = require("express");
const router = express.Router()
const UserModel = require("../models/User.model.js")
const bcrypt = require('bcryptjs')
const validateRegisterInput = require("../validation/registerValidation")
const jwt = require("jsonwebtoken")
const requireAuth = require("../middleware/permission")

// @route Get /api/auth/test @publicRoute
router.get("/test", (req, res) => {

    res.send("thi is a test route your application auth routes is working")
})

// @route: Post /api/auth/register
// @description: saving user in data base
// @access :public
router.post("/register", async (req, res) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body)
        if (!isValid) {
            return res.status(400).json(errors)
        }
        //checking for existing user
        const existingUser = await UserModel.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")
        });
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
        const savedUser = await newUser.save();

        const payload = { userId: savedUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        const { password, ...others } = savedUser._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json("something is wrong" + error)
    }
})

// @route: Post /api/auth/login
// @description: Login user and return an access token
// @access :public
router.post("/login", async (req, res) => {
    try {
        //check for the user availability in database
        const user = await UserModel.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        })
        if (!user) {
            return res.status(400).json({ error: "wrong credential" })
        }
        //compare the password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "wrong credential" })
        }
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });
        const returnUser = { ...user._doc };
        delete returnUser.password;
        return res.status(200).json({ token: token, user: returnUser })

    } catch (error) {
        res.status(500).json("something is wrong" + error)
    }
});

// @route: Get /api/auth/current
// @description: Return the currently log in user
// @access :Private
router.get("/current", requireAuth, async (req, res) => {
    if (!req.user) {
        return res.status(200).json("unAuthorized")
    }
    return res.json(req.user)
})

// @route: PUT /api/auth/logout
// @description: logout user and clear the cookie
// @access :Private
router.put("/logout", requireAuth, async (req, res) => {
    try {
        res.clearCookie("access-token");
        return res.status({ success: true });
    } catch (error) {
        res.status(500).json("something is wrong" + error)
    }
})


module.exports = router