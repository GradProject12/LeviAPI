const ExpressionStore = require("../models/expression");

const store = new ExpressionStore();

const index = async (_req, res) => {
  try {
    const expressions = await store.index();
    res.json(expressions);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const expression = await store.show(req.params.id);
    res.json(expression);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const create = async (req, res) => {
  const expression = {
    status: req.body.status,
    sound: req.body.sound,
  };
  try {
    const newExpression = await store.create(expression);
    res.json(newExpression);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};
const update = async (req, res) => {
  const expression = {
    status: req.body.status,
    sound: req.body.sound,
  };
  try {
    const newExpression = await store.update(expression, req.params.id);
    res.json(newExpression);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const expression = await store.delete(req.params.id);
    res.json(expression);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
