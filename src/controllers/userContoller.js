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
