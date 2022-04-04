const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctors.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, doctorController.index);
router.get("/:id", verifyAuthToken, doctorController.show);
router.put("/:id", verifyAuthToken, doctorController.update);
router.delete("/:id", verifyAuthToken, doctorController.remove);
router.post("/", verifyAuthToken,doctorController.create);
router.post("/auth", doctorController.authenticate);

module.exports = router;