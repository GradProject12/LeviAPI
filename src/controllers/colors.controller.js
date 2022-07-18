const ColorStore = require("../models/color");
const store = new ColorStore();
const { successRes, errorRes } = require("../services/response");

const index = async (_req, res, next) => {
  try {
    const colors = await store.index();
    if (colors.length) return res.status(200).json(successRes(200, colors));
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
    const color = await store.show(req.params.id);
    res.status(200).json(successRes(200, color));
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
  const color = {
    name: req.body.name,
  };
  try {
    if (!color.name) {
      const error = new Error("Color name is missing");
      error.code = 422;
      throw error;
    }
    if (req.files.length) {
      color.image = req.files[0].path;
    }
    await store.create(color);
    res.status(200).json(successRes(200, null, "Color added successfully!"));
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
  const color = {
    name: req.body.name,
  };
  try {
    if (!color.name && !req.files.length) {
      const error = new Error("No data is entered!");
      error.code = 422;
      throw error;
    }
    if (req.files.length) {
      color.image = req.files[0].path;
    }
    await store.update(color, req.params.id);
    res.status(200).json(successRes(200, null, "Color updated successfully!"));
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
    res.status(200).json(successRes(200, null, "Color deleted Successfully!"));
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
