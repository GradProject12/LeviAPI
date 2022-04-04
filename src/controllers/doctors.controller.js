const DoctorStore = require("../models/doctor");
const jwt = require("jsonwebtoken");

const store = new DoctorStore();

const index = async (_req, res) => {
  try {
    const doctors = await store.index();
    res.json(doctors);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const doctor = await store.show(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(404);
    res.json(error);
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
    res.json({ username: doctor.username, token: token });
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
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
    res.json(doctorn);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const doctor = await store.delete(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
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
    res.json({ username: doctorn.username, token });
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
