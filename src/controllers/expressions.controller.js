const ExpressionStore = require("../models/expression");
const { successRes, errorRes } = require("../services/response");

const store = new ExpressionStore();

const index = async (_req, res) => {
  try {
    const expressions = await store.index();
    if (expressions.length) return res.status(200).json(successRes(200, expressions));
    res.status(200).json(successRes(200, null, "No data exist!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const show = async (req, res) => {
  try {
    const expression = await store.show(req.params.id);
    res.status(200).json(successRes(200, expression));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const create = async (req, res) => {
  const expression = {
    status: req.body.status,
    sound: req.body.sound,
  };
  try {
    if (!expression.sound) {
      const error = new Error("Sound is missing");
      error.code = 422;
      throw error;
    }
    if (!expression.status) {
      const error = new Error("Status is missing");
      error.code = 422;
      throw error;
    }

    const newExpression = await store.create(expression);
    res.status(200).json(successRes(200, newExpression));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
const update = async (req, res) => {
  const expression = {
    status: req.body.status,
    sound: req.body.sound,
  };
  try {
    if (!expression.sound && !expression.status)
      throw new Error("No data is entered!");
    await store.update(expression, req.params.id);
    res.status(200).json(successRes(200, null,'Expression updated successfully!'));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const remove = async (req, res) => {
  try {
    await store.delete(req.params.id);
    res.status(200).json(successRes(200, null,'Expression deleted successfully!'));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
