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
                {
                    id: user._id,
                    fullName: user.fullNam,
                    email: user.email,
                    image: user.image,
                },
                "7d"
            );
            return res.send({
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                image: user.image,
                email: user.email,
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Invalid credential" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// chage password
module.exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (oldPassword && newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                let user = req.user;
                user = await User.findOne({ _id: user.id, email: user.email });
                let isValidPassword = await user.isValidPassword(oldPassword);
                if (!isValidPassword) {
                    return res.status(401).json({
                        success: false,
                        message: "Old password incorrect.",
                    });
                }

                user.password = confirmPassword;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Password has been chenged",
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Password & confrim password not matched.",
                });
            }
        } else {
            return res.status(400).json({
                error: true,
                message: "Field required.",
            });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
