const express = require("express");
const router = express.Router();
const { fileUploadd } = require("../services/upload");

const expressionController = require("../controllers/expressions.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, expressionController.index);
router.get("/:id", verifyAuthToken, expressionController.show);
router.put(
  "/:id",
  verifyAuthToken,
  fileUploadd("sound"),
  expressionController.update
);
router.delete("/:id", verifyAuthToken, expressionController.remove);
router.post(
  "/",
  verifyAuthToken,
  fileUploadd("sound"),
  expressionController.create
);

module.exports = router;
