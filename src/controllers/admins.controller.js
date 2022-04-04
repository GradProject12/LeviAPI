const AdminStore = require("../models/admin");
const jwt = require("jsonwebtoken");

const store = new AdminStore();

const index = async (_req, res) => {
  try {
    const admins = await store.index();
    res.json(admins);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const admin = await store.show(req.params.id);
    res.json(admin);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const create = async (req, res) => {
  const admin = {
    role: req.body.role,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    image: req.body.image,
  };
  try {
    const newAdmin = await store.create(admin);
    const token = jwt.sign({ admin: newAdmin }, process.env.TOKEN_SERCRET);
    res.json({ username: admin.username, token: token });
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};
const update = async (req, res) => {
  const admin = {
    role: req.body.role,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    image: req.body.image,
  };
  try {
    const adminn = await store.update(admin, req.params.id);
    res.json(adminn);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const admin = await store.delete(req.params.id);
    res.json(admin);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const authenticate = async (req, res) => {
  const admin = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const adminn = await store.authenticate(admin.username, admin.password);
    const token = jwt.sign({ adminn }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.json({ username: adminn.username, token });
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
