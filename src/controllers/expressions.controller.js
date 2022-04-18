const ExpressionStore = require("../models/expression");
const { successRes, errorRes } = require("../services/response");

const store = new ExpressionStore();

const index = async (_req, res) => {
  try {
    const expressions = await store.index();
    res.status(200).json(successRes(200, expressions));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const expression = await store.show(req.params.id);
    res.status(200).json(successRes(200, expression));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const expression = {
    status: req.body.status,
    sound: req.body.sound,
  };
  try {
    if (!expression.sound) throw new Error("sound address is missing");
    if (!expression.status) throw new Error("status is missing");


    const newExpression = await store.create(expression);
    res.status(200).json(successRes(200, newExpression));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};
const update = async (req, res) => {
  const expression = {
    status: req.body.status,
    sound: req.body.sound,
  };
  try {
    if (!expression.sound || !expression.status ) throw new Error("update faild! no data is provided");
    const newExpression = await store.update(expression, req.params.id);
    res.status(200).json(successRes(200, newExpression));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const expression = await store.delete(req.params.id);
    res.status(200).json(successRes(200, expression));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
