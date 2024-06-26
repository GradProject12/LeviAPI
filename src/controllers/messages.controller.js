const MessagesStore = require("../models/message");
const store = new MessagesStore();
const { successRes, errorRes } = require("../services/response");
const io = require("../socket");

const getAllMessage = async (req, res, next) => {
  try {
    const messages = await store.getAllMessage(req.params.chat_id);
    return res
      .status(200)
      .json(successRes(200, messages, "Messages fetched successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const getAllChats = async (req, res, next) => {
  try {
    const messages = await store.getAllChats(req.userId);
    const participantInfo = await store.getChatParticipant(
      messages[0].chat_id,
      req.userId
    );
    const lastMessage = await store.getLastMessage(messages[0].chat_id);
    messages.forEach((chat) => {
      chat.name = participantInfo.full_name;
      chat.reciver = participantInfo;
      chat.lastSent = lastMessage;
    });
    return res
      .status(200)
      .json(successRes(200, messages, "Chats fetched successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  const params = {
    body: req.body.body,
    sender: req.userId,
    reciver: req.params.reciver_id,
    name: req.full_name,
  };
  try {
    const exist = await store.checkIfChatExist(params.sender, params.reciver);
    if (exist.length) params.chat_id = exist[0].chat_id;
    else {
      const chat = await store.createChat(params.name);
      params.chat_id = chat.chat_id;
      await store.addParticipants(params);
    }
    const msg = await store.sendMessage(params);
    io.getIO().emit(params.chat_id.toString(), {
      action: "newMessage",
      message: msg,
    });

    return res
      .status(200)
      .json(successRes(200, msg, "Messages sent successfully."));
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
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await store.delete(req.params.id);
    res.status(200).json(successRes(200, null, "Animal deleted successfully!"));
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
  getAllMessage,
  sendMessage,
  getAllChats,
};
