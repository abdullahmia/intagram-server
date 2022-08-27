const {
    getUser,
    updateProfile,
    uploadProfilePicture,
} = require("../controllers/userContoller");
const uploader = require("../lib/multer");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/:username", isLoggedIn, getUser);
router.patch("/update-profile", isLoggedIn, updateProfile);

router.patch(
    "/upload-profile-picture",
    isLoggedIn,
    uploader.single("image"),
    uploadProfilePicture
);

module.exports = router;
