const express = require('express');
const router = express.Router();

const {
  getChatsOfUser,
  postMessage,
  getUsers,
  login,
  logout,
  register,
  postRequest,
  getRequests,
  addFriendship,
  getFriends,
  readMessage,
  readAllMessages,
} = require('../controllers/messages');

router.get('/users', getUsers);
router.post('/friends', getFriends);
router.get('/requests/:userId', getRequests);
router.get('/chats/:userId', getChatsOfUser);
router.get('/logout', logout);

router.post('/messages', postMessage);
router.post('/login', login);
router.post('/register', register);
router.post('/request', postRequest);
router.post('/friendship', addFriendship);

router.patch('/messages/:chatId', readMessage);

module.exports = router;
