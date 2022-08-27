const bcrypt = require("bcryptjs");

module.exports.hash = (password) => {
    const hash = bcrypt.hash(password, 10);
    return hash;
};
