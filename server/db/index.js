const { Pool } = require('pg');

const pool = new Pool({
  user: 'chatcliqueuser',
  host: 'localhost',
  database: 'chatclique',
  password: '2Faq!9q&W$',
  port: '5432',
});

module.exports = {
  query: (text, param) => pool.query(text, param),
};
