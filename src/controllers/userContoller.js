const { User } = require("../models/user");

module.exports.getUser = async (req, res) => {
    try {
        let username = req.params.username;
        const user = await User.findOne({ username: username })
            .select("-password")
            .populate("followers following", "-password");
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// update profile
module.exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const body = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: user.id },
            body,
            {
                new: true,
            }
        );
        await updatedUser.save();

        return res.status(200).json({
            message: "Profile has been updated",
            user: {
                fullName: updatedUser.fullName,
                username: updatedUser.username,
                email: updatedUser.email,
                id: updatedUser._id,
            },
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
