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
  updateProfile,
  deleteMessage,
  createGroup,
} = require('../controllers/messages');

router.get('/users', getUsers);
router.get('/friends/:userId', getFriends);
router.get('/requests/:userId', getRequests);
router.get('/chats/:userId', getChatsOfUser);
router.get('/logout', logout);

router.post('/messages', postMessage);
router.post('/login', login);
router.post('/register', register);
router.post('/request', postRequest);
router.post('/friendship', addFriendship);
router.post('/group', createGroup);

router.patch('/messages/:chatId', readMessage);
router.patch('/user/:userId', updateProfile);

router.delete('/message/:messageId', deleteMessage);

module.exports = router;
