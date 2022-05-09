const ColorStore = require("../models/color");
const store = new ColorStore();
const { successRes, errorRes } = require("../services/response");

const index = async (_req, res) => {
  try {
    const colors = await store.index();
    if (colors.length) res.status(200).json(successRes(200, colors));
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
    const color = await store.show(req.params.id);
    res.status(200).json(successRes(200, color));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const create = async (req, res) => {
  const color = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    if (!color.name) {
      const error = new Error("Color name is missing");
      error.code = 422;
      throw error;
    }
    const newcolor = await store.create(color);
    res.status(200).json(successRes(200, null,'Color updated successfully!'));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
const update = async (req, res) => {
  const color = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    if (!color.name && !color.image) {
      const error = new Error("No data is entered!");
      error.code = 422;
      throw error;
    }
    await store.update(color, req.params.id);
    res.status(200).json(successRes(200, null,'Color updated successfully!'));
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
    res.status(200).json(successRes(200, null,'Color deleted Successfully!'));
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
