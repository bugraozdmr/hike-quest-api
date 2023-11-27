const bcrypt = require("bcryptjs");

const ValidateUserInput = (email,password) => {
    return email && password;
};

const comparePassword = (password,hashedPassword) => {
    // ayniysa true
    return bcrypt.compareSync(password,hashedPassword);
}

module.exports = {
    ValidateUserInput,
    comparePassword
}