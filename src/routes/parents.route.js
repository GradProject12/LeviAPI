const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parents.controller");
const verifyAuthToken = require("../services/auth");
const parentStore = require("../models/parent");
const { pagination } = require("../services/middleware");

const store = new parentStore();

router.get("/", verifyAuthToken, pagination(store), parentController.index);
router.get("/:id", verifyAuthToken, parentController.showParentInfo);
router.get("/me/my-doctor", verifyAuthToken, parentController.getMyDoctorsInfo);
router.put("/:id", verifyAuthToken, parentController.update);
router.delete("/:id", verifyAuthToken, parentController.remove);
router.get(
  "/:parent_id/analyses",
  verifyAuthToken,
  parentController.showParentAnalayses
);
router.get(
  "/:id/doctor/:doctor_id",
  verifyAuthToken,
  parentController.showDoctor
);
router.post("/:id/rate", verifyAuthToken, parentController.rateDoctor);

module.exports = router;
