const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messages.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, messagesController.index);

module.exports = router;
