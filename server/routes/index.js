const express = require('express');
const router = express.Router();

const { getMessages } = require('../controllers/messages');

router.get('/messages', getMessages);

module.exports = router;
