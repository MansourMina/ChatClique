const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
  query: (text, param) => pool.query(text, param),
};
