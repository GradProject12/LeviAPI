const UserStore = require("../models/user");
const jwt = require("jsonwebtoken");

const store = new UserStore();

const index = async (_req, res) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const create = async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    image: req.body.image,
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SERCRET);
    res.json({ username: user.username, token: token });
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};
const update = async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const userr = await store.update(user, req.params.id);
    res.json(userr);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const user = await store.delete(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const authenticate = async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const userr = await store.authenticate(user.username, user.password);
    const token = jwt.sign({ userr }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.json({ username: userr.username, token });
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
