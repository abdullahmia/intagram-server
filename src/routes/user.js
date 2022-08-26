const { getUser, updateProfile } = require("../controllers/userContoller");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/:username", isLoggedIn, getUser);
router.patch("/update-profile", isLoggedIn, updateProfile);

module.exports = router;
