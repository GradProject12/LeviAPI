const AnimalsStore = require("../models/animal");
const store = new AnimalsStore();
const { successRes, errorRes } = require("../services/response");

const index = async (_req, res) => {
  try {
    const animals = await store.index();
    if (animals.length) res.status(200).json(successRes(200, animals));
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
    const animal = await store.show(req.params.id);
    res.status(200).json(successRes(200, animal));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const create = async (req, res) => {
  const animal = {
    name: req.body.name,
    picture: req.body.picture,
    sound: req.body.sound,
    spelled: req.body.spelled,
  };
  try {
    if (!animal.name) {
      const error = new Error("Animal name is missing");
      error.code = 422;
      throw error;
    }
    const newanimal = await store.create(animal);
    res.status(200).json(successRes(200, newanimal));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
const update = async (req, res) => {
  const animal = {
    name: req.body.name,
    picture: req.body.picture,
    sound: req.body.sound,
    spelled: req.body.spelled,
  };
  try {
    if (!animal.name && !animal.picture && !animal.sound && !animal.spelled) {
      const error = new Error("No data is entered!");
      error.code = 422;
      throw error;
    }
    const newanimal = await store.update(animal, req.params.id);
    res.status(200).json(successRes(200, newanimal));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const animal = await store.delete(req.params.id);
    res.status(200).json(successRes(200, animal));
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
