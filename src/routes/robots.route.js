const express = require("express");
const router = express.Router();

const robotController = require("../controllers/robots.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, robotController.index);
router.get("/:id", verifyAuthToken, robotController.show);
router.put("/:id", verifyAuthToken, robotController.update);
router.delete("/:id", verifyAuthToken, robotController.remove);
router.post("/", verifyAuthToken,robotController.create);

module.exports = router;