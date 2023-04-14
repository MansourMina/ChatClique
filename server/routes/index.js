const express = require('express');
const router = express.Router();

const {
  getMessages,
  getChatsOfUser,
  postMessage,
  getUsers,
  login,
  logout,
  register,
  postRequest,
} = require('../controllers/messages');

router.get('/messages', getMessages);
router.get('/users', getUsers);
router.get('/chats/:userId', getChatsOfUser);
router.get('/logout', logout);

router.post('/messages', postMessage);
router.post('/login', login);
router.post('/register', register);
router.post('/request', postRequest);

module.exports = router;
