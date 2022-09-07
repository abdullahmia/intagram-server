const router = require("express").Router();

const {
    createPost,
    getPosts,
    like,
    unlike,
} = require("../controllers/postController");
const multer = require("../lib/multer");

const { isLoggedIn } = require("../middlewares/auth");

router
    .route("/")
    .post([isLoggedIn, multer.single("image")], createPost)
    .get(isLoggedIn, getPosts);

router.patch("/like/:id", isLoggedIn, like);
router.patch("/unlike/:id", isLoggedIn, unlike);

module.exports = router;
