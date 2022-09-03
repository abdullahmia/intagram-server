const router = require("express").Router();

const { createPost } = require("../controllers/postController");
const multer = require("../lib/multer");

const { isLoggedIn } = require("../middlewares/auth");

router.route("/").post([isLoggedIn, multer.single("image")], createPost);

module.exports = router;
