const DoctorStore = require("../models/doctor");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");
var validator = require("validator");

const store = new DoctorStore();

const index = async (_req, res) => {
  try {
    const doctors = await store.index();
    res.status(200).json(successRes(200, doctors));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const doctor = await store.show(req.params.id);
    res.status(200).json(successRes(200, doctor));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const doctor = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    image: req.body.image,
    clinic_location: req.body.clinic_location,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    days_of_week: req.body.days_of_week,
  };
  try {
    if (!doctor.email) throw new Error("email address is missing");

    if (!doctor.full_name) throw new Error("full name is missing");

    if (!doctor.password) throw new Error("password is missing");

    if (
      doctor.start_time &&
      !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.start_time)
    )
      throw new Error("start time is not valid time");

    if (
      doctor.end_time &&
      !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.end_time)
    )
      throw new Error("end time is not valid time");

    if (!validator.isEmail(doctor.email))
      throw new Error("email address is not valid ");

    if (doctor.password.length < 8)
      throw new Error("password must be at least 8 characters ");

    if (doctor.image && !validator.isURL(doctor.image, []))
      throw new Error("image path is not valid");

    if (
      doctor.phone &&
      !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(doctor.phone)
    )
      throw new Error("phone number is not valid");

    const newdoctor = await store.create(doctor);
    const token = jwt.sign({ doctor: newdoctor }, process.env.TOKEN_SERCRET);
    res
      .status(200)
      .json(successRes(200, { username: doctor.username, token: token }));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};
const update = async (req, res) => {
  const doctor = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    image: req.body.image,
    clinic_location: req.body.clinic_location,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    days_of_week: req.body.days_of_week,
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

      if (doctor.start_time && !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.start_time))
      throw new Error("start time is not valid time");

    if (doctor.end_time && !/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(doctor.end_time))
      throw new Error("end time is not valid time");

    const doctorn = await store.update(doctor, req.params.id);
    res.status(200).json(successRes(200, doctorn));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const doctor = await store.delete(req.params.id);
    res.status(200).json(successRes(200, doctor));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const authenticate = async (req, res) => {
  const doctor = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const doctorn = await store.authenticate(doctor.username, doctor.password);
    const token = jwt.sign({ doctorn }, process.env.TOKEN_SERCRET, {
      expiresIn: "30m",
    });
    res.status(200).json(
      successRes(200, {
        username: doctorn.username,
        role: doctorn.role,
        token,
      })
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
