const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctors.controller");
const verifyAuthToken = require("../services/auth");
const doctorStore = require("../models/doctor");
const {pagination} = require("../services/middleware");

const store = new doctorStore();


router.get("/", verifyAuthToken,pagination(store), doctorController.index);
router.get("/:id", verifyAuthToken, doctorController.show);
router.put("/:id", verifyAuthToken, doctorController.update);
router.delete("/:id", verifyAuthToken, doctorController.remove);

module.exports = router;