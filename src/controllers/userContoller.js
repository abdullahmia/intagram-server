const { User } = require("../models/user");
const cloudinary = require("../lib/cloudinary");
const Post = require("../models/post");

module.exports.getUser = async (req, res) => {
    try {
        let username = req.params.username;
        const user = await User.findOne({ username: username })
            .select("-password")
            .populate("followers following", "-password");
        if (!user) {
            return res.status(404).json({
                isUser: false,
                message: "User not found",
            });
        }
        const posts = await Post.find({ user: user._id }).sort("-createdAt");
        return res.status(200).json({ user, posts });
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

// suggested profile for users
module.exports.suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({
            users,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// follow a user
module.exports.follow = async (req, res) => {
    try {
        const user = await User.find({
            _id: req.params.id,
            followers: req.user.id,
        });

        if (user.length > 0) {
            return res.status(400).json({
                message: "You are already following this user",
            });
        }

        const newUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    followers: req.user.id,
                },
            },
            {
                new: true,
            }
        ).select("-password");
        await newUser.save();

        const follwoingUser = await User.findOneAndUpdate(
            { _id: req.user.id },
            {
                $push: {
                    following: req.params.id,
                },
            },
            { new: true }
        );

        res.status(200).json({
            user: newUser,
        });
        await follwoingUser.save();
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// unfollow a user
module.exports.unfollow = async (req, res) => {
    try {
        const newUser = await User.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $pull: {
                    followers: req.user.id,
                },
            },
            {
                new: true,
            }
        );
        await newUser.save();

        await User.findOneAndUpdate(
            { _id: req.user.id },
            { $pull: { following: req.params.id } },
            { new: true }
        );

        res.status(200).json({
            message: "User has been unfollowed",
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
