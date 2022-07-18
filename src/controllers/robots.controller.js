const RobotStore = require("../models/robot");
const jwt = require("jsonwebtoken");
const { successRes, errorRes } = require("../services/response");

const store = new RobotStore();

const index = async (_req, res, next) => {
  try {
    const robots = await store.index();
    res.status(200).json(successRes(200, robots));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const robot = await store.show(req.params.id);
    res.status(200).json(successRes(200, robot));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const create = async (req, res, next) => {
  const robot = {
    parent_id: req.userId,
    doctor_id: req.body.doctor_id,
  };
  try {
    const newrobot = await store.create(robot);
    const token = jwt.sign({ robot: newrobot }, process.env.TOKEN_SERCRET);
    res
      .status(200)
      .json(successRes(200, { username: robot.username, token: token }));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};
const update = async (req, res, next) => {
  const robot = {
    parent_id: req.userId,
    doctor_id: req.body.doctor_id,
  };
  try {
    const robot2 = await store.update(robot, req.params.id);
    res.status(200).json(successRes(200, robot2));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const robot = await store.delete(req.params.id);
    res.status(200).json(successRes(200, robot));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
