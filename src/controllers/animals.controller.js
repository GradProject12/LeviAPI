const AnimalsStore = require("../models/animal");
const store = new AnimalsStore();
const { successRes, errorRes } = require("../services/response");

const index = async (_req, res) => {
  try {
    const animals = await store.index();
    res.status(200).json(successRes(200, animals));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const animal = await store.show(req.params.id);
    res.status(200).json(successRes(200, animal));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    const newanimal = await store.create(animal);
    res.status(200).json(successRes(200, newanimal));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    const newanimal = await store.update(animal, req.params.id);
    res.status(200).json(successRes(200, newanimal));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const animal = await store.delete(req.params.id);
    res.status(200).json(successRes(200, animal));
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
