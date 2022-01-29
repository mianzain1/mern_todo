const validator = require('validator');
const isEmpty = require("./isEmpty");

const validateToDoInput = data => {
    let errors = {};
    //check
    if (isEmpty(data.content)) {

        errors.content = "Content Fields Cannot be empty";
    } else if (!validator.isLength(data.content, { min: 3, max: 300 })) {
        errors.content = "content field must be between 3 to 300 ";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateToDoInput;