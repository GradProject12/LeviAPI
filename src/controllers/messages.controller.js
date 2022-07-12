const MessagesStore = require("../models/message");
const store = new MessagesStore();
const { successRes, errorRes } = require("../services/response");
const io = require("../socket");
const index = async (_req, res) => {
  try {
    const messages = await store.index();
    io.getIO("messages", { action: "getAll", messages: messages });
    if (messages.length) return res.status(200).json(successRes(200, messages));
    res.status(200).json(successRes(200, null, "No data exist!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const create = async (req, res) => {
  const animal = {
    name: req.body.name,
    picture: req.body.picture,
    sound: req.body.sound,
    spelled: req.body.spelled,
  };
  try {
    if (!animal.name) {
      const error = new Error("Animal name is missing");
      error.code = 422;
      throw error;
    }
    await store.create(animal);
    res.status(200).json(successRes(200, null, "Animal created successfully!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
const update = async (req, res) => {
  const animal = {
    name: req.body.name,
    picture: req.body.picture,
    sound: req.body.sound,
    spelled: req.body.spelled,
  };
  try {
    if (!animal.name && !animal.picture && !animal.sound && !animal.spelled) {
      const error = new Error("No data is entered!");
      error.code = 422;
      throw error;
    }
    await store.update(animal, req.params.id);
    res.status(200).json(successRes(200, null, "Animal updated successfully!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const remove = async (req, res) => {
  try {
    await store.delete(req.params.id);
    res.status(200).json(successRes(200, null, "Animal deleted successfully!"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

module.exports = {
  index,
};