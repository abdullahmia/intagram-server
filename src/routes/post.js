const router = require("express").Router();

const { createPost, getPosts } = require("../controllers/postController");
const multer = require("../lib/multer");

const { isLoggedIn } = require("../middlewares/auth");

router
    .route("/")
    .post([isLoggedIn, multer.single("image")], createPost)
    .get(isLoggedIn, getPosts);

module.exports = router;
