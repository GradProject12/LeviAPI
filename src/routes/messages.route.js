const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messages.controller");
const verifyAuthToken = require("../services/auth");

router.get(
  "/chats/:chat_id",
  verifyAuthToken,
  messagesController.getAllMessage
);
router.get("/chats", verifyAuthToken, messagesController.getAllChats);
router.post("/:reciver_id", verifyAuthToken, messagesController.sendMessage);

module.exports = router;
