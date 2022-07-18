const ExpressionStore = require("../models/expression");
const { successRes, errorRes } = require("../services/response");

const store = new ExpressionStore();

const index = async (_req, res, next) => {
  try {
    const expressions = await store.index();
    if (expressions.length)
      return res.status(200).json(successRes(200, expressions));
    res.status(200).json(successRes(200, null, "No data exist!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const expression = await store.show(req.params.id);
    res.status(200).json(successRes(200, expression));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const create = async (req, res, next) => {
  const expression = {
    status: req.body.status,
  };
  try {
    if (req.files.length && req.files[0].fieldname !== "sound") {
      const error = new Error("Sound is missing");
      error.code = 422;
      throw error;
    }
    if (!expression.status) {
      const error = new Error("Status is missing");
      error.code = 422;
      throw error;
    }

    if (req.files.length) {
      expression.sound = req.files[0].path;
    }

    await store.create(expression);
    res
      .status(200)
      .json(successRes(200, null, "Expression added successfully!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};
const update = async (req, res, next) => {
  const expression = {
    status: req.body.status,
  };
  try {
    if (
      !expression.status &&
      (!req.files || req.files[0].fieldname !== "sound")
    )
      throw new Error("No data is entered!");
    if (req.files.length) {
      expression.sound = req.files[0].path;
    }
    await store.update(expression, req.params.id);
    res
      .status(200)
      .json(successRes(200, null, "Expression updated successfully!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await store.delete(req.params.id);
    res
      .status(200)
      .json(successRes(200, null, "Expression deleted successfully!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
