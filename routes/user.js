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
  searchUser,
  getUserFromId,
  followUser,
  getPostsForUserFromId,
  feedPostsForUser,
  getUserFollowing,
} = require("../services/userService");

router.route("/signup").post(createUser);
router.route("/login").post(loginUser);
router.route("/").get(authenticate, getUser);
router.route("/user/:id").get(authenticate, getUserFromId);
router.route("/").post(authenticate, updateUser);
router.route("/posts").get(authenticate, getPostsForUser);
router.route("/posts/:id").get(authenticate, getPostsForUserFromId);
router.route("/search").get(authenticate, searchUser);
router.route("/follow/:id").post(authenticate, followUser);
router.route("/feed").get(authenticate, feedPostsForUser);
router.route("/following").get(authenticate, getUserFollowing);


module.exports = router;