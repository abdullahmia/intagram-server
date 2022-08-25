const jwt = require("jsonwebtoken");

module.exports.genarateToken = (payload, expired) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expired,
    });
};
