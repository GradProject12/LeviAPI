const ParentStore = require("../models/parent");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");

const store = new ParentStore();

const index = async (_req, res) => {
  try {
    if (!res.data)
      return res.status(200).json(successRes(200, null, "Nothing exits"));
    res
      .status(200)
      .json(successRes(200, res.data, undefined, res.paginatedResult));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const show = async (req, res) => {
  try {
    const parent = await store.show(req.params.id);
    const { user_id, password, verified, secret, ...rest } = parent;
    res.status(200).json(successRes(200, rest));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const update = async (req, res) => {
  const parent = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_image: req.body.profile_image,
    doctor_id: req.body.doctor_id,
  };
  try {
    if (parent.email && !validator.isEmail(parent.email))
      throw new Error("email address is not valid ");
    if (parent.password && parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.profile_image && !validator.isURL(parent.profile_image, []))
      throw new Error("image path is not valid");
    const parent2 = await store.update(parent, req.params.id);
    res
      .status(200)
      .json(successRes(200, parent2, "Account is updated successfully"));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const remove = async (req, res) => {
  try {
    await store.delete(req.params.id);
    res
      .status(200)
      .json(successRes(200, null, "Account is removed successfully"));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

module.exports = {
  index,
  show,
  update,
  remove,
};
