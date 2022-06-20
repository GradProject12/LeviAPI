const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctors.controller");
const verifyAuthToken = require("../services/auth");
const doctorStore = require("../models/doctor");
const {pagination} = require("../services/middleware");

const store = new doctorStore();


router.get("/", verifyAuthToken,pagination(store), doctorController.index);
router.get("/:id", verifyAuthToken,pagination(store), doctorController.showDoctorProfile);
router.get("/:doctor_id/parents", verifyAuthToken, doctorController.showParentsBelongsToDoctor);
router.put("/:id", verifyAuthToken, doctorController.update);
router.delete("/:id", verifyAuthToken, doctorController.remove);
router.post("/:doctor_id/add-parent", verifyAuthToken, doctorController.addParentToDoctor);
router.post("/:doctor_id/remove-parent", verifyAuthToken, doctorController.removeParentBelongsToDoctor);

module.exports = router;