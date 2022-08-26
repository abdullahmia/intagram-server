const {
    register,
    login,
    changePassword,
    forgotPasswordEmailSend,
    setPassword,
} = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/change-password", isLoggedIn, changePassword);
router.post("/forgot-password", forgotPasswordEmailSend);
router.patch("/reset-password/:user/:token", setPassword);

module.exports = router;
