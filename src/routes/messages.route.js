const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messages.controller");
const verifyAuthToken = require("../services/auth");

router.get("/:chat_id", verifyAuthToken, messagesController.getAllMessage);
router.post("/:reciver_id", verifyAuthToken, messagesController.sendMessage);

module.exports = router;
