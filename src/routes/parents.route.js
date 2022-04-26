const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parents.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, parentController.index);
router.get("/:id", verifyAuthToken, parentController.show);
router.put("/:id", verifyAuthToken, parentController.update);
router.delete("/:id", verifyAuthToken, parentController.remove);

module.exports = router;