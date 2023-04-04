const express = require('express');
const router = express.Router();

const {
  getMessages,
  getChatsOfUser,
  postMessage,
  getUsers,
  login,
  getUsersById,
} = require('../controllers/messages');

router.get('/messages', getMessages);
router.get('/users/:userId', getUsersById);
router.get('/users', getUsers);
router.get('/chats/:userId', getChatsOfUser);

router.post('/messages', postMessage);
router.post('/login', login);

module.exports = router;
