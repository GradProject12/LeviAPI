const express = require("express");
const router = express.Router();
const { fileUploadd } = require("../services/upload");

const animalController = require("../controllers/animals.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, animalController.index);
router.get("/:id", verifyAuthToken, animalController.show);
router.put(
  "/:id",
  verifyAuthToken,
  fileUploadd("picture"),
  animalController.update
);
router.delete("/:id", verifyAuthToken, animalController.remove);
router.post(
  "/",
  verifyAuthToken,
  fileUploadd("picture"),
  animalController.create
);

module.exports = router;
