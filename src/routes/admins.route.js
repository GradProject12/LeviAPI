const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admins.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, adminController.index);
router.get("/:id", verifyAuthToken, adminController.show);
router.put("/:id", verifyAuthToken, adminController.update);
router.delete("/:id", verifyAuthToken, adminController.remove);
router.post("/", verifyAuthToken,adminController.create);
router.post("/auth", adminController.authenticate);

module.exports = router;