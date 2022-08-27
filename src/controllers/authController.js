const { genarateToken } = require("../lib/jwt");
const { User, Token } = require("../models/user");
const crypto = require("crypto");
const sendMail = require("../lib/mailer");
const { hash } = require("../utils/hash");

// register
module.exports.register = async (req, res) => {
    try {
        const { email, fullName, username, password } = req.body;

        // check if user is already exist
        const isEmailUser = await User.findOne({ email });
        const isUsernameUser = await User.findOne({ username });
        if (isEmailUser) {
            return res.status(400).json({ message: "User is alrady exist" });
        }
        if (isUsernameUser) {
            return res
                .status(400)
                .json({ message: "Username is already taken" });
        }

        const hashPassword = hash(password);

        // create a new user
        const user = await new User({
            email,
            fullName,
            username,
            password: hashPassword,
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
                    username: user.username,
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

// Password reset email send
module.exports.forgotPasswordEmailSend = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({
                error: true,
                message: "Field required.",
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found with email.",
            });
        }

        let token = await Token.findOne({ user: user.id });
        if (!token) {
            token = new Token({
                user: user.id,
                token: crypto.randomBytes(32).toString("hex"),
            });
            await token.save();
        }

        const url = `${process.env.BASE_URL}/reset-password/${user.id}/${token.token}`;
        // send password rest mail
        // passwordResetMail(user.email, url);
        sendMail(user.email, "Password reset", url);

        return res.status(200).json({
            error: false,
            message: "Password reset email has been sent on your email.",
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// set new password for a user
module.exports.setPassword = async (req, res) => {
    try {
        const { user, token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        // find the user
        let getUser = await User.findOne({ _id: user });
        let userToken = await Token.findOne({ token: token });
        if (getUser && userToken) {
            if (newPassword === confirmPassword) {
                getUser.password = confirmPassword;
                await getUser.save();
                await Token.findOneAndDelete({ user: getUser._id });
                return res.status(200).json({
                    message: "Password has been changed",
                });
            }
        } else {
            return res.status(400).json({
                message: "Invalid password reset link",
            });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
