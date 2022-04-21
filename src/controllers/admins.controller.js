const AdminStore = require("../models/admin");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { successRes, errorRes } = require("../services/response");

const store = new AdminStore();

const index = async (_req, res) => {
  try {
    const admins = await store.index();
    res.status(200).json(successRes(200, admins));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const admin = await store.show(req.params.id);
    res.status(200).json(successRes(200, admin));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    if (!admin.email) throw new Error("email address is missing");
    if (!admin.username) throw new Error("username is missing");
    if (!admin.password) throw new Error("password is missing");
    if (!admin.role) throw new Error("role is missing");
    if (!validator.isEmail(admin.email))
      throw new Error("email address is not valid ");
    if (admin.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (!validator.isURL(admin.image, []))
      throw new Error("image path is not valid");
    if (!validator.isIn(admin.role, ["admin", "sub-admin"]))
      throw new Error("please specify correct roll");

    const newAdmin = await store.create(admin);
    const token = jwt.sign({ admin: newAdmin }, process.env.TOKEN_SERCRET);
    res.status(201).json(
      successRes(201, {
        username: admin.username,
        role: admin.role,
        token: token,
      })
    );
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    if (admin.email && !validator.isEmail(admin.email))
      throw new Error("email address is not valid ");
    if (admin.password && admin.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (admin.image && !validator.isURL(admin.image, []))
      throw new Error("image path is not valid");
    if (admin.role && !validator.isIn(admin.role, ["admin", "sub-admin"]))
      throw new Error("please specify correct roll");

    const adminn = await store.update(admin, req.params.id);
    res.status(200).json(successRes(200, adminn));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const admin = await store.delete(req.params.id);
    res.status(200).json(successRes(200, admin));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
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
    res
      .status(200)
      .json(
        successRes(200, { username: adminn.username, role: adminn.role, token })
      );
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
