const express = require('express');
const router = express.Router();

const { getMessages, getChatsOfUser } = require('../controllers/messages');

router.get('/messages', getMessages);
router.get('/chats/:userId', getChatsOfUser);

module.exports = router;
