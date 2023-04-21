const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const messagesModel = require('../model/messages');

const getChatsOfUser = asyncHandler(async (req, res) => {
  let chats = await messagesModel.getChatsOfUser(req.params.userId);
  if (chats.length > 0) {
    res.status(200).json(chats);
  } else res.status(204).send('No Chats found!');
});

const postMessage = asyncHandler(async (req, res) => {
  req.body.message_id = generateMessageId();
  const message = await messagesModel.postMessage(req.body);
  res.status(200).json(message);
});

const postRequest = asyncHandler(async (req, res) => {
  const request = await messagesModel.postRequest(req.body);
  res.status(200).json(request);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await messagesModel.getUsers();
  res.status(200).json(users);
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await messagesModel.getRequests(req.params.userId);
  res.status(200).json(requests);
});

const getFriends = asyncHandler(async (req, res) => {
  const friends = await messagesModel.getFriends(req.params.userId);
  res.status(200).json(friends);
});

const addFriendship = asyncHandler(async (req, res) => {
  await messagesModel.delRequest(req.body.request_id);
  const friendship = await messagesModel.addFriendship(req.body);
  const chat = await messagesModel.addChat(req.body.date);
  await messagesModel.addChatFriendship(chat.chat_id, friendship.friendship_id);
  res.status(200).json(friendship);
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await messagesModel.getUsersByEmail(email);
    if (user) {
      const comparePassword = await bcrypt.compare(password, user.password);
      if (comparePassword) {
        req.session.userId = user.user_id;
        res.status(200).json({ user });
      } else res.status(401).send('Wrong email or password');
    } else res.status(401).send('Wrong email or password');
  } else res.status(400).send('Login failed');
});

const register = asyncHandler(async (req, res) => {
  const { username, password, name, email } = req.body;
  if (username && password && name && email) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    req.body.userId = await generateUserId();
    const register = await messagesModel.registerUser(req.body);
    res.status(200).json(register);
  } else res.status(400).send('Sign Up failed');
});

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) console.log('You are not logged in!');
  else next();
};

// eslint-disable-next-line operator-linebreak
const logout =
  (redirectLogin,
  (req, res) => {
    req.session.destroy();
    res.clearCookie(process.env.SESSION_NAME);
    res.status(200).send('erfolgreich ausgeloggt');
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

async function generateUserId() {
  let users = await messagesModel.getUsers();
  let allUser_IDS = users.map((el) => el.user_id);

  function randomNumber() {
    let randomID = Math.floor(Math.random() * (9999 - 1000));
    if (allUser_IDS.find((el) => el == randomID)) return randomNumber();
    else return randomID;
  }

  let id = randomNumber();
  return id;
}

const readMessage = asyncHandler(async (req, res) => {
  if (req.body.message_id) {
    const read = await messagesModel.readMessage(
      req.params.chatId,
      req.body.message_id,
    );
    res.status(200).json(read);
  } else {
    const readAll = await messagesModel.readAllMessages(req.params.chatId);
    res.status(200).json(readAll);
  }
});

module.exports = {
  getChatsOfUser,
  postMessage,
  getUsers,
  login,
  generateMessageId,
  logout,
  register,
  postRequest,
  getRequests,
  addFriendship,
  getFriends,
  readMessage,
};
