const DoctorStore = require("../models/doctor");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");

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
