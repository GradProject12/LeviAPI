const express = require("express");
const router = express.Router();

const expressionController = require("../controllers/expressions.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, expressionController.index);
router.get("/:id", verifyAuthToken, expressionController.show);
router.put("/:id", verifyAuthToken, expressionController.update);
router.delete("/:id", verifyAuthToken, expressionController.remove);
router.post("/", verifyAuthToken, expressionController.create);

module.exports = router;
