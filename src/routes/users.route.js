const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, userController.index);
router.get("/:id", verifyAuthToken, userController.show);
router.put("/:id", verifyAuthToken, userController.update);
router.delete("/:id", verifyAuthToken, userController.remove);
router.post("/", verifyAuthToken,userController.create);
router.post("/auth", userController.authenticate);

module.exports = router;