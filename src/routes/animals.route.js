const express = require("express");
const router = express.Router();

const animalController = require("../controllers/animals.controller");
const verifyAuthToken = require("../services/auth");

router.get("/",  animalController.index);
router.get("/:id", verifyAuthToken, animalController.show);
router.put("/:id", verifyAuthToken, animalController.update);
router.delete("/:id", verifyAuthToken, animalController.remove);
router.post("/", verifyAuthToken, animalController.create);

module.exports = router;