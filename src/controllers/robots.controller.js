const RobotStore = require("../models/robot");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");

const store = new RobotStore();

const index = async (_req, res) => {
  try {
    const robots = await store.index();
    res.status(200).json(successRes(200, robots));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const robot = await store.show(req.params.id);
    res.status(200).json(successRes(200, robot));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const robot = {
    parent_id: req.body.parent_id,
    doctor_id: req.body.doctor_id,
  };
  try {
    const newrobot = await store.create(robot);
    const token = jwt.sign({ robot: newrobot }, process.env.TOKEN_SERCRET);
    res
      .status(200)
      .json(successRes(200, { username: robot.username, token: token }));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};
const update = async (req, res) => {
  const robot = {
    parent_id: req.body.parent_id,
    doctor_id: req.body.doctor_id,
  };
  try {
    const robot2 = await store.update(robot, req.params.id);
    res.status(200).json(successRes(200, robot2));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const robot = await store.delete(req.params.id);
    res.status(200).json(successRes(200, robot));
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
};