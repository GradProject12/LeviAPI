const express = require("express");
const router = express.Router();
const { fileUploadd } = require("../services/upload");

const colorsController = require("../controllers/colors.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, colorsController.index);
router.get("/:id", verifyAuthToken, colorsController.show);
router.put(
  "/:id",
  verifyAuthToken,
  fileUploadd("image"),
  colorsController.update
);
router.delete("/:id", verifyAuthToken, colorsController.remove);
router.post(
  "/",
  verifyAuthToken,
  fileUploadd("image"),
  colorsController.create
);

module.exports = router;
