const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");

const { createChat, getChats } = require("../services/chatService");

router.route("/create").post(authenticate, createChat);
router.route("/").get(authenticate, getChats);

module.exports = router;
