const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");

const {
    createPost,
    getPosts,
    getPost,
} = require("../services/postService")

router.route("/create").post(authenticate,createPost);
router.route("/").get(authenticate,getPosts);
router.route("/:id").get(authenticate,getPost);

module.exports = router;