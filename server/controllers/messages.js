const asyncHandler = require('express-async-handler');

const messagesModel = require('../model/messages');

const getMessages = asyncHandler(async (req, res) => {
  const messages = await messagesModel.getMessages();
  if (messages.length > 0) res.status(200).json(messages);
  else res.status(204).send('No Messages available!');
});

const getChatsOfUser = asyncHandler(async (req, res) => {
  const chats = await messagesModel.getChatsOfUser(req.params.userId);
  if (chats.length > 0) res.status(200).json(chats);
  else res.status(204).send('No Chats found!');
});

const postMessage = asyncHandler(async (req, res) => {
  req.body.message_id = generateMessageId();
  const message = await messagesModel.postMessage(req.body);
  res.status(200).json(message);
});

const getUsersById = asyncHandler(async (req, res) => {
  const users = await messagesModel.getUsers(req.params.userId);
  res.status(200).json(users);
  // else res.status(204).send('No Messages available!');
});
const getUsers = asyncHandler(async (req, res) => {
  const users = await messagesModel.getUsers();
  res.status(200).json(users);
  // else res.status(204).send('No Messages available!');
});
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await (
      await messagesModel.getUsers()
    ).find((el) => el.username === username && el.password === password);
    if (user) {
      req.session.userId = user.user_id;
      res.status(200).json({ user });
    } else res.status(401).send('Wrong name or password');
  } else res.status(400).send('Login failed');
});

function generateMessageId() {
  const firstMin = 1;
  const firstMax = 99;
  const secondMin = 1000000;
  const secondMax = 9999999;
  const firstNumber = Math.floor(Math.random() * (firstMax - firstMin));
  const secondNumber = Math.floor(Math.random() * (secondMax - secondMin));
  return `${firstNumber.toString()}-${secondNumber.toString()}`;
}

module.exports = {
  getMessages,
  getChatsOfUser,
  postMessage,
  getUsers,
  getUsersById,
  login,
  generateMessageId,
};
