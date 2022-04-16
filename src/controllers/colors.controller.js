const ColorStore = require("../models/color");
const store = new ColorStore();

const index = async (_req, res) => {
  try {
    const colors = await store.index();
    res.json(colors);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const color = await store.show(req.params.id);
    res.json(color);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const create = async (req, res) => {
  const color = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    const newcolor = await store.create(color);
    res.json(newcolor);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};
const update = async (req, res) => {
  const color = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    const newcolor = await store.update(color, req.params.id);
    res.json(newcolor);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const color = await store.delete(req.params.id);
    res.json(color);
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
