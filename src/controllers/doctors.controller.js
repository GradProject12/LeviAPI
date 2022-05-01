const DoctorStore = require("../models/doctor");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");

const store = new DoctorStore();

const index = async (_req, res) => {
  try {
    if (!res.data.length)
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
    const doctor = await store.show(req.params.id);
    const { user_id, password, verified, secret, ...rest } = doctor;
    res.status(200).json(successRes(200, rest));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const update = async (req, res) => {
  const doctor = {
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    profile_image: req.body.profile_image,
    clinic_location: req.body.clinic_location,
    working_schedule: req.body.working_schedule,
  };
  try {
    if (doctor.email && !validator.isEmail(doctor.email))
      throw new Error("email address is not valid ");
    if (doctor.password && doctor.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (doctor.image && !validator.isURL(doctor.image, []))
      throw new Error("image path is not valid");
    if (
      doctor.phone &&
      !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(doctor.phone)
    )
      throw new Error("phone number is not valid");
    const doctorn = await store.update(doctor, req.params.id);
    res
      .status(200)
      .json(successRes(200, doctorn, "Account is updated successfully"));
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
