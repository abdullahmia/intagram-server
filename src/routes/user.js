const { getUser } = require("../controllers/userContoller");
const { isLoggedIn } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/:username", isLoggedIn, getUser);

module.exports = router;
