const ParentStore = require("../models/parent");
const jwt = require("jsonwebtoken");

const store = new ParentStore();

const index = async (_req, res) => {
  try {
    const parents = await store.index();
    res.json(parents);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const parent = await store.show(req.params.id);
    res.json(parent);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const create = async (req, res) => {
  const parent = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    image: req.body.image,
    doctor_id: req.body.doctor_id,
  };
  try {
    const newParent = await store.create(parent);
    const token = jwt.sign({ parent: newParent }, process.env.TOKEN_SERCRET);
    res.json({ username: parent.username, token: token });
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};
const update = async (req, res) => {
  const parent = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    image: req.body.image,
    doctor_id: req.body.doctor_id,
  };
  try {
    const parent2 = await store.update(parent, req.params.id);
    res.json(parent2);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const parent = await store.delete(req.params.id);
    res.json(parent);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const authenticate = async (req, res) => {
  const parent = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const parent2 = await store.authenticate(parent.username, parent.password);
    const token = jwt.sign({ parent2 }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.json({ username: parent2.username, token });
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
  authenticate,
};
