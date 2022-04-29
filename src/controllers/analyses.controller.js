const AnalysisStore = require("../models/analysis");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");

const store = new AnalysisStore();

const getAllAnalysisBelongToRobot = async (req, res) => {
  try {
    const result = await store.getAllAnalysisBelongToRobot(req.params.robot_id);
    if (!result.length)
      return res.status(200).json(successRes(200, null, "Nothing exits"));
    res.status(200).json(successRes(200, result));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const showSingleAnalysisBelongToRobot = async (req, res) => {
  try {
    const result = await store.showSingleAnalysisBelongToRobot(
      req.params.analysis_id
    );
    res.status(200).json(successRes(200, result));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  try {
    if (!req.body.analysis) {
      const error = new Error("analysis is missing");
      error.code = 422;
      throw error;
    }
    const strr = JSON.stringify(req.body.analysis);

    if (!validator.isJSON(strr, [])) {
      throw new Error("Analysis must be of type json ");
    }
    await store.create(req.body.analysis, req.params.robot_id);
    return res
      .status(200)
      .json(successRes(200, null, "Analysis added successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

module.exports = {
  getAllAnalysisBelongToRobot,
  showSingleAnalysisBelongToRobot,
  create,
};
