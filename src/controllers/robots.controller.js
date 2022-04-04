const RobotStore = require("../models/robot");
const jwt = require("jsonwebtoken");

const store = new RobotStore();

const index = async (_req, res) => {
  try {
    const robots = await store.index();
    res.json(robots);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
};

const show = async (req, res) => {
  try {
    const robot = await store.show(req.params.id);
    res.json(robot);
  } catch (error) {
    res.status(404);
    res.json(error);
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
    res.json({ username: robot.username, token: token });
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};
const update = async (req, res) => {
  const robot = {
    parent_id: req.body.parent_id,
    doctor_id: req.body.doctor_id,
  };
  try {
    const robot2 = await store.update(robot, req.params.id);
    res.json(robot2);
  } catch (error) {
    res.status(404);
    res.json(`${error}`);
  }
};

const remove = async (req, res) => {
  try {
    const robot = await store.delete(req.params.id);
    res.json(robot);
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
};
