const {
    register,
    login,
    changePassword,
} = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/change-password", isLoggedIn, changePassword);

module.exports = router;
