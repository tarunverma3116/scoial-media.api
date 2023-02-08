const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");

const { createChat, getChats } = require("../services/chatService");

router.route("/create/:id").post(authenticate, createChat);
router.route("/:id").get(authenticate, getChats);

module.exports = router;
