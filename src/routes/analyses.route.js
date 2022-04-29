const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analyses.controller");
const verifyAuthToken = require("../services/auth");

router.get("/:robot_id/all", verifyAuthToken, analysisController.getAllAnalysisBelongToRobot);
router.get("/:analysis_id", verifyAuthToken, analysisController.showSingleAnalysisBelongToRobot);
router.post("/:robot_id", verifyAuthToken, analysisController.create);

module.exports = router;
