const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");

const { createPost, getPosts } = require("../services/postService");

router.route("/create").post(authenticate,createPost);
router.route("/").get(authenticate,getPosts);


module.exports = router;