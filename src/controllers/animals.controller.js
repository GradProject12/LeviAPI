const AnimalsStore = require("../models/animal");
const store = new AnimalsStore();

const index = async (_req, res) => {
  try {
    const animals = await store.index();
    res.json(animals);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const animal = await store.show(req.params.id);
    res.json(animal);
  } catch (error) {
    res.status(404);
    res.json(error);
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
    res.json(newanimal);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
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
    res.json(newanimal);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const animal = await store.delete(req.params.id);
    res.json(animal);
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
