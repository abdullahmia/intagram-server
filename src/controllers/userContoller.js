const { User } = require("../models/user");
const cloudinary = require("../lib/cloudinary");

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

// update profile picture
module.exports.uploadProfilePicture = async (req, res) => {
    try {
        const reqUser = req.user;
        const user = await User.findOne({ _id: reqUser.id });

        // delete user old profile picture
        if (user.image) {
            await cloudinary.uploader.destroy(user.image);
        }

        // upload a new profile picture
        const uploadImage = await cloudinary.uploader.upload(req.file.path);
        user.image = await uploadImage.public_id;
        await user.save();
        return res.status(200).json({
            message: "Picture has been updated",
            image: user.image,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
