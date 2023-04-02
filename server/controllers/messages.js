const asyncHandler = require('express-async-handler');

const messagesModel = require('../model/messages');

const getMessages = asyncHandler(async (req, res) => {
  const messages = await messagesModel.getMessages();
  if (messages.length > 0) res.status(200).json(messages);
  else res.status(204).send('No Messages available!');
});

module.exports = { getMessages };
