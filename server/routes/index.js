const express = require('express');
const router = express.Router();

const {
  getMessages,
  getChatsOfUser,
  postMessage,
  getUsers,
  login,
  getUsersById,
  logout,
  register,
} = require('../controllers/messages');

router.get('/messages', getMessages);
router.get('/users/:userId', getUsersById);
router.get('/users', getUsers);
router.get('/chats/:userId', getChatsOfUser);
router.get('/logout', logout);

router.post('/messages', postMessage);
router.post('/login', login);
router.post('/register', register);

module.exports = router;
