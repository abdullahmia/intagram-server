const { genarateToken } = require("../lib/jwt");
const User = require("../models/user");

// register
module.exports.register = async (req, res) => {
    try {
        const { email, fullName, username, password } = req.body;

        // check if user is already exist
        const isEmailUser = await User.findOne({ email });
        const isUsernameUser = await User.findOne({ username });
        console.log(isEmailUser, isUsernameUser);
        if (isEmailUser) {
            return res.status(400).json({ message: "User is alrady exist" });
        }
        if (isUsernameUser) {
            return res
                .status(400)
                .json({ message: "Username is already taken" });
        }

        // create a new user
        const user = await new User({
            email,
            fullName,
            username,
            password,
        }).save();

        return res.send({
            message: "User has been created",
            fullName: user.fullName,
            email: user.email,
            username: user.username,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// login
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "account not found" });
        }

        // checking if password is correct.
        let isValidPassword = await user.isValidPassword(password);
        if (isValidPassword) {
            const token = genarateToken(
                { id: user._id, fullName: user.fullName },
                "7d"
            );
            return res.send({
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Invalid credential" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
