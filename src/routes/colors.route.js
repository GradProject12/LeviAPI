const express = require("express");
const router = express.Router();

const colorsController = require("../controllers/colors.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, colorsController.index);
router.get("/:id", verifyAuthToken, colorsController.show);
router.put("/:id", verifyAuthToken, colorsController.update);
router.delete("/:id", verifyAuthToken, colorsController.remove);
router.post("/", verifyAuthToken, colorsController.create);

module.exports = router;
