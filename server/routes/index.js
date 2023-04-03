const express = require('express');
const router = express.Router();

const {
  getMessages,
  getChatsOfUser,
  postMessage,
} = require('../controllers/messages');

router.get('/messages', getMessages);
router.get('/chats/:userId', getChatsOfUser);

router.post('/messages', postMessage);

module.exports = router;
