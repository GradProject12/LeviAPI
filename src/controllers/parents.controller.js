const ParentStore = require("../models/parent");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");

const store = new ParentStore();

const index = async (_req, res) => {
  try {
    const parents = await store.index();
    res.status(200).json(successRes(200, parents));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const parent = await store.show(req.params.id);
    res.status(200).json(successRes(200, parent));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    if (!parent.email) throw new Error("email address is missing");
    if (!parent.full_name) throw new Error("full name is missing");
    if (!parent.password) throw new Error("password is missing");

    if (!validator.isEmail(parent.email))
      throw new Error("email address is not valid ");
    if (parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.image && !validator.isURL(parent.image, []))
      throw new Error("image path is not valid");
    
    const newParent = await store.create(parent);
    const token = jwt.sign({ parent: newParent }, process.env.TOKEN_SERCRET);
    res
      .status(200)
      .json(successRes(200, { username: parent.username, token: token }));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    if (parent.email && !validator.isEmail(parent.email))
      throw new Error("email address is not valid ");
    if (parent.password && parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.image && !validator.isURL(parent.image, []))
      throw new Error("image path is not valid");

    const parent2 = await store.update(parent, req.params.id);
    res.status(200).json(successRes(200, parent2));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const parent = await store.delete(req.params.id);
    res.status(200).json(successRes(200, parent));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    res
      .status(200)
      .json(successRes(200, { username: parent2.username, token }));
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
  authenticate,
};
