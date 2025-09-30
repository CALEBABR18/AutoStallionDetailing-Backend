const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });

console.log(
  'Loaded ENV:',
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_PASS,
  process.env.DB_NAME
);

const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
};

module.exports = { getConnection };
