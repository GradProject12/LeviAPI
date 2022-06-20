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

const showParent = async (req, res) => {
  try {
    const parent = await store.showParent(req.params.id);
    const { user_id, password, verified, secret, ...rest } = parent;
    res.status(200).json(successRes(200, rest));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const update = async (req, res) => {
  const parent = {
    email: req.body.email,
    phone: req.body.phone,
    profile_image: req.body.profile_image,
  };
  try {
    if (parent.email && !validator.isEmail(parent.email))
      throw new Error("email address is not valid ");
    if (parent.password && parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.profile_image && !validator.isURL(parent.profile_image, []))
      throw new Error("image path is not valid");
    await store.update(parent, req.params.id);
    res
      .status(200)
      .json(successRes(200, undefined, "Account is updated successfully"));
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

const showParentAnalayses = async (req, res) => {
  try {
    const analyses = await store.showParentAnalayses(req.params.parent_id);
    res.status(200).json(successRes(200, analyses));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const showDoctor = async (req, res) => {
  const { doctor_id, id } = req.params;
  try {
    const { rows, rating_average, reviews_number, rated } =
      await store.showDoctor(doctor_id, id);
    const { working_schedule, ...doctor } = rows[0];
    doctor.working_schedule = Object.values(working_schedule);
    res
      .status(200)
      .json(successRes(200, { doctor, rating_average, reviews_number, rated }));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const rateDoctor = async (req, res) => {
  const params = {
    doctor_id: req.body.doctor_id,
    parent_id: req.params.id,
    rating: +req.body.rating,
    review: req.body.review,
  };
  try {
    if (params.rating > 10 || params.rating < 0)
      throw new Error("Please enter rating value in range (0-10)");
    await store.rateDoctor(params);
    res
      .status(200)
      .json(successRes(200, undefined, "Doctor is rated Successfully."));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const showParentInfo = async (req, res) => {
  try {
    const parent = await store.showParentInfo(req.params.id);
    const doctor = parent.doctor || undefined;
    res.status(200).json(successRes(200, { ...parent.parent[0], doctor }));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

module.exports = {
  index,
  showParent,
  update,
  remove,
  showParentAnalayses,
  showDoctor,
  rateDoctor,
  showParentInfo,
};
