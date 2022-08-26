const jsonwebtoken = require("jsonwebtoken");

module.exports.isLoggedIn = async (req, res, next) => {
    let token = req.header("Authorization");
    if (token) {
        try {
            const decoded = await jsonwebtoken.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(400).send("Invalid Token!");
        }
    } else {
        return res.status(401).json({ message: "Access Denied" });
    }
};
