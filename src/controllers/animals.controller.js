const AnimalsStore = require("../models/animal");
const store = new AnimalsStore();
const { successRes, errorRes } = require("../services/response");

const index = async (_req, res, next) => {
  try {
    const animals = await store.index();
    if (animals.length) return res.status(200).json(successRes(200, animals));
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
    const animal = await store.show(req.params.id);
    res.status(200).json(successRes(200, animal));
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
  const animal = {
    name: req.body.name,
    sound: req.body.sound,
    spelled: req.body.spelled,
  };
  try {
    if (!animal.name) {
      const error = new Error("Animal name is missing");
      error.code = 422;
      throw error;
    }

    if (req.files.length) {
      animal.picture = req.files[0].path;
    }
    await store.create(animal);
    res.status(200).json(successRes(200, null, "Animal created successfully!"));
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
  const animal = {
    name: req.body.name,
    sound: req.body.sound,
    spelled: req.body.spelled,
  };
  try {
    if (!animal.name && !req.files && !animal.sound && !animal.spelled) {
      const error = new Error("No data is entered!");
      error.code = 422;
      throw error;
    }
    if (req.files.length) {
      animal.picture = req.files[0].path;
    }
    await store.update(animal, req.params.id);
    res.status(200).json(successRes(200, null, "Animal updated successfully!"));
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
    res.status(200).json(successRes(200, null, "Animal deleted successfully!"));
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
