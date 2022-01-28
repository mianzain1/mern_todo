const { isValidObjectId } = require("mongoose");
const validator = require("validator");
const isEmpty = require('./isEmpty');

const validateRegisterInput = (data) => {
    let errors = {};
    //check the email
    if (isEmpty(data.email)) {
        errors.email = "email field cannot be empty";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "email is invalid, please provide a valid email";
    }
    //check the password field
    if (isEmpty(data.password)) {
        errors.password = "password field cannot be empty"
    } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "password must be between 6 and 30 characters long"
    }
    //check the name field
    if (isEmpty(data.name)) {
        errors.password = "name field cannot be empty"
    } else if (!validator.isLength(data.password, { min: 3, max: 15 })) {
        errors.password = "name must be between 3 and 15 characters long"
    }
    //check the confirm password field
    if (isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "confirm password field cannot be empty";
    } else if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "password and confirm password must match"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }

};


module.exports = validateRegisterInput;