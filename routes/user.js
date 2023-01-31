const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");
// const verifyOtp = require("../middleware/verifyOtpMiddleware");

const {
    createUser,
    loginUser,
    getUser,
    updateUser,
    getPostsForUser,
    searchUser
} = require("../services/userService")

router.route("/signup").post(createUser);
router.route("/login").post(loginUser);
router.route("/").get(authenticate, getUser);
router.route("/").post(authenticate, updateUser);
router.route("/posts").get(authenticate, getPostsForUser);
router.route("/search").get(authenticate, searchUser);


module.exports = router;