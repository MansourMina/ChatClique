const db = require('../db');

async function getMessages() {
  const { rows } = await db.query('SELECT text from messages');
  return rows;
}

module.exports = { getMessages };
