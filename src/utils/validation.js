const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("This is not a valid email");
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        throw new Error("Password is not strong enough");
    }
};

module.exports = validateSignUpData;
