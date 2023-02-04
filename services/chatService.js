const Chat = require("../models/Chat");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const createChat = async (req, res) => {
  try {
    const { _id } = req.payload;
    const { id } = req.params;
    const { message } = req.body;
    const sender = User.findById(_id);
    const receiver = User.findById(id);
    const chat = await Chat.findOne({
      members: { $all: [_id, id] },
    });
    if (chat) {
      chat.conversation.push({
        senderId: _id,
        text: message,
      });
      await chat.save();
      if (!sender.chats.includes(chat._id)) sender.chats.push(chat._id);
      if (!receiver.chats.includes(chat._id)) receiver.chats.push(chat._id);
      return res.status(StatusCodes.OK).json(chat);
    } else {
      const newChat = await Chat.create({
        members: [_id, id],
        conversation: [
          {
            senderId: _id,
            text: message,
          },
        ],
      });
      if (!sender.chats.includes(chat._id)) sender.chats.push(chat._id);
      if (!receiver.chats.includes(chat._id)) receiver.chats.push(chat._id);
      return res.status(StatusCodes.OK).json(newChat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getChats = async (req, res) => {
  try {
    const { _id } = req.payload;
    const chats = await Chat.find({
      members: { $in: [_id] },
    });
    res.status(200).json({
      success: true,
      message: "Chats Found",
      data: chats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createChat,
  getChats,
};
