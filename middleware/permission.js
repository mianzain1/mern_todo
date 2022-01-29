const UserModel = require("../models/User.model");
const jwt = require('jsonwebtoken')

const requireAuth = async (req, res, next) => {
    const token = req.cookies["access-token"];
    let isAuth = false;
    //if there is a token
    if (token) {
        try {
            const { userId } = jwt.verify(token, process.env.JWT_SECRET)
            try {
                const user = await UserModel.findById(userId);
                if (user) {
                    const returnUser = { ...user._doc };
                    delete returnUser.password;
                    req.user = returnUser;
                    isAuth = true;
                }
            } catch {
                isAuth = false
            }

        } catch (error) {
            isAuth = false
        }
    }

    if (isAuth) {
        return next();
    } else {
        res.status(401).json("Un Authorized")
    }
}

module.exports = requireAuth