const ColorStore = require("../models/color");
const store = new ColorStore();
const { successRes, errorRes } = require("../services/response");

const index = async (_req, res) => {
  try {
    const colors = await store.index();
    res.status(200).json(successRes(200, colors));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const color = await store.show(req.params.id);
    res.status(200).json(successRes(200, color));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const color = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    if (!color.name) throw new Error("name is missing");
    const newcolor = await store.create(color);
    res.status(200).json(successRes(200, newcolor));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};
const update = async (req, res) => {
  const color = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    const newcolor = await store.update(color, req.params.id);
    res.status(200).json(successRes(200, newcolor));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const color = await store.delete(req.params.id);
    res.status(200).json(successRes(200, color));
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
